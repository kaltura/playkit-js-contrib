# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.2](https://github.com/kaltura/playkit-js-contrib/compare/v3.0.1...v3.0.2) (2019-11-18)

**Note:** Version bump only for package @playkit-js-contrib/plugin


## [3.0.1](https://github.com/kaltura/playkit-js-contrib/compare/v3.0.0...v3.0.1) (2019-11-13)


### Bug Fixes

**Note:** Version bump only for package @playkit-js-contrib/plugin



# [3.0.0](https://github.com/kaltura/playkit-js-contrib/compare/v2.3.0...v3.0.0) (2019-11-11)


### Features

* **plugin:** replace onRegisterUI with OnRegisterPresetsComponents ([602ee89](https://github.com/kaltura/playkit-js-contrib/commit/602ee89bc589db0140f4a2c0acc9788399a00dbc))

### BREAKING CHANGES
 
* previously
```
class AnyPlugin() {
   onRegisterUI(uiManager: UIManager) {
      // register any ui component needed by plugin
   }
}
```

now
```
class AnyPlugin() {
   onRegisterPresetsComponents(presetManager: PresetManager) {
      // register only plugin components that are directly managed by the presetManager
      // move other registrations into onMediaLoad or onPluginSetup
   }
}
```



# [2.3.0](https://github.com/kaltura/playkit-js-contrib/compare/v2.2.0...v2.3.0) (2019-11-07)


### Features

**Note:** Version bump only for package @playkit-js-contrib/plugin





# [2.2.0](https://github.com/kaltura/playkit-js-contrib/compare/v2.1.0...v2.2.0) (2019-11-05)


### Features

**Note:** Version bump only for package @playkit-js-contrib/plugin





# [2.1.0](https://github.com/kaltura/playkit-js-contrib/compare/v2.0.1-next.0...v2.1.0) (2019-10-31)


### Bug Fixes

* **plugin:** support different plugin registration modes ([a6f1de7](https://github.com/kaltura/playkit-js-contrib/commit/a6f1de75b329605b4bb7774848668926e536935e))


### Features

* **plugin:** add data to ContribConfig and OnMediaLoadConfig ([c3f259c](https://github.com/kaltura/playkit-js-contrib/commit/c3f259c66a4257ffbb803bbe67d0b8c26a06a8fa))
