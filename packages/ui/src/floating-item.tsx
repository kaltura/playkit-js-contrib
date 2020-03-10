// @ts-nocheck
const {h} = KalturaPlayer.ui.preact;
import {ContribLogger, getContribLogger} from '@playkit-js-contrib/common';
import {
  FloatingItemData,
  FloatingItemProps,
  FloatingUIModes,
} from './floating-item-data';
import {ManagedComponent} from './components/managed-component';

export interface FloatingItemOptions {
  kalturaPlayer: KalturaPlayerTypes.Player;
  data: FloatingItemData;
}

export class FloatingItem {
  private _destroyed = false;
  private _options: FloatingItemOptions;
  private _isShown = false;
  private _componentRef: ManagedComponent | null = null;
  private _logger: ContribLogger;

  constructor(options: FloatingItemOptions) {
    this._options = options;
    this._logger = getContribLogger({
      module: 'contrib-ui',
      class: 'FloatingItem',
      context: options.data.label,
    });
    this._logger.debug('executed', {
      method: 'constructor',
      data: {
        options,
      },
    });
    this._logger.info(`created item ${options.data.label}`, {
      method: 'constructor',
    });

    this._addPlayerBindings();
  }

  get data(): FloatingItemData {
    return this._options.data;
  }

  remove = (): void => {
    this._logger.info('remove item from player', {
      method: 'remove',
    });
    this._isShown = false;
    if (!this._componentRef) {
      return;
    }

    this._componentRef.update();
  };

  add = (): void => {
    this._logger.info('add item to player', {
      method: 'add',
    });
    this._isShown = true;
    if (!this._componentRef) {
      return;
    }

    this._componentRef.update();
  };

  public update() {
    if (!this._componentRef) {
      return;
    }

    this._componentRef.update();
  }

  /**
   * destory the ui item
   */
  destroy(): void {
    this._logger.info('destroy item', {
      method: 'destroy',
    });
    this._destroyed = true;
    this.remove();
  }

  renderFloatingChild(props: FloatingItemProps) {
    const {label} = this._options.data;

    return (
      <ManagedComponent
        label={label}
        renderChildren={() => this._options.data.renderContent(props)}
        isShown={() => this._isShown}
        ref={ref => (this._componentRef = ref)}
      />
    );
  }

  private _handleMediaLoaded = () => {
    const {kalturaPlayer} = this._options;
    kalturaPlayer.removeEventListener(
      kalturaPlayer.Event.MEDIA_LOADED,
      this._handleMediaLoaded
    );
    this.add();
  };

  private _handleFirstPlay = () => {
    const {kalturaPlayer} = this._options;
    kalturaPlayer.removeEventListener(
      kalturaPlayer.Event.FIRST_PLAY,
      this._handleFirstPlay
    );
    this.add();
  };

  private _addPlayerBindings() {
    const {kalturaPlayer, data} = this._options;

    if (data.mode === FloatingUIModes.MediaLoaded) {
      kalturaPlayer.addEventListener(
        kalturaPlayer.Event.MEDIA_LOADED,
        this._handleMediaLoaded
      );
    }

    if (data.mode === FloatingUIModes.FirstPlay) {
      kalturaPlayer.addEventListener(
        kalturaPlayer.Event.FIRST_PLAY,
        this._handleFirstPlay
      );
    }

    if (data.mode === FloatingUIModes.Immediate) {
      this.add();
    }
  }
}
