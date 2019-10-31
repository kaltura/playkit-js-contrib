import {PlayerContribRegistry} from '@playkit-js-contrib/common';
import {PresetItemData} from './preset-item-data';
import {KalturaPlayerPresetComponent, PresetItem} from './preset-item';

export interface PresetManagerOptions {
  corePlayer: KalturaPlayerTypes.Player;
}

const ResourceToken = 'PresetManager-v1';

export class PresetManager {
  static fromPlayer(
    playerContribRegistry: PlayerContribRegistry,
    creator: () => PresetManager
  ) {
    return playerContribRegistry.register(ResourceToken, 1, creator);
  }

  private _isLocked = false;
  private _options: PresetManagerOptions;
  private _components: PresetItem[] = [];
  private _pendingComponents: PresetItem[] = [];

  constructor(options: PresetManagerOptions) {
    this._options = options;
  }

  add<TProps>(data: PresetItemData): void {
    if (this._isLocked) {
      console.warn(
        `cannot add new preset items once player completed its' setup phase`
      );
      return null;
    }
    const component = new PresetItem({
      corePlayer: this._options.corePlayer,
      data,
    });

    this._pendingComponents.push(component);
  }

  lockManager(): void {
    this._isLocked = true;
  }

  registerComponents(): KalturaPlayerPresetComponent[] {
    const configs: (KalturaPlayerPresetComponent | null)[] = this._pendingComponents.map(
      component => component.playerConfig
    );
    this._components = [...this._components, ...this._pendingComponents];
    this._pendingComponents = [];
    return configs.filter(Boolean) as KalturaPlayerPresetComponent[];
  }
}
