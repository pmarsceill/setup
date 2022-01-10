const Speaker = require('speaker');
const device = process.argv.length > 2 ? process.argv[2] : undefined;
const channels = 1;
const byteDepth = 2;
const sampleRate = 48000;
// Note it may be the case that the audio device doesn't support these settings,
// although these are sensible defaults.
// TODO: support negotiation of these settings with the audio device.
const speaker = new Speaker({
    channels,
    bitDepth: byteDepth * 8,
    sampleRate,
    device
});
process.on('message', (msg) => {
    switch (msg.type) {
        case 'interrupt': {
            interrupt();
            break;
        }
        default:
            return;
    }
});
process.stdin.on('data', (audioBuffer) => {
    receiveAudioData(audioBuffer);
});
const blockSize = channels * byteDepth * 1024;
const chunkSize = 8 * blockSize;
const bytesPerMs = (sampleRate * byteDepth * channels) / 1000.0;
const msPerByte = 1 / bytesPerMs;
const msPerChunk = chunkSize * msPerByte;
// Makes the audio play smoother, but increases how long
// it takes to interrupt a playing sound
const bufferSize = chunkSize / 2;
// To avoid the end of the audio buffer getting clipped
const endBuffer = Buffer.alloc(chunkSize);
let isPlaying = false;
let resolveInterruptPromise;
let interruptPromise = new Promise((resolve, reject) => resolveInterruptPromise = resolve);
let receivedAudio = [];
let receivedAudioIdx = 0;
let receivedAudioByteLength = 0;
function receiveAudioData(audioBuffer) {
    if (!isPlaying) {
        receivedAudio = [audioBuffer];
        receivedAudioIdx = 0;
        receivedAudioByteLength = audioBuffer.byteLength + 4 * endBuffer.byteLength;
        play();
    }
    else {
        receivedAudio.push(audioBuffer);
        receivedAudioByteLength += audioBuffer.byteLength;
    }
}
// Time that we should be done playing buffered bytes
let bufferedUntil = 0;
let totalBytesPlayed = 0;
let currentBufferBytesPlayed = 0;
async function play() {
    isPlaying = true;
    totalBytesPlayed = 0;
    currentBufferBytesPlayed = 0;
    const startPlayTime = Date.now();
    let continuePlaying = true;
    while (continuePlaying && totalBytesPlayed < receivedAudioByteLength) {
        const playDuration = Date.now() - startPlayTime;
        const expectedBytesPlayed = playDuration * bytesPerMs;
        const expectedBytesPlayedAtNextChunkPlusBuffer = expectedBytesPlayed + chunkSize + bufferSize;
        const targetNextChunkSize = expectedBytesPlayedAtNextChunkPlusBuffer - totalBytesPlayed;
        const roundedTargetNextChunkSize = Math.ceil(targetNextChunkSize / blockSize) * blockSize;
        totalBytesPlayed += write(roundedTargetNextChunkSize);
        bufferedUntil = startPlayTime + totalBytesPlayed * msPerByte;
        const continuePlayingPromise = new Promise((resolve, reject) => setTimeout(() => resolve(true), msPerChunk));
        continuePlaying = await Promise.race([continuePlayingPromise, interruptPromise]);
        // In theory new data could come in between when we finish writing all the queued audio in the call to `write`
        // and when the timeout finishes and we go to the next iteration of the loop. In practice,
        // that doesn't happen as we send all the data up-front.
    }
    await waitUntilDonePlaying();
    isPlaying = false;
    process.send({ type: 'finishedPlaying' });
}
function write(bytes) {
    if (receivedAudioIdx >= receivedAudio.length) {
        speaker.write(endBuffer);
        return endBuffer.byteLength;
    }
    if (currentBufferBytesPlayed + bytes > receivedAudio[receivedAudioIdx].byteLength) {
        const remainingAudio = receivedAudio[receivedAudioIdx].subarray(currentBufferBytesPlayed);
        speaker.write(remainingAudio);
        receivedAudioIdx++;
        currentBufferBytesPlayed = 0;
        if (receivedAudioIdx >= receivedAudio.length) {
            speaker.write(endBuffer.subarray(0, bytes - remainingAudio.byteLength));
            return remainingAudio.byteLength;
        }
        else {
            return write(bytes - remainingAudio.byteLength) + remainingAudio.byteLength;
        }
    }
    speaker.write(receivedAudio[receivedAudioIdx].subarray(currentBufferBytesPlayed, currentBufferBytesPlayed + bytes));
    currentBufferBytesPlayed += bytes;
    return bytes;
}
function interrupt() {
    resolveInterruptPromise(false);
    interruptPromise = new Promise((resolve, reject) => resolveInterruptPromise = resolve);
}
async function waitUntilDonePlaying() {
    const timeUntilDonePlaying = bufferedUntil - (new Date()).getTime();
    if (timeUntilDonePlaying > 0) {
        await new Promise((resolve, reject) => setTimeout(() => resolve(), timeUntilDonePlaying));
    }
}
