import {h} from 'preact';
import {PresetItemData} from './preset-item-data';
import {KalturaPlayerPresetComponent, PresetItem} from './preset-item';
import {EventsManager} from '@playkit-js-contrib/common';
import {UIPlayerAdapter} from './components/ui-player-adapter';
import PresetConfig = KalturaPlayerContribTypes.PresetConfig;
import {PresetsUtils} from './presets-utils';
import {getContribConfig} from './contrib-utils';

export interface PresetManagerOptions {
  kalturaPlayer: KalturaPlayerTypes.Player;
}

export enum PresetManagerEventTypes {
  PresetResizeEvent = 'PresetResizeEvent',
}

export interface PresetResizeEvent {
  type: PresetManagerEventTypes.PresetResizeEvent;
}

export type PresetManagerEvents = PresetResizeEvent;

const acceptableTypes = ['PlayerArea'];

const defaultPresetConfig: PresetConfig = {
  presetAreasMapping: {
    Playback: {
      PlayerArea: 'PlayerArea',
    },
    Live: {
      PlayerArea: 'PlayerArea',
    },
  },
};

export class PresetManager {
  private _events: EventsManager<PresetManagerEvents> = new EventsManager<
    PresetManagerEvents
  >();
  private _isLocked = false;
  private _options: PresetManagerOptions;
  private _items: PresetItem[] = [];
  private _pendingItems: PresetItem[] = [];
  private _presetConfig: PresetConfig;

  constructor(options: PresetManagerOptions) {
    this._options = options;

    this._presetConfig = getContribConfig(
      this._options.kalturaPlayer,
      'ui.preset',
      defaultPresetConfig,
      {
        explicitMerge: ['presetAreasMapping'],
      }
    );

    const groupedPresets = PresetsUtils.groupPresetAreasByType({
      presetAreasMapping: this._presetConfig.presetAreasMapping,
      acceptableTypes,
    });

    this.add({
      label: 'preset-manager',
      presetAreas: groupedPresets['PlayerArea'],
      isolatedMode: false,
      renderChild: () => (
        <UIPlayerAdapter
          onMount={this._registerToPlayer}
          onUnmount={this._unregisterToPlayer}
        />
      ),
    });
  }

  private _registerToPlayer = (player: KalturaPlayerTypes.Player) => {
    // player.addEventListener(
    //   KalturaPlayer.ui.EventType.UI_PRESET_CHANGE,
    //   this._notifyPresetChanged
    // );

    player.addEventListener(
      KalturaPlayer.ui.EventType.UI_PRESET_RESIZE,
      this._notifyUIPresetResize
    );

    // player.addEventListener(
    //   KalturaPlayer.ui.EventType.VIDEO_RESIZE,
    //   this._notifyVideoResize
    // );
  };

  // private _notifyPresetChanged = () => {
  //   // TODO implement
  //   console.log(`sakal preset-manager: _notifyPresetChanged`);
  // };
  //
  // private _notifyVideoResize = () => {
  //   // TODO implement
  //   console.log(`sakal preset-manager: _notifyVideoResize`);
  // };

  private _notifyUIPresetResize = () => {
    this._events.emit({
      type: PresetManagerEventTypes.PresetResizeEvent,
    });
  };

  private _unregisterToPlayer = (player: KalturaPlayerTypes.Player) => {
    // player.removeEventListener(
    //   KalturaPlayer.ui.EventType.UI_PRESET_CHANGE,
    //   this._notifyPresetChanged
    // );

    player.removeEventListener(
      KalturaPlayer.ui.EventType.UI_PRESET_RESIZE,
      this._notifyUIPresetResize
    );

    // player.removeEventListener(
    //   KalturaPlayer.ui.EventType.VIDEO_RESIZE,
    //   this._notifyVideoResize
    // );
  };

  on: EventsManager<PresetManagerEvents>['on'] = this._events.on.bind(
    this._events
  );
  off: EventsManager<PresetManagerEvents>['off'] = this._events.off.bind(
    this._events
  );

  add<TProps>(data: PresetItemData): void {
    if (this._isLocked) {
      console.warn(
        `cannot add new preset items once player completed its' setup phase`
      );
      return null;
    }
    const component = new PresetItem({
      kalturaPlayer: this._options.kalturaPlayer,
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
