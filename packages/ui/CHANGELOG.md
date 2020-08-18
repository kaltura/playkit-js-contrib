# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.1.3](https://github.com/kaltura/playkit-js-contrib/compare/v4.1.2...v4.1.3) (2020-08-18)

**Note:** Version bump only for package @playkit-js-contrib/ui





## [4.1.2](https://github.com/kaltura/playkit-js-contrib/compare/v4.1.1...v4.1.2) (2020-07-19)

**Note:** Version bump only for package @playkit-js-contrib/ui





## [4.1.1](https://github.com/kaltura/playkit-js-contrib/compare/v4.0.3...v4.1.1) (2020-06-18)

**Note:** Version bump only for package @playkit-js-contrib/ui





## [4.0.3](https://github.com/kaltura/playkit-js-contrib/compare/v4.0.2...v4.0.3) (2020-06-17)

**Note:** Version bump only for package @playkit-js-contrib/ui





## [4.0.2](https://github.com/kaltura/playkit-js-contrib/compare/v4.0.1...v4.0.2) (2020-06-09)

**Note:** Version bump only for package @playkit-js-contrib/ui





## [4.0.1](https://github.com/kaltura/playkit-js-contrib/compare/v4.0.0...v4.0.1) (2020-05-31)

**Note:** Version bump only for package @playkit-js-contrib/ui





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

**Note:** Version bump only for package @playkit-js-contrib/ui





## [3.2.2](https://github.com/kaltura/playkit-js-contrib/compare/v3.2.1...v3.2.2) (2020-03-12)

**Note:** Version bump only for package @playkit-js-contrib/ui





# [3.2.0](https://github.com/kaltura/playkit-js-contrib/compare/v3.1.3...v3.2.0) (2020-02-10)


### Bug Fixes

