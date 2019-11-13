#!/usr/bin/env node

const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const {spawnSync} = require('child_process');
var util = require('util');
const semver = require('semver');
const os = require("os");
var inquirer = require('inquirer');

const args = process.argv.splice(2);

// environment variables
const workspacePath = path.resolve(__dirname, '../.tmp-prod-workspace');
const contribDistPath = path.resolve(__dirname, '../production-player');


// static variables
const playerRepoName = 'kaltura-player-js';
const playerRepoPath = path.resolve(workspacePath, playerRepoName);
const playerRepoDistPath = path.resolve(playerRepoPath, 'dist');
const playerRepoPackageJsonPath = path.resolve(playerRepoPath, 'package.json');
const playerRepoNodeModules = path.resolve(workspacePath, playerRepoName, 'node_modules');

const playerProviderRepoName = 'playkit-js-providers';
const playerProviderRepoLibraryName = playerProviderRepoName;
const playerProviderRepoPath = path.resolve(workspacePath, playerProviderRepoName);
const playerProviderRepoPackageJsonPath = path.resolve(playerProviderRepoPath, 'package.json');

const playerUIRepoName = 'playkit-js-ui';
const playerUIRepoLibraryName = `@playkit-js/${playerUIRepoName}`;
const playerUIRepoPath = path.resolve(workspacePath, playerUIRepoName);
const playerUIRepoPackageJsonPath = path.resolve(playerUIRepoPath, 'package.json');


function getKalturaGitPath(name) {
  return `https://github.com/kaltura/${name}.git`;
}


function runSpawn(command, args, extra = {}) {
  const stdio = typeof extra.stdio === 'string' ? [extra.stdio,extra.stdio, 'pipe'] :
    Array.isArray(extra.stdio) && extra.stdio.length === 3 ? [extra.stdio[0], extra.stdio[1], 'pipe'] : 'inherit' // 'pipe'
  const result = spawnSync(command, args, { ...extra, stdio});

  if (result.status === null || result.status !== 0) {
    throw new Error(result.stderr || 'general error');
  }

  return result;
}


