import {h} from 'preact';
import {PlayerContribRegistry} from '@playkit-js-contrib/common';
import {PresetItemData, PresetNames} from './preset-item-data';
import {KalturaPlayerPresetComponent, PresetItem} from './preset-item';
import {EventsManager} from '@playkit-js-contrib/common';
import {UIPlayerAdapter} from './components/ui-player-adapter';

export interface PresetManagerOptions {
  corePlayer: KalturaPlayerTypes.Player;
}

const ResourceToken = 'PresetManager-v1';

export enum PresetManagerEventTypes {
  PresetResizeEvent = 'PresetResizeEvent',
}

export interface PresetResizeEvent {
  type: PresetManagerEventTypes.PresetResizeEvent;
}

export type PresetManagerEvents = PresetResizeEvent;

export class PresetManager {
  static fromPlayer(
    playerContribRegistry: PlayerContribRegistry,
    creator: () => PresetManager
  ) {
    return playerContribRegistry.register(ResourceToken, 1, creator);
  }

  private _events: EventsManager<PresetManagerEvents> = new EventsManager<
    PresetManagerEvents
  >();
  private _isLocked = false;
  private _options: PresetManagerOptions;
  private _components: PresetItem[] = [];
  private _pendingComponents: PresetItem[] = [];

  constructor(options: PresetManagerOptions) {
    this._options = options;

    this.add({
      label: 'preset-manager-adapter',
      shareAdvancedPlayerAPI: true,
      presets: [PresetNames.Playback, PresetNames.Live],
      container: {name: 'PlayerArea'},
      renderChild: () => (
        <UIPlayerAdapter
          onMount={this._registerToPlayer}
          onUnmount={this._unregisterToPlayer}
        />
      ),
    });
  }

  // TODO sakal move to core player manager
  private _registerToPlayer = (player: KalturaPlayerTypes.Player) => {
    player.addEventListener(
      KalturaPlayer.ui.EventType.ACTIVE_PRESET_CHANGED,
      this._notifyPresetChanged
    );

    player.addEventListener(
      KalturaPlayer.ui.EventType.ACTIVE_PRESET_RESIZE,
      this._notifyActivePresetResize
    );

    player.addEventListener(
      KalturaPlayer.ui.EventType.VIDEO_RESIZE,
      this._notifyVideoResize
    );
  };

  private _notifyPresetChanged = () => {
    // TODO sakal implement
    console.log(`sakal preset-manager: _notifyPresetChanged`);
  };

  private _notifyVideoResize = () => {
    // TODO sakal implement
    console.log(`sakal preset-manager: _notifyVideoResize`);
  };

  private _notifyActivePresetResize = () => {
    this._events.emit({
      type: PresetManagerEventTypes.PresetResizeEvent,
    });
  };

  private _unregisterToPlayer = (player: KalturaPlayerTypes.Player) => {
    player.removeEventListener(
      KalturaPlayer.ui.EventType.ACTIVE_PRESET_CHANGED,
      this._notifyPresetChanged
    );

    player.removeEventListener(
      KalturaPlayer.ui.EventType.ACTIVE_PRESET_RESIZE,
      this._notifyActivePresetResize
    );

    player.removeEventListener(
      KalturaPlayer.ui.EventType.VIDEO_RESIZE,
      this._notifyVideoResize
    );
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
