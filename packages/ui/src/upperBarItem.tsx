import {h, ComponentChild} from 'preact';
import {UpperBarItemData} from './upperBarItemData';
import {ContribLogger} from '@playkit-js-contrib/common';
import {getContribLogger} from '@playkit-js-contrib/common';

export interface UpperBarItemOptions {
  data: UpperBarItemData;
}

export interface UpperBarItemProps {}

export class UpperBarItem {
  private _options: UpperBarItemOptions;
  private _logger: ContribLogger;

  constructor(options: UpperBarItemOptions) {
    this._options = options;
    this._logger = getContribLogger({
      module: 'contrib-ui',
      class: 'PresetItem',
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

  public renderChild = (props: UpperBarItemProps): ComponentChild => {
    const {onClick, renderItem, label} = this._options.data;
    const children = renderItem(props);

    return (
      <div onClick={onClick} className={'icon--clickable'}>
        {children}
      </div>
    );
  };
}