function gitClone(name, branch) {
  console.log(chalk.blue(`git clone kaltura/${name} branch ${branch}`));
  return runSpawn(
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

function verifyRepositoriesVersions() {
  const playerPackageJson = fs.readJsonSync(playerRepoPackageJsonPath);
  const expectedUIVersion = playerPackageJson['dependencies'][playerUIRepoLibraryName];
  const expectedProviderVersion = playerPackageJson['dependencies'][playerProviderRepoLibraryName];

  const playerUIPackageJson = fs.readJsonSync(playerUIRepoPackageJsonPath);
  const playerUIVersion = playerUIPackageJson.version;

  const playerProviderPackageJson = fs.readJsonSync(playerProviderRepoPackageJsonPath);
  const playerProviderVersion = playerProviderPackageJson.version;

  console.log(chalk.blue(`verify player ui library version`));
  if (!semver.satisfies(playerUIVersion, expectedUIVersion)) {
    throw new Error(`player ui library version '${playerUIVersion}' doesn't satisfy the required player dependency '${expectedUIVersion}'`);
  }

  console.log(chalk.blue(`verify player provider library version`));
  if (expectedProviderVersion.indexOf(playerProviderVersion) === -1) {
    throw new Error(`player ui library version '${playerProviderVersion}' doesn't satisfy the required player dependency '${expectedProviderVersion}'`);
  }
}

function installDependencies() {

  console.log(chalk.blue('install player ui dependencies'));
  runSpawn(
    'yarn',
    [
    ],
    {cwd: playerUIRepoPath }
  );

  console.log(chalk.blue('install player provider dependencies'));
  runSpawn(
    'yarn',
    [
    ],
    {cwd: playerProviderRepoPath }
  );

  console.log(chalk.blue('install player dependencies'));
  runSpawn(
    'yarn',
    [
    ],
    {cwd: playerRepoPath }
  );
}

function symlinkDependencies() {
  const uiDestination = path.resolve(playerRepoNodeModules, playerUIRepoLibraryName);

  console.log(chalk.blue('symlink player ui into player'));
  fs.removeSync(uiDestination);
  runSpawn(
    'ln',
    [
      '-s',
      playerUIRepoPath,
      uiDestination,
    ]
  );

  const providerDestination = path.resolve(playerRepoNodeModules, playerProviderRepoLibraryName);

  console.log(chalk.blue('symlink player provider into player'));
  fs.removeSync(providerDestination);
  runSpawn(
    'ln',
    [
      '-s',
      playerProviderRepoPath,
      providerDestination,
    ]
  );
}

async function alterPlayerVersion() {
  const playerPackageJson = fs.readJsonSync(playerRepoPackageJsonPath);

  const originalVersion = playerPackageJson['version'];
  let defaultVersion = originalVersion;

  if (defaultVersion.indexOf('vamb') === -1) {
    defaultVersion = `${playerPackageJson['version']}-vamb.1`;
  }

  const contribVersion = await promptContribVersion(defaultVersion);

  playerPackageJson['version'] = contribVersion;
  fs.writeJsonSync(playerRepoPackageJsonPath, playerPackageJson, {spaces: 2});
}

function buildPlayer() {
  console.log(chalk.blue('delete player dist'));
  fs.emptyDirSync(playerRepoDistPath);

  console.log(chalk.blue('build player ui library'));
  runSpawn(
    'yarn',
    [
      'build'
    ],
    {cwd: playerUIRepoPath });

  console.log(chalk.blue('build player provider library'));
  runSpawn(
    'yarn',
    [
      'build'
    ],
    {cwd: playerProviderRepoPath });

  console.log(chalk.blue('build player'));
  runSpawn(
    'yarn',
    [
      'build:ovp'
    ],
    {cwd: playerRepoPath }
  );
}

function prepareLocalVersion() {
  fs.emptyDirSync(contribDistPath);
  const playerVersion = getPlayerVersion();
  const distFolder = path.resolve(contribDistPath, playerVersion);

  fs.copySync(
    `${playerRepoDistPath}/kaltura-ovp-player.js`,
    `${distFolder}/kaltura-ovp-player.js`,
  );

  fs.copySync(
    `${playerRepoDistPath}/kaltura-ovp-player.js.map`,
    `${distFolder}/kaltura-ovp-player.js.map`,
  )

  const {stdout: playerHash} = runSpawn('git', ['rev-parse', 'HEAD'], {cwd: playerRepoPath,
  stdio: 'pipe'});

  const {stdout: playerUIHash} = runSpawn('git', ['rev-parse', 'HEAD'], {cwd: playerUIRepoPath,
    stdio: 'pipe'});

  const {stdout: playerProviderHash} = runSpawn('git', ['rev-parse', 'HEAD'], {cwd: playerProviderRepoPath,
    stdio: 'pipe'});

  const contribGitHashesPath = path.resolve(contribDistPath, `${playerVersion}-sha1.json`);
  const contribGitHashes = {
    github: {
      [playerRepoName]: playerHash.toString().trim('\\n'),
      [playerUIRepoName]: playerUIHash.toString().trim('\\n'),
      [playerProviderRepoName]: playerProviderHash.toString().trim('\\n')
    }
  };

  fs.writeJsonSync(contribGitHashesPath, contribGitHashes, {spaces: 2});

  runSpawn('git', ['add', `${contribDistPath}/*`]);
}

function deleteWorkspaceFolder() {
  console.log(chalk.blue('remove temp folder'));
  fs.removeSync(workspacePath);
}

function getPlayerVersion() {
  const playerPackageJson = fs.readJsonSync(playerRepoPackageJsonPath);
  return playerPackageJson['version'];
}
function showSummary(playerContribVersion) {
  const tagName = `kaltura-ovp-player@${playerContribVersion}`;

  console.log(chalk`
    {green Successfully created contrib VAMB artifacts.
     
    Version :${playerContribVersion}  
    Destination folder: vamb-player}
    
    Before committing please test version.
    Also, make sure temp folder '${workspacePath}' was deleted. if not, delete it manually. 
      
    To abort changes run:
    {bold git reset --hard}
    
    To commit changes to github run:
    {bold git commit -am "chore(release): prepare player contrib production version ${playerContribVersion}"}
    {bold git tag -a ${tagName} -m "contrib production player v${playerContribVersion}"}
    {bold git push --follow-tags}  
  `);
}

function verifyEnvironment() {
  console.log(chalk.blue(`verify operation system is MacOS`));
  if (os.type() !== "Darwin") {
    throw new Error('please run this script in MacOS');
  }
  console.log(chalk.blue('verify environment'));
  runSpawn('yarn', ['-v'], { stdio: 'inherit'});
  runSpawn('git', ['--version'], { stdio: 'inherit'});
}

async function cloneRepositories() {

  const {playerUIRepoBranch, playerRepoTag, playerProviderRepoBranch} = await promptParameters();
  console.log(chalk.blue('create production workspace'));
  fs.emptyDirSync(workspacePath);
  gitClone(playerRepoName, playerRepoTag);
  gitClone(playerUIRepoName, playerUIRepoBranch);
  gitClone(playerProviderRepoName, playerProviderRepoBranch || 'master');
}

async function promptWelcome() {
  console.log(chalk`{bgCyan {bold Welcome!}}
This script will create a contrib version of core player.
It is going to take around 10 minutes
`);
  const {ready} = await inquirer.prompt(
    [{
      name: 'ready',
      type: 'confirm',
      message: 'Are you ready to begin?'
    }]
  );

  if (!ready) {
    console.log('See you next time....');
  }

  return ready;
}

async function promptParameters() {
  const parameters = await inquirer.prompt(
    [{
      name: 'playerRepoTag',
      type: 'input',
      message: 'what is the tag name of requested repository kaltura/kaltura-player-js?'
    },
      {
        name: 'playerUIRepoBranch',
        type: 'input',
        message: 'what is the branch name of requested repository kaltura/playkit-js-ui?',
        default: 'FEC-9282-contrib'
      }, {
        name: 'playerProviderRepoBranch',
        type: 'input',
        message: 'what is the branch name of requested repository playkit-js-providers?',
        default: ''
      }]
  );
  return parameters;
}

function fixEsLintIssueInProvider() {
  const filename = path.resolve(playerProviderRepoPath, 'webpack.config.js');
  console.log(chalk.blue(`disable eslint in provider ('${filename}')`));

  const data = fs.readFileSync(filename, 'utf8');
  let newData = data.split('\n');
  const spliced = newData.splice(45, 8).join('').trim().replace(/[ \t]/g, '');

  if (spliced !== '{loader:\'eslint-loader\',options:{rules:{semi:0}}}') {
    throw new Error('cannot alter provider library webpack, it was modified since last reviewed');
  }

  fs.writeFileSync(filename, newData.join('\n'));
}

async function promptContribVersion(defaultValue) {
  const {contribVersion} = await inquirer.prompt(
    [{
      name: 'contribVersion',
      type: 'input',
      message: 'what is the desired contrib player version?',
      default: defaultValue
    }
    ]
  );
  return contribVersion;
}

(async function() {
  try {

    if (!await promptWelcome()) {
      return;
    }

    verifyEnvironment();
    await cloneRepositories();
    verifyRepositoriesVersions();
    installDependencies();
    symlinkDependencies();
    await alterPlayerVersion();
    fixEsLintIssueInProvider();
    buildPlayer();
    prepareLocalVersion();
    const playerContribVersion = getPlayerVersion();
    deleteWorkspaceFolder();
    showSummary(playerContribVersion);
  } catch (err) {
    console.error(err);
  }
})();


