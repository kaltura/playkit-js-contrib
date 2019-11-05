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
  private _items: PresetItem[] = [];
  private _pendingItems: PresetItem[] = [];

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

    this._pendingItems.push(component);
  }

  lockManager(): void {
    this._isLocked = true;
  }

  registerComponents(): KalturaPlayerPresetComponent[] {
    let configs: (KalturaPlayerPresetComponent)[] = [];
    this._pendingItems.forEach(item => {
      configs = [...configs, ...item.playerConfig];
    });
    this._items = [...this._items, ...this._pendingItems];
    this._pendingItems = [];
    return configs.filter(Boolean) as KalturaPlayerPresetComponent[];
  }
}
