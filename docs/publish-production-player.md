# Publish Production Player

### 2. Deploy new version to Github

#### 2.1 update production player in this repository based on relevant branches
1. run the following script
```javascript
npm run deploy:production-player
```
#### 2.2 deploy player into q.a environment bundler
1. copy production folder `production-player/x.y.z-vamb.x` manually into q.a environment bundler

2. make sure it works as expected.

#### 2.3 commit and push changes
1. **copy & execute** the three instuctions lines printed in console after step 2.1. It will be similar to the following:
```
  _git_ commit -am "chore(release): publish ${packageVersion}"
  _git_ tag -a kaltura-ovp-player@${packageVersion} -m "kaltura-ovp-player@${packageVersion}"
  _git_ push --follow-tags
```
