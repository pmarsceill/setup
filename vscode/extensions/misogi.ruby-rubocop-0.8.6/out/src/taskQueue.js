"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskQueue = exports.Task = void 0;
/**
 * Task with async operation. It will be enqueued to and managed by
 * TaskQueue. Useful for spawning ChildProcess.
 */
class Task {
    /**
     * @param body Function of task body, which returns callback called
     *             when cancelation is requested. You should call
     *             token.finished() after async operation is done.
     */
    constructor(uri, body) {
        this.isEnqueued = false;
        this.isCanceled = false;
        this.uri = uri;
        this.body = body;
    }
    run() {
        if (this.isCanceled) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const task = this;
        return new Promise((resolve) => {
            task.resolver = () => resolve();
            const token = {
                get isCanceled() {
                    return task.isCanceled;
                },
                finished() {
                    task.resolveOnce();
                },
            };
            task.onCancel = this.body(token);
        });
    }
    cancel() {
        if (this.isCanceled) {
            return;
        }
        this.isCanceled = true;
        if (this.onCancel) {
            this.onCancel();
        }
        this.resolveOnce();
    }
    resolveOnce() {
        if (this.resolver) {
            this.resolver();
            this.resolver = undefined;
        }
    }
}
exports.Task = Task;
/**
 * Provides single-threaded task queue which runs single asynchronous
 * Task at a time. This restricts concurrent execution of rubocop
 * processes to prevent from running out machine resource.
 */
class TaskQueue {
    constructor() {
        this.tasks = [];
        this.busy = false;
    }
    get length() {
        return this.tasks.length;
    }
    enqueue(task) {
        if (task.isEnqueued) {
            throw new Error('Task is already enqueued. (uri: ' + task.uri + ')');
        }
        this.cancel(task.uri);
        task.isEnqueued = true;
        this.tasks.push(task);
        this.kick();
    }
    cancel(uri) {
        const uriString = uri.toString(true);
        this.tasks.forEach((task) => {
            if (task.uri.toString(true) === uriString) {
                task.cancel();
            }
        });
    }
    async kick() {
        if (this.busy) {
            return;
        }
        this.busy = true;
        // eslint-disable-next-line  no-constant-condition
        while (true) {
            const task = this.tasks[0];
            if (!task) {
                this.busy = false;
                return;
            }
            try {
                await task.run();
            }
            catch (e) {
                console.error('Error while running rubocop: ', e.message, e.stack);
            }
            this.tasks.shift();
        }
    }
}
exports.TaskQueue = TaskQueue;
//# sourceMappingURL=taskQueue.js.map