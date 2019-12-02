# Publish (any) contrib plugin

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

2. answer the questions in the wizard. see explanation if needed:
  - Are you ready to begin? **Yes**
  - Did you work with local version of contrib libraries? 
    - answer **Yes** if: [MISSING]
    - otherwise, answer **No** 
  - Did you or someone else published those changes to npm?
    - answer **Yes** if: [MISSING] 
    - otherwise, answer **No**

#### 2.2 Verify changes during deployment

5. review the `changelog.md` file and make sure it is well written.
  - [ ] 

#### 2.3 Commit and push changes
7. **copy & execute** the three instuction lines printed in console after step 2.1. It will be similar to the following:
```
  _git_ commit -am "chore: publish version ${version}"
  _git_ tag -a ${tagName} -m "${tagName}"
  _git_ git push --follow-tags  
```

7. open the plugin repo > releases

#### 2.4 Create a release based on the new tag 
8. open github releases page
9. copy content of previous release
10. edit new tag and paste the content of the previous release
11. create the release 

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
npm run deploy:publish-to-npm
```

### 4. Deploy version to QA Bundler
> You will need to be in the office or use the vpn to access the relevant machine.

1. open [https://il-git-qa-ubu.dev.kaltura.com/index.html#Update_Plugins_For_Player_v7](https://il-git-qa-ubu.dev.kaltura.com/index.html#Update_Plugins_For_Player_v7).
2. fill form and follow the cli output to make sure publish succeeded. 
