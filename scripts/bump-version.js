#!/usr/bin/env node

const chalk = require('chalk');
const path = require('path');
const spawnSync = require('child_process').spawnSync;

const rootPath = path.resolve(__dirname,'../');
const lernaPath = 'node_modules/.bin/lerna';
const args = process.argv.splice(2);

(function() {
  spawnSync(lernaPath, ['version', '--no-push', '--no-git-tag-version', ...args ], {cwd: rootPath, stdio: 'inherit'});

  const {version: packageVersion} = require('../lerna.json');
  console.log(chalk`
    {green Successfully updated contrib libraries versions to {bold ${packageVersion}} and updated relevant CHANGELOG.md files.}
    
    Please review changes before continuing with the publish.
      
    To abort changes run:
    {bold git reset --hard}
    
    To commit changes to github run:
    {bold git commit -am "chore(release): publish ${packageVersion}}"
    {bold git tag v${packageVersion}}
    {bold git push --follow-tags}  
  `);
})();

