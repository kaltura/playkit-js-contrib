# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.1.3](https://github.com/kaltura/playkit-js-contrib/compare/v4.1.2...v4.1.3) (2020-08-18)

**Note:** Version bump only for package @playkit-js-contrib/common





## [4.1.2](https://github.com/kaltura/playkit-js-contrib/compare/v4.1.1...v4.1.2) (2020-07-19)

**Note:** Version bump only for package @playkit-js-contrib/common





## [4.0.2](https://github.com/kaltura/playkit-js-contrib/compare/v4.0.1...v4.0.2) (2020-06-09)

**Note:** Version bump only for package @playkit-js-contrib/common





## [4.0.1](https://github.com/kaltura/playkit-js-contrib/compare/v4.0.0...v4.0.1) (2020-05-31)

**Note:** Version bump only for package @playkit-js-contrib/common





# [4.0.0](https://github.com/kaltura/playkit-js-contrib/compare/v0.53.4-vamb.1...v4.0.0) (2020-05-04)


* Preact free (#227) ([5757633](https://github.com/kaltura/playkit-js-contrib/commit/57576334cf1ac99ce72fa66ebf8848a76d2d08d7)), closes [#227](https://github.com/kaltura/playkit-js-contrib/issues/227)


### BREAKING CHANGES

* before
to host a component on the core Preact tree you needed to set a flag explicitly
```
    this.options.presetManager.add({
      shareAdvancedPlayerAPI: true,
    });
```

after
to prevent a component on the core Preact tree you need to set a flag explicitly
```
    this.options.presetManager.add({
      isolateComponent: true,
    });
```

* chore: remove unused import

Co-authored-by: Eitan Avgil <eitan.avgil@kaltura.com>





## [3.2.3](https://github.com/kaltura/playkit-js-contrib/compare/v3.2.2...v3.2.3) (2020-03-23)

**Note:** Version bump only for package @playkit-js-contrib/common





## [3.2.2](https://github.com/kaltura/playkit-js-contrib/compare/v3.2.1...v3.2.2) (2020-03-12)

**Note:** Version bump only for package @playkit-js-contrib/common





# [3.2.0](https://github.com/kaltura/playkit-js-contrib/compare/v3.1.3...v3.2.0) (2020-02-10)


### Features

* **common:** add configuration ([#166](https://github.com/kaltura/playkit-js-contrib/issues/166)) ([4d72d59](https://github.com/kaltura/playkit-js-contrib/commit/4d72d5935a096952ee5d727dbae92537a9dc4853))





## [3.1.1](https://github.com/kaltura/playkit-js-contrib/compare/v3.1.0...v3.1.1) (2019-12-08)

**Note:** Version bump only for package @playkit-js-contrib/common





# [3.1.0](https://github.com/kaltura/playkit-js-contrib/compare/v3.0.3...v3.1.0) (2019-12-04)


### Features

* **common:** add end type FEV-421  ([#116](https://github.com/kaltura/playkit-js-contrib/issues/116)) ([0ad2d2c](https://github.com/kaltura/playkit-js-contrib/commit/0ad2d2c2635881f09b4a66401fbec65b93875d4b))





## [3.0.1](https://github.com/kaltura/playkit-js-contrib/compare/v3.0.0...v3.0.1) (2019-11-13)


### Bug Fixes

* **common:** create uuid for anonymous user based on player user id (webc-1694) ([5ef7a5a](https://github.com/kaltura/playkit-js-contrib/commit/5ef7a5a16635b09195fbd35264063c27769faa63))



# [3.0.0](https://github.com/kaltura/playkit-js-contrib/compare/v2.3.0...v3.0.0) (2019-11-11)


### Features

* **common:** remove version management in PlayerContribRegistry ([5444a62](https://github.com/kaltura/playkit-js-contrib/commit/5444a623061094cc0c90f58040a1250c50e8a248))
* get list of preset areas from player configuration ([#84](https://github.com/kaltura/playkit-js-contrib/issues/84)) Webc-1688 ([47de969](https://github.com/kaltura/playkit-js-contrib/commit/47de969f8f3459f60259646fc7728ec67b2664ae))





# [2.3.0](https://github.com/kaltura/playkit-js-contrib/compare/v2.2.0...v2.3.0) (2019-11-07)


**Note:** Version bump only for package @playkit-js-contrib/common





# [2.2.0](https://github.com/kaltura/playkit-js-contrib/compare/v2.1.0...v2.2.0) (2019-11-05)

**Note:** Version bump only for package @playkit-js-contrib/common



# [2.1.0](https://github.com/kaltura/playkit-js-contrib/compare/v2.0.1-next.0...v2.1.0) (2019-10-31)


### Features

* **common:** Handle Anonymous User Id (webc-1603) ([f64334b](https://github.com/kaltura/playkit-js-contrib/commit/f64334bba369db1edb92a8e17b0b2ca81619b0e3))
* **common:**  Handle Anonymous User Id (webc-1603) ([#55](https://github.com/kaltura/playkit-js-contrib/issues/55)) ([ab98792](https://github.com/kaltura/playkit-js-contrib/commit/ab98792a4d449432874117804ba3316e9f9ce275))
* **common:** improve events manager typescript support ([2752f16](https://github.com/kaltura/playkit-js-contrib/commit/2752f16c85d2c29b457e6e44be637409de6e0595))
