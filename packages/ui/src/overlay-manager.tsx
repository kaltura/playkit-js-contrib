import {PresetManager} from './preset-manager';
import {PlayerContribRegistry} from '@playkit-js-contrib/common';
import {PresetNames} from './preset-item-data';
import {h, ComponentChild} from 'preact';
import {
  OverlayContainer,
  OverlayItemOptions,
} from './components/overlay-container';

export interface OverlayManagerOptions {
  presetManager: PresetManager;
}

const ResourceToken = 'OverlayManager-v1';

export class OverlayManager {
  static fromPlayer(
    playerContribRegistry: PlayerContribRegistry,
    creator: () => OverlayManager
  ) {
    return playerContribRegistry.register(ResourceToken, 1, creator);
  }
  private _options: OverlayManagerOptions;
  private _componentRef: OverlayContainer | null = null;
  private _overlayItem: OverlayItemOptions = null;

  constructor(private options: OverlayManagerOptions) {
    this._options = options;
    this.options.presetManager.add({
      label: 'overlay-manager',
      presets: [PresetNames.Playback, PresetNames.Live],
      container: {name: 'PlayerArea'},
      renderChild: () => this._renderChild(),
    });
  }

  add(props: OverlayItemOptions): void {
    this._overlayItem = props;
    this._componentRef.update();
  }

  remove() {
    this._overlayItem = null;
    this._componentRef.update();
  }

  reset(): void {}

  private _getContent = () => {
    return this._overlayItem;
  };

  private _renderChild = (): ComponentChild => {
    return (
      <OverlayContainer
        label={'overlay-manager'}
        ref={this._setRef}
        content={() => this._getContent()}
      />
    );
  };

  private _setRef = (ref: OverlayContainer | null) => {
    this._componentRef = ref ? ref : null;
  };
}
