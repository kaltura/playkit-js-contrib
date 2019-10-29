#!/usr/bin/env node

const chalk = require('chalk');
const path = require('path');
const util = require('util');
const spawn = util.promisify(require('child_process').spawn);

const rootPath = path.resolve(__dirname,'../');
const lernaPath = 'node_modules/.bin/lerna';
const args = process.argv.splice(2);

(async function() {
  await spawn(lernaPath, ['version', '--no-push', '--no-git-tag-version', ...args ], {cwd: rootPath, stdio: 'inherit'});

  const {version: packageVersion} = require('../lerna.json');
  console.log(chalk`
    {green bump contrib libraries to version {bold ${packageVersion}}} and update CHANGELOG.md files.
    
    To abort changes run:
    {bold git reset --hard}
    
    To commit changes to github run:
    {bold git commit -am "chore(release): publish ${packageVersion}}"
    {bold git tag v${packageVersion}}
    {bold git push --follow-tags}
   
    
  `);
})();