* **ui:** fix banner layout (webc-1766) ([#127](https://github.com/kaltura/playkit-js-contrib/issues/127)) ([a52f91c](https://github.com/kaltura/playkit-js-contrib/commit/a52f91cd732ce6b7264b37a9b032b50814a4e7dd))





## [3.1.3](https://github.com/kaltura/playkit-js-contrib/compare/v3.1.2...v3.1.3) (2019-12-23)

**Note:** Version bump only for package @playkit-js-contrib/ui





## [3.1.2](https://github.com/kaltura/playkit-js-contrib/compare/v3.1.1...v3.1.2) (2019-12-22)

### Features

* **ui:** Support popover  ([#115](https://github.com/kaltura/playkit-js-contrib/issues/115)) ([e988af9](https://github.com/kaltura/playkit-js-contrib/commit/e988af9b31aa8503bc32b965965e63c3c7f839b7))

### Bug Fixes

* improve answer on air banner theme ([#113](https://github.com/kaltura/playkit-js-contrib/issues/113)) WEBC-1728 ([d69e09c](https://github.com/kaltura/playkit-js-contrib/commit/d69e09cbd9afdd3f98c53cc1c0afc23b41103e10))


## [3.1.1](https://github.com/kaltura/playkit-js-contrib/compare/v3.1.0...v3.1.1) (2019-12-08)

**Note:** Version bump only for package @playkit-js-contrib/ui





# [3.1.0](https://github.com/kaltura/playkit-js-contrib/compare/v3.0.3...v3.1.0) (2019-12-04)

**Note:** Version bump only for package @playkit-js-contrib/ui





## [3.0.3](https://github.com/kaltura/playkit-js-contrib/compare/v3.0.2...v3.0.3) (2019-11-21)


### Bug Fixes

* **ui:** use Lato for banner and toast components WEBC-1722 ([a90d354](https://github.com/kaltura/playkit-js-contrib/commit/a90d354e75dbc36a9f6c73baaefabcbed8471d0d))





## [3.0.2](https://github.com/kaltura/playkit-js-contrib/compare/v3.0.1...v3.0.2) (2019-11-18)


### Bug Fixes

* **ui:** adding a root style for aligning text to the left as default ([#100](https://github.com/kaltura/playkit-js-contrib/issues/100)) WEBC-1721 ([90b4f25](https://github.com/kaltura/playkit-js-contrib/commit/90b4f25e3c5f02907cede5bca5c38bcfb4c09b83))





## [3.0.1](https://github.com/kaltura/playkit-js-contrib/compare/v3.0.0...v3.0.1) (2019-11-13)

* **ui:** load font in contrib services ([#98](https://github.com/kaltura/playkit-js-contrib/issues/98)) ([6770f38](https://github.com/kaltura/playkit-js-contrib/commit/6770f380a1c7b6b3ce6dea24278a2879bb017e63))






# [3.0.0](https://github.com/kaltura/playkit-js-contrib/compare/v2.3.0...v3.0.0) (2019-11-11)


### Bug Fixes

* **ui:** remove ui manager and expose ui manager thru the contrib services ([49d3f1e](https://github.com/kaltura/playkit-js-contrib/commit/49d3f1e2e085836a3fcde3568679e4fdef8923b6))


### Features

* get list of preset areas from player configuration ([#84](https://github.com/kaltura/playkit-js-contrib/issues/84)) Webc-1688 ([47de969](https://github.com/kaltura/playkit-js-contrib/commit/47de969f8f3459f60259646fc7728ec67b2664ae))
* add api to ui player events ([c746f93](https://github.com/kaltura/playkit-js-contrib/commit/c746f93200e86c4c12ca355b81130e0b760de2a8))


### BREAKING CHANGES

* **ui:** previously
```
contribServices.uiManagers.floating.add(...)
```

now
```
contribServices.floatingManager.add(...)
```




# [2.3.0](https://github.com/kaltura/playkit-js-contrib/compare/v2.2.0...v2.3.0) (2019-11-07)


### Features

* **ui:** add configurable background layout to the kitchenSink ([#78](https://github.com/kaltura/playkit-js-contrib/issues/78)) ([ca7ed06](https://github.com/kaltura/playkit-js-contrib/commit/ca7ed067b2684055be554eff6d4ce1659388515c))





# [2.2.0](https://github.com/kaltura/playkit-js-contrib/compare/v2.1.0...v2.2.0) (2019-11-05)


### Features

* **ui:** add overlay manager ([#77](https://github.com/kaltura/playkit-js-contrib/issues/77)) ([12e629b](https://github.com/kaltura/playkit-js-contrib/commit/12e629b80d5a0e45ea3fde8fb70846b4a20f8121))
* **ui:** allow dynamic add/remove for kitchensink and upperbar items([#80](https://github.com/kaltura/playkit-js-contrib/issues/80)) ([648b394](https://github.com/kaltura/playkit-js-contrib/commit/648b39465fa11fdefa4e173d95edeb625fe5124d))





# [2.1.0](https://github.com/kaltura/playkit-js-contrib/compare/v2.0.1-next.0...v2.1.0) (2019-10-31)


### Bug Fixes

* **ui:** isolate kitchen sink content from player preact tree ([71a42c7](https://github.com/kaltura/playkit-js-contrib/commit/71a42c7aba12b474e28ec06c0474cd02ac440ff8))
* **ui:** kitchensink and upper bar managers explicitly refresh the preset component when items are added to them ([295531d](https://github.com/kaltura/playkit-js-contrib/commit/295531d6dcf101037cbdf9110dae3fd4b3ec20af))
* **ui:** provide temoprary solution for layout issues of kitchen sink content ([84ed938](https://github.com/kaltura/playkit-js-contrib/commit/84ed938cac171b3fe275f68f00cb895a7b1c18a1))


### Features

* **ui:** add announcements support WEBC-1450 ([#22](https://github.com/kaltura/playkit-js-contrib/issues/22)) ([a017ade](https://github.com/kaltura/playkit-js-contrib/commit/a017adec4f5c0d0c276d504309d1747b4979bf36))
* **ui:** add normalize css  ([#45](https://github.com/kaltura/playkit-js-contrib/issues/45)) FEV-390 ([236ba7e](https://github.com/kaltura/playkit-js-contrib/commit/236ba7eb0efe6aa72cdf685b2cea6d28fd27f788))
* export managed-component ([#53](https://github.com/kaltura/playkit-js-contrib/issues/53)) ([bce313d](https://github.com/kaltura/playkit-js-contrib/commit/bce313d63434b0280f9d11c40ba4da69d8f65131))
* **ui:** allow downloadContent, printContent and debounce FEV-355 ([#67](https://github.com/kaltura/playkit-js-contrib/issues/67)) ([1464d0b](https://github.com/kaltura/playkit-js-contrib/commit/1464d0b8cd8e6e650618c475fe37e35fd943db2f))
* **ui:** customize player and plugins font and support dynamic download WEBC-1505  ([#60](https://github.com/kaltura/playkit-js-contrib/issues/60)) ([04fa438](https://github.com/kaltura/playkit-js-contrib/commit/04fa43883f3b973987e419f0707a4fecb559e820))
* **ui:** kitchenSinkItem api additions ([94b4ba8](https://github.com/kaltura/playkit-js-contrib/commit/94b4ba8d4c0df23f3813343846c55cd263456f5d))
* **ui:** name changes - announcement to banner ([c77d65b](https://github.com/kaltura/playkit-js-contrib/commit/c77d65b08f8d22e18d9a9b813066296450eae6a4))
* **ui:** toast component ui changes WEBC-1566 ([2351096](https://github.com/kaltura/playkit-js-contrib/commit/2351096153fdbdeef4013fa9ec084bbd51a64712))
* **ui:** Toasts ([5ca456c](https://github.com/kaltura/playkit-js-contrib/commit/5ca456c904f7194cad929a9d80d73bbfa1361b4f))
* **ui:** toggle kitchenSink on menu icon click ([#50](https://github.com/kaltura/playkit-js-contrib/issues/50)) WEBC-1634 ([569c7ba](https://github.com/kaltura/playkit-js-contrib/commit/569c7ba29ab2f5e87015dd74f4fa0f641477fa50))
