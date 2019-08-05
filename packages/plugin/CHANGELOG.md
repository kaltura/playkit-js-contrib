# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.1-next.0](https://github.com/kaltura/playkit-js-contrib/compare/v2.0.0...v2.0.1-next.0) (2019-08-05)


### Bug Fixes

* **build-dev:** fixed wrong import ([5e3d193](https://github.com/kaltura/playkit-js-contrib/commit/5e3d193))


### Features

* add plugin setup interceptor ([e3925b9](https://github.com/kaltura/playkit-js-contrib/commit/e3925b9))
* **push-notification:** add push ovp push notifications library WEBC-1482 ([93dd644](https://github.com/kaltura/playkit-js-contrib/commit/93dd644))





# [2.0.0](https://github.com/kaltura/playkit-js-contrib/compare/v0.1.1...v2.0.0) (2019-06-02)


### Features

* add new library named plugin ([b9f5c44](https://github.com/kaltura/playkit-js-contrib/commit/b9f5c44))
* add upper bar manager with upper bar menu ([27eb4fc](https://github.com/kaltura/playkit-js-contrib/commit/27eb4fc))
* rename library to contrib which better represent its purpose ([6141502](https://github.com/kaltura/playkit-js-contrib/commit/6141502))
* support external presets components in kaltura player (currently works only on local version of kaltura player) ([c66f9f9](https://github.com/kaltura/playkit-js-contrib/commit/c66f9f9))
* use interfaces to expose contrib actions and guard from plugin errors ([f6c47b2](https://github.com/kaltura/playkit-js-contrib/commit/f6c47b2))


### BREAKING CHANGES

* Before - using protected methods
```
_onMediaLoaded();
_onInitMembers();
_onAddBindings(this.eventManager);
_onAddOverlays(this._environment.uiManager);
```

After - by implementing interfaces
```
onMediaLoad(config: KalturaServerConfig): void; // interface OnMediaLoad
onMediaUnload(): void; // interface OnMediaUnload
onRegisterEvents(eventManager: any): void; // interface OnRegisterEvents
onRegisterUI(uiManager: UIManager): void; // interface OnRegisterUI
```
* all imports of contrib libraries should be refactored to use the new name of each library
* changes in ui manager class names
* move base plugin and ui manager to new plugin library





## [0.1.1](https://github.com/kaltura/playkit-js-contrib/compare/v0.1.0...v0.1.1) (2019-05-15)

**Note:** Version bump only for package @playkit-js/contrib-ui





# [0.1.0](https://github.com/kaltura/playkit-js-contrib/compare/v1.1.1-next.0...v0.1.0) (2019-05-15)


### Features

* create contrib common and ui libraries ([26d28a1](https://github.com/kaltura/playkit-js-contrib/commit/26d28a1))
