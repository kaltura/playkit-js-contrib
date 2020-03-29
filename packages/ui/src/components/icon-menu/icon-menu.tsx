import {h, Component} from 'preact';
import * as styles from './_icon-menu.scss';
import {getContribLogger} from '@playkit-js-contrib/common';
import {ContribLogger} from '@playkit-js-contrib/common';
import {
  Popover,
  PopoverVerticalPositions,
  PopoverHorizontalPositions,
  KeyboardKeys,
} from '../popover';
import {PopoverMenu, PopoverMenuItem} from './popover-menu';

export interface IconMenuProps {
  content: any;
}

export class IconMenu extends Component<IconMenuProps> {
  private _logger: ContribLogger | null = null;

  componentDidMount(): void {
    this._logger = getContribLogger({
      module: 'contrib-ui',
      class: 'IconMenu',
    });
    this._logger.info(`mount component`, {
      method: 'componentDidMount',
    });
  }

  componentWillUnmount(): void {
    if (!this._logger) {
      return;
    }

    this._logger.info(`unmount component`, {
      method: 'componentWillUnmount',
    });
  }

  private _onKeyDown = (e: KeyboardEvent, callBack: Function) => {
    if (e.keyCode !== KeyboardKeys.Enter && e.keyCode !== KeyboardKeys.Esc) {
      // don't stopPropagation on ESC and Enter pressed as it prevent the popup closing
      e.stopPropagation();
    }
    switch (e.keyCode) {
      case 13: // Enter pressed
        callBack();
        break;
    }
  };

  private _getPopoverMenuOptions = () => {
    return this.props.content.map((item: any) => {
      console.log('item', item);
      const {
        renderChild,
        _options: {
          data: {label, onClick},
        },
      } = item;
      return {
        customRenderer: () => {
          return (
            <div
              tabIndex={1}
              role="button"
              onKeyDown={(e: KeyboardEvent) => this._onKeyDown(e, onClick)}
              onClick={onClick}
              className={styles.iconMenuItem}>
              {renderChild({})}
              <span className={styles.itemLabel}>{label}</span>
            </div>
          );
        },
      };
    });
  };

  private _popoverContent = () => {
    return <PopoverMenu options={this._getPopoverMenuOptions()} />;
  };

  render(props: any) {
    if (this._logger) {
      this._logger.trace(`render component`, {
        method: 'render',
      });
    }

    return (
      <Popover
        className="download-print-popover"
        verticalPosition={PopoverVerticalPositions.Bottom}
        horizontalPosition={PopoverHorizontalPositions.Left}
        content={this._popoverContent()}>
        <div className={styles.iconMenu} role="button" tabIndex={1} />
      </Popover>
    );
  }
}
