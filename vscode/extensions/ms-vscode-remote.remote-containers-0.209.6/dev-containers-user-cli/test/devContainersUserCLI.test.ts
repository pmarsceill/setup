/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { getPackageConfig } from '../../src/node/utils';
import { getRepoTempFolder, verifyRepoIsCloned } from '../../test/dev-containers/src/containerTestUtils';
import { exec as shellExec} from '../../test/core/testUtils';
import { exec } from 'child_process';
import { promisify } from 'util';
import { buildImage, deleteFileIfExists, ensureFolderExists, runInContainer } from './helpers';

const rootFolder = getRepoTempFolder();
ensureFolderExists(rootFolder);
verifyRepoIsCloned('vscode-dev-containers', rootFolder);

const tryFolder = path.join(getRepoTempFolder(), 'vscode-remote-try');
ensureFolderExists(tryFolder);
verifyRepoIsCloned('vscode-remote-try-node', tryFolder);
verifyRepoIsCloned('vscode-remote-try-go', tryFolder);


describe('With devcontainer user CLI', function () {
	this.timeout(1 * 60 * 1000);

	const pkgPath = path.join(__dirname, '..');
	let pkgTgz: string;
	before(async () => {
		const pkgConfig = await getPackageConfig(pkgPath);
		pkgTgz = `vscode-dev-container-cli-${pkgConfig.version}.tgz`;
	});

	it('Should show help', async () => {

		const result = await shellExec([
			'npx',
			pkgTgz,
			'--help',
		].join(' '));

		assert.strictEqual(result.error, null);
		assert.match(result.stdout, new RegExp('  devcontainer build'), 'help should include build command');
		assert.match(result.stdout, new RegExp('  devcontainer '), 'help should include run command');
		assert.doesNotMatch(result.stdout, new RegExp('  devcontainer open'), 'help should not include open command');
	});

	describe(`build (Dockerfile): vscode-remote-try/vscode-remote-try-node`, () => {
		const project = 'vscode-remote-try/vscode-remote-try-node';
		const definitionPath = path.join(rootFolder, project);

		const projectName = project.substring(project.lastIndexOf('/') + 1);
		it('should build with CLI', async function () {
			this.slow(120000);
			this.timeout(120000);
			await buildImage(projectName, pkgTgz, definitionPath);
		});
	});

	describe(`build (docker-compose): vscode-dev-containers/containers/javascript-node-mongo`, () => {
		const project = 'vscode-dev-containers/containers/javascript-node-mongo';
		const definitionPath = path.join(rootFolder, project);

		const projectName = project.substring(project.lastIndexOf('/') + 1);
		it('should build with CLI', async function () {
			this.slow(120000);
			this.timeout(120000);
			await buildImage(projectName, pkgTgz, definitionPath);
		});
	});

	describe('build (image): mcr.microsoft.com/vscode/devcontainers/typescript-node:0-12', () => {
		const imageName = 'mcr.microsoft.com/vscode/devcontainers/typescript-node:0-12';
		let testDir = '';

		before(() => {
			testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dev-containers-user-cli-build-image'));
			fs.mkdirSync(path.join(testDir, '.devcontainer'));
			fs.writeFileSync(path.join(testDir, '.devcontainer', 'devcontainer.json'), `{"image":"${imageName}"}`);
		});
		after(() => {
			fs.rmdirSync(testDir, { recursive: true });
		});

		it('should build with CLI', async function () {
			this.slow(120000);
			this.timeout(120000);
			await buildImage('image-build-test', pkgTgz, testDir, imageName);
		});

	});

	describe(`build and run vscode-remote-try/vscode-remote-try-go`, () => {
		const project = 'vscode-remote-try/vscode-remote-try-go';
		const definitionPath = path.join(rootFolder, project);

		// build the dev container image, then run a `go build` command in an instance of the dev container
		const projectName = project.substring(project.lastIndexOf('/') + 1);
		const imageName = `devcontainer-cli-${projectName.toLowerCase()}`;
		it('should build with CLI', async function () {
			this.slow(120000);
			this.timeout(120000);
			const retainImage = true;
			await buildImage(projectName, pkgTgz, definitionPath, imageName, retainImage);
		});

		it('should run with CLI as the correct user', async function () {
			this.slow(120000);
			this.timeout(120000);

			const uidOutput = 'container-uid';
			deleteFileIfExists(path.join(definitionPath, uidOutput));
			await runInContainer(projectName, pkgTgz, definitionPath, imageName, [`bash -c "id -u > /workspaces/vscode-remote-try-go/${uidOutput}"`]);

			const containerUid = fs.readFileSync(path.join(definitionPath, uidOutput));

			const { stdout } = await promisify(exec)('id -u');
			assert.strictEqual(containerUid.toString().trim(), stdout.trim(), 'Expect container user ID to be aligned with host');
		});

		it('should run with CLI and build the project', async function () {
			this.slow(120000);
			this.timeout(120000);
			const goBuildOutput = 'vscode-remote-try-go';
			deleteFileIfExists(path.join(definitionPath, goBuildOutput));
			await runInContainer(projectName, pkgTgz, definitionPath, imageName, ['go', 'build', '-o', goBuildOutput]);

			const buildOutputExists = fs.existsSync(path.join(definitionPath, goBuildOutput));
			assert.ok(buildOutputExists, 'Expect build output to exist');
		});
	});

});
