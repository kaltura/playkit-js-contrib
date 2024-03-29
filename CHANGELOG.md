# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.1.13](https://github.com/kaltura/playkit-js-contrib/compare/v4.1.12...v4.1.13) (2021-12-05)


### Bug Fixes

* **FEV-413:** i as Kaltura want to define the order in which the plugins are shown on the player ([#373](https://github.com/kaltura/playkit-js-contrib/issues/373)) ([5442ab9](https://github.com/kaltura/playkit-js-contrib/commit/5442ab9397d420de488306dc7e2199c74a06a844))





## [4.1.12](https://github.com/kaltura/playkit-js-contrib/compare/v4.1.11...v4.1.12) (2021-11-09)


### Bug Fixes

* **FEV-1137:** hotspot isn't shown in safari ([#372](https://github.com/kaltura/playkit-js-contrib/issues/372)) ([536b070](https://github.com/kaltura/playkit-js-contrib/commit/536b070f2841cd507801301661eb66ab1fd795f2))





## [4.1.11](https://github.com/kaltura/playkit-js-contrib/compare/v4.1.10...v4.1.11) (2021-11-08)


### Bug Fixes

* **FEV-1137:** hotspot isn't shown in safari ([#368](https://github.com/kaltura/playkit-js-contrib/issues/368)) ([7748b16](https://github.com/kaltura/playkit-js-contrib/commit/7748b166814b442c03fbe9f1b5343a7f3741e497))
* **FEV-1137:** hotspot isn't shown in safari ([#371](https://github.com/kaltura/playkit-js-contrib/issues/371)) ([ff1e374](https://github.com/kaltura/playkit-js-contrib/commit/ff1e3743b0d8fa77411ad7bf45728aceff3cd7b5))





## [4.1.10](https://github.com/kaltura/playkit-js-contrib/compare/v4.1.9...v4.1.10) (2021-07-05)


### Bug Fixes

* **fev-964:** use redux value to define player size ([#366](https://github.com/kaltura/playkit-js-contrib/issues/366)) ([a3c1998](https://github.com/kaltura/playkit-js-contrib/commit/a3c19984ea81a0cd6f3ac9b34235c0808a796348))





## [4.1.9](https://github.com/kaltura/playkit-js-contrib/compare/v4.1.8...v4.1.9) (2021-05-13)


### Bug Fixes

* **fev-647:** use player event listener instead of event manager ([#352](https://github.com/kaltura/playkit-js-contrib/issues/352)) ([4a875fb](https://github.com/kaltura/playkit-js-contrib/commit/4a875fb0f2acfcafe5160d27791a30fef041d90e))





## [4.1.8](https://github.com/kaltura/playkit-js-contrib/compare/v4.1.7...v4.1.8) (2021-04-23)


### Bug Fixes

* **fev-803:** change classname for upper-bar icon cause of f-awesome use same classname ([#345](https://github.com/kaltura/playkit-js-contrib/issues/345)) ([90b117b](https://github.com/kaltura/playkit-js-contrib/commit/90b117bcc7a974283cb2c534c6e8f9f447b3f89d))





## [4.1.7](https://github.com/kaltura/playkit-js-contrib/compare/v4.1.6...v4.1.7) (2021-04-21)


### Bug Fixes

* **FEV-665:** hide oversized text in banner ([3fe9e7d](https://github.com/kaltura/playkit-js-contrib/commit/3fe9e7d96fa46aad51d2e1a5fc56ddceaf1df1ae))
* **fev-856:** trigger onMessage callback for each event subscription ([30626b8](https://github.com/kaltura/playkit-js-contrib/commit/30626b8faa3de29cd80a0d592ed8bc0b5bf42f72))





## [4.1.6](https://github.com/kaltura/playkit-js-contrib/compare/v4.1.5...v4.1.6) (2021-04-05)

**Note:** Version bump only for package root





## [4.1.5](https://github.com/kaltura/playkit-js-contrib/compare/v4.1.4...v4.1.5) (2020-12-07)

**Note:** Version bump only for package root





## [4.1.4](https://github.com/kaltura/playkit-js-contrib/compare/v4.1.3...v4.1.4) (2020-12-01)


### Bug Fixes

* fixed usage of core logger (latest core required) ([1b372ae](https://github.com/kaltura/playkit-js-contrib/commit/1b372ae5dd69e8bac255c630793a85549de00feb))





## [4.1.3](https://github.com/kaltura/playkit-js-contrib/compare/v4.1.2...v4.1.3) (2020-08-18)

**Note:** Version bump only for package root





## [4.1.2](https://github.com/kaltura/playkit-js-contrib/compare/v4.1.1...v4.1.2) (2020-07-19)

**Note:** Version bump only for package root





## [4.1.1](https://github.com/kaltura/playkit-js-contrib/compare/v4.0.3...v4.1.1) (2020-06-18)

**Note:** Version bump only for package root





## [4.0.3](https://github.com/kaltura/playkit-js-contrib/compare/v4.0.2...v4.0.3) (2020-06-17)

**Note:** Version bump only for package root





## [4.0.2](https://github.com/kaltura/playkit-js-contrib/compare/v4.0.1...v4.0.2) (2020-06-09)

**Note:** Version bump only for package root





## [4.0.1](https://github.com/kaltura/playkit-js-contrib/compare/v4.0.0...v4.0.1) (2020-05-31)

**Note:** Version bump only for package root





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

**Note:** Version bump only for package root





## [3.2.2](https://github.com/kaltura/playkit-js-contrib/compare/v3.2.1...v3.2.2) (2020-03-12)

**Note:** Version bump only for package root





## [3.2.1](https://github.com/kaltura/playkit-js-contrib/compare/v3.2.0...v3.2.1) (2020-02-25)

**Note:** Version bump only for package root





# [3.2.0](https://github.com/kaltura/playkit-js-contrib/compare/v3.1.3...v3.2.0) (2020-02-10)


### Bug Fixes

* **ui:** fix banner layout (webc-1766) ([#127](https://github.com/kaltura/playkit-js-contrib/issues/127)) ([a52f91c](https://github.com/kaltura/playkit-js-contrib/commit/a52f91cd732ce6b7264b37a9b032b50814a4e7dd))


### Features

* **common:** add configuration ([#166](https://github.com/kaltura/playkit-js-contrib/issues/166)) ([4d72d59](https://github.com/kaltura/playkit-js-contrib/commit/4d72d5935a096952ee5d727dbae92537a9dc4853))





## [3.1.3](https://github.com/kaltura/playkit-js-contrib/compare/v3.1.2...v3.1.3) (2019-12-23)

**Note:** Version bump only for package root





## [3.1.2](https://github.com/kaltura/playkit-js-contrib/compare/v3.1.1...v3.1.2) (2019-12-22)

### Features

* **ui:** Support popover  ([#115](https://github.com/kaltura/playkit-js-contrib/issues/115)) ([e988af9](https://github.com/kaltura/playkit-js-contrib/commit/e988af9b31aa8503bc32b965965e63c3c7f839b7))

### Bug Fixes

* improve answer on air banner theme ([#113](https://github.com/kaltura/playkit-js-contrib/issues/113)) WEBC-1728 ([d69e09c](https://github.com/kaltura/playkit-js-contrib/commit/d69e09cbd9afdd3f98c53cc1c0afc23b41103e10))






## [3.1.1](https://github.com/kaltura/playkit-js-contrib/compare/v3.1.0...v3.1.1) (2019-12-08)

**Note:** Version bump only for package root





# [3.1.0](https://github.com/kaltura/playkit-js-contrib/compare/v3.0.3...v3.1.0) (2019-12-04)


### Features

* **common:** add end type FEV-421  ([#116](https://github.com/kaltura/playkit-js-contrib/issues/116)) ([0ad2d2c](https://github.com/kaltura/playkit-js-contrib/commit/0ad2d2c2635881f09b4a66401fbec65b93875d4b))





## [3.0.3](https://github.com/kaltura/playkit-js-contrib/compare/v3.0.2...v3.0.3) (2019-11-21)


### Bug Fixes

* **ui:** use Lato for banner and toast components WEBC-1722 ([a90d354](https://github.com/kaltura/playkit-js-contrib/commit/a90d354e75dbc36a9f6c73baaefabcbed8471d0d))





## [3.0.2](https://github.com/kaltura/playkit-js-contrib/compare/v3.0.1...v3.0.2) (2019-11-18)


### Bug Fixes

* **ui:** adding a root style for aligning text to the left as default ([#100](https://github.com/kaltura/playkit-js-contrib/issues/100)) WEBC-1721 ([90b4f25](https://github.com/kaltura/playkit-js-contrib/commit/90b4f25e3c5f02907cede5bca5c38bcfb4c09b83))





## [3.0.1](https://github.com/kaltura/playkit-js-contrib/compare/v3.0.0...v3.0.1) (2019-11-13)


### Bug Fixes

* **common:** create uuid for anonymous user based on player user id (webc-1694) ([5ef7a5a](https://github.com/kaltura/playkit-js-contrib/commit/5ef7a5a16635b09195fbd35264063c27769faa63))
* **ui:** load font in contrib services ([#98](https://github.com/kaltura/playkit-js-contrib/issues/98)) ([6770f38](https://github.com/kaltura/playkit-js-contrib/commit/6770f380a1c7b6b3ce6dea24278a2879bb017e63))





# [3.0.0](https://github.com/kaltura/playkit-js-contrib/compare/v2.3.0...v3.0.0) (2019-11-11)


### Bug Fixes

* **ui:** remove ui manager and expose ui manager thru the contrib services ([49d3f1e](https://github.com/kaltura/playkit-js-contrib/commit/49d3f1e2e085836a3fcde3568679e4fdef8923b6))


### Features

* **common:** remove version management in PlayerContribRegistry ([5444a62](https://github.com/kaltura/playkit-js-contrib/commit/5444a623061094cc0c90f58040a1250c50e8a248))
* get list of preset areas from player configuration ([#84](https://github.com/kaltura/playkit-js-contrib/issues/84)) Webc-1688 ([47de969](https://github.com/kaltura/playkit-js-contrib/commit/47de969f8f3459f60259646fc7728ec67b2664ae))
* listen to ui player events ([c746f93](https://github.com/kaltura/playkit-js-contrib/commit/c746f93200e86c4c12ca355b81130e0b760de2a8))
* **ui:** add get player ks to contrib services  ([#90](https://github.com/kaltura/playkit-js-contrib/issues/90)) ([a14fcb7](https://github.com/kaltura/playkit-js-contrib/commit/a14fcb72ec14a553a3191a445aff19f21c6dfbeb))
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

* previously
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

* **linkify:** fix-open-link-vulnerability ([#42](https://github.com/kaltura/playkit-js-contrib/issues/42)) ([f3e7c82](https://github.com/kaltura/playkit-js-contrib/commit/f3e7c8225074f30af028faff5c2f9d3542361600))
* **linkify:** open link in a new tab ([#41](https://github.com/kaltura/playkit-js-contrib/issues/41)) ([6857508](https://github.com/kaltura/playkit-js-contrib/commit/6857508f559f5c13974f375c342442883bc2a184))
* **plugin:** support different plugin registration modes ([a6f1de7](https://github.com/kaltura/playkit-js-contrib/commit/a6f1de75b329605b4bb7774848668926e536935e))
* **push-notifications:** fix header responseType ([7133c3e](https://github.com/kaltura/playkit-js-contrib/commit/7133c3ee65faaa69166ef0384d9d6a00511fef68))
* **ui:** isolate kitchen sink content from player preact tree ([71a42c7](https://github.com/kaltura/playkit-js-contrib/commit/71a42c7aba12b474e28ec06c0474cd02ac440ff8))
* **ui:** kitchensink and upper bar managers explicitly refresh the preset component when items are added to them ([295531d](https://github.com/kaltura/playkit-js-contrib/commit/295531d6dcf101037cbdf9110dae3fd4b3ec20af))
* **ui:** provide temoprary solution for layout issues of kitchen sink content ([84ed938](https://github.com/kaltura/playkit-js-contrib/commit/84ed938cac171b3fe275f68f00cb895a7b1c18a1))


### Features

* **common:** Handle Anonymous User Id (webc-1603) ([f64334b](https://github.com/kaltura/playkit-js-contrib/commit/f64334bba369db1edb92a8e17b0b2ca81619b0e3))
* **common:**  Handle Anonymous User Id (webc-1603) ([#55](https://github.com/kaltura/playkit-js-contrib/issues/55)) ([ab98792](https://github.com/kaltura/playkit-js-contrib/commit/ab98792a4d449432874117804ba3316e9f9ce275))
* **common:** improve events manager typescript support ([2752f16](https://github.com/kaltura/playkit-js-contrib/commit/2752f16c85d2c29b457e6e44be637409de6e0595))
* **linkify:** parse links in a text and make them linkable WEBC-1530 ([#40](https://github.com/kaltura/playkit-js-contrib/issues/40)) ([1494aa7](https://github.com/kaltura/playkit-js-contrib/commit/1494aa7041d7c701cef45715d9ee32ccb2289ff5))
* **plugin:** add data to ContribConfig and OnMediaLoadConfig ([c3f259c](https://github.com/kaltura/playkit-js-contrib/commit/c3f259c66a4257ffbb803bbe67d0b8c26a06a8fa))
* **ui:** add announcements support WEBC-1450 ([#22](https://github.com/kaltura/playkit-js-contrib/issues/22)) ([a017ade](https://github.com/kaltura/playkit-js-contrib/commit/a017adec4f5c0d0c276d504309d1747b4979bf36))
* **ui:** add normalize css  ([#45](https://github.com/kaltura/playkit-js-contrib/issues/45)) FEV-390 ([236ba7e](https://github.com/kaltura/playkit-js-contrib/commit/236ba7eb0efe6aa72cdf685b2cea6d28fd27f788))
* **ui:** allow downloadContent, printContent and debounce FEV-355 ([#67](https://github.com/kaltura/playkit-js-contrib/issues/67)) ([1464d0b](https://github.com/kaltura/playkit-js-contrib/commit/1464d0b8cd8e6e650618c475fe37e35fd943db2f))
* **ui:** customize player and plugins font and support dynamic download WEBC-1505  ([#60](https://github.com/kaltura/playkit-js-contrib/issues/60)) ([04fa438](https://github.com/kaltura/playkit-js-contrib/commit/04fa43883f3b973987e419f0707a4fecb559e820))
* **ui:** kitchenSinkItem api additions ([94b4ba8](https://github.com/kaltura/playkit-js-contrib/commit/94b4ba8d4c0df23f3813343846c55cd263456f5d))
* **ui:** name changes - announcement to banner ([c77d65b](https://github.com/kaltura/playkit-js-contrib/commit/c77d65b08f8d22e18d9a9b813066296450eae6a4))
* **ui:** toast component ui changes WEBC-1566 ([2351096](https://github.com/kaltura/playkit-js-contrib/commit/2351096153fdbdeef4013fa9ec084bbd51a64712))
* **ui:** Toasts ([5ca456c](https://github.com/kaltura/playkit-js-contrib/commit/5ca456c904f7194cad929a9d80d73bbfa1361b4f))
* **ui:** toggle kitchenSink on menu icon click ([#50](https://github.com/kaltura/playkit-js-contrib/issues/50)) WEBC-1634 ([569c7ba](https://github.com/kaltura/playkit-js-contrib/commit/569c7ba29ab2f5e87015dd74f4fa0f641477fa50))
* **ui:** export managed-component ([#53](https://github.com/kaltura/playkit-js-contrib/issues/53)) ([bce313d](https://github.com/kaltura/playkit-js-contrib/commit/bce313d63434b0280f9d11c40ba4da69d8f65131))
