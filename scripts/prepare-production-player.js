#!/usr/bin/env node

const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const {spawnSync} = require('child_process');
var util = require('util');
const semver = require('semver');

const args = process.argv.splice(2);

const getKalturaGitPath = name => `https://github.com/kaltura/${name}.git`;

const workspacePath = path.resolve(__dirname, '../.tmp-prod-workspace');
const playerRepoName = 'kaltura-player-js';
const playerRepoBranch = 'v0.48.0';
const playerUIRepoName = 'playkit-js-ui';
const playerUILibraryName = `@playkit-js/${playerUIRepoName}`;
const playerUIRepoBranch = 'FEC-9282-contrib';

async function gitClone(name, branch) {
  console.log(chalk.blue(`git clone kaltura/${name} branch ${branch}`));
  return spawnSync(
    'git',
    [
      'clone',
      '--depth',
      '1',
      '--single-branch',
      '--branch',
      branch,
      getKalturaGitPath(name),
    ],
    {cwd: workspacePath, stdio: 'inherit'}
  );
}

(async function() {
  try {
    // console.log(chalk.blue('create production workspace'));
    // await fs.emptyDir(workspacePath);
    //
    // await gitClone(playerRepoName, playerRepoBranch);
    // await gitClone(playerUIRepoName, playerUIRepoBranch);

    const playerPath = path.resolve(workspacePath, playerRepoName, 'package.json');
    const playerPackageJson = fs.readJsonSync(playerPath);
    const playerVersion = playerPackageJson['dependencies'][playerUILibraryName];

    const playerUIPath = path.resolve(workspacePath, playerUIRepoName, 'package.json');
    const playerUIPackageJson = fs.readJsonSync(playerUIPath);
    const playerUIVersion = playerUIPackageJson.version;

    console.log(chalk.blue(`verify player ui library version`));
    if (!semver.satisfies(playerUIVersion, playerVersion)) {
      throw new Error(`player ui library version '${playerUIVersion}' doesn't satisfy the required player dependency '${playerVersion}'`);
    }
    // todo check that the version of package.json in kaltura


    console.log('success!');
  } catch (err) {
    throw err;
  }
})();
