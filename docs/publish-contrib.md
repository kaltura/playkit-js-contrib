# Publish contrib libraries

### 1. Prepare environment
run the following commands to prepare you environment:

> Warning! those commands will revert unsaved changes
```
git reset --hard
git checkout master
git pull
```

### 2. Deploy new version to Github

#### 2.1 bump version and create changelog files
1. run the following script
```javascript
npm run deploy:prepare
```

2. when asked `Are you sure you want to create these versions`, answer `yes`.

#### 2.2 verify changes during deployment
3. in each folder, the `changelog.md` file should be have modifications pending commit.

4. you should fix changelog files with poorly written commit messages as shown below.

5. in the root `changelog.md` file
 - [ ] make sure only valid scopes were provided (valid scope = name of package like common, ui, linkify)

6. in every library `changelog.md` file:
- [ ] for any record whose scope is incorrect, follow the link and modify the record to the actual change. if the change is of type `chore` just remove it.
- [ ] if no changes remains, use the following message instead. replace `{package scope}` with actual value.
```markdown
**Note:** Version bump only for package @playkit-js-contrib/{package scope}
```

#### 2.3 commit and push changes
7. **copy & execute** the three instuction lines printed in console after step 2.1. It will be similar to the following:
```
  _git_ commit -am "chore(release): publish ${packageVersion}"
  _git_ tag -a v${packageVersion} -m "v${packageVersion}"
  _git_ push --follow-tags
```

6. open [repo releases](https://github.com/kaltura/playkit-js-contrib/releases) 
7. select the new tag, then select `edit tag`, then select `publish release`

### 3. Publish version to NPM

#### 3.1 Pre-requisites

> You should do this only once. No need to re-login everytime

1. Do you have credentials in NPM to publish this library? if not, asked for such credentials.
2. make sure you are logged to npm with the relevant credentials. 
```javascript
npm login
```

#### 3.2 Publish
> NOTICE: the command below should be executed only if you:
> - just completed step 2
> - step 2 was done on this machine  

3. run the following command
```bash
npm run lerna -- publish from-package
```
