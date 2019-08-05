# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.1-next.0](https://github.com/kaltura/playkit-js-contrib/compare/v2.0.0...v2.0.1-next.0) (2019-08-05)


### Bug Fixes

* manual update of kitchen sink component ([263c02a](https://github.com/kaltura/playkit-js-contrib/commit/263c02a))
* **build-dev:** fixed wrong import ([5e3d193](https://github.com/kaltura/playkit-js-contrib/commit/5e3d193))
* **push-notification:** fix typo ([ce7f2a5](https://github.com/kaltura/playkit-js-contrib/commit/ce7f2a5))
* **push-notification:** fixed types and import ([93f2344](https://github.com/kaltura/playkit-js-contrib/commit/93f2344))
* **push-notification:** ManageComponent: fix set state using a function ([11e033f](https://github.com/kaltura/playkit-js-contrib/commit/11e033f))
* **push-notification:** manual update of kitchen sink component ([256f94a](https://github.com/kaltura/playkit-js-contrib/commit/256f94a))
* **push-notification:** prevent 0.8 opacity on the kitchen sink content ([eb90d2b](https://github.com/kaltura/playkit-js-contrib/commit/eb90d2b))
* **push-notification:** Through error when can't connect to push server ([33e5a1a](https://github.com/kaltura/playkit-js-contrib/commit/33e5a1a))
* **push-notification:** Throw error when can't connect to push server ([b879423](https://github.com/kaltura/playkit-js-contrib/commit/b879423))
* **ui:** prevent 0.8 opacity on the kitchen sink content ([79eb276](https://github.com/kaltura/playkit-js-contrib/commit/79eb276))


### Features

* add plugin setup interceptor ([e3925b9](https://github.com/kaltura/playkit-js-contrib/commit/e3925b9))
* add tiny event manager ([e9240dc](https://github.com/kaltura/playkit-js-contrib/commit/e9240dc))
* manage player/video size tracking in ui library ([0896ef3](https://github.com/kaltura/playkit-js-contrib/commit/0896ef3))
* **push-notification:** add push ovp push notifications library WEBC-1482 ([93dd644](https://github.com/kaltura/playkit-js-contrib/commit/93dd644))
* **push-notification:** Change register to push notification api (onSocketDisconnect/Reconnect) ([448a118](https://github.com/kaltura/playkit-js-contrib/commit/448a118))
* **ui:** default kitchen sink items to to fill container ([a7e82e6](https://github.com/kaltura/playkit-js-contrib/commit/a7e82e6))
* **ui:** use local preact to allow manual rendering of preset items ([8d2db7f](https://github.com/kaltura/playkit-js-contrib/commit/8d2db7f))





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

**Note:** Version bump only for package root





# [0.1.0](https://github.com/kaltura/playkit-js-contrib/compare/v1.1.1-next.0...v0.1.0) (2019-05-15)


### Features

* create contrib common and ui libraries ([26d28a1](https://github.com/kaltura/playkit-js-contrib/commit/26d28a1))
