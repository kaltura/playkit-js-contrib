import {CorePlugin} from './core-plugin';

export class ContribPluginConfigs<TPluginConfig extends Record<string, any>> {
  constructor(
    private _player: KalturaPlayerTypes.Player,
    private _corePlugin: CorePlugin
  ) {}

  get playerConfig(): KalturaPlayerTypes.PlayerConfig &
    DeepPartial<KalturaPlayerContribTypes.ContribConfig> {
    return this._player.config;
  }

  get pluginConfig(): TPluginConfig {
    return this._corePlugin.config;
  }
}
