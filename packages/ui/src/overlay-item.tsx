import {h} from 'preact';
import {ContribLogger, getContribLogger} from '@playkit-js-contrib/common';
import {OverlayItemData, OverlayItemProps} from './overlay-item-data';
import {ManagedComponent} from './components/managed-component';

export interface OverlayItemOptions {
  data: OverlayItemData;
}

export class OverlayItem {
  private _destroyed = false;
  private _options: OverlayItemOptions;
  private _logger: ContribLogger;

  constructor(options: OverlayItemOptions) {
    this._options = options;
    this._logger = getContribLogger({
      module: 'contrib-ui',
      class: 'OverlayItem',
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
  }

  get data() {
    return this._options.data;
  }

  /**
   * destory the ui item
   */
  destroy(): void {
    this._logger.info('destroy item', {
      method: 'destroy',
    });
    this._destroyed = true;
  }

  renderOverlayChild(props: OverlayItemProps) {
    return this._destroyed ? null : this._options.data.renderContent(props);
  }
}
