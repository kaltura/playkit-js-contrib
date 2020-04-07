import {h, Component} from 'preact';
import * as styles from './_icons-menu.scss';
import {getContribLogger} from '@playkit-js-contrib/common';
import {ContribLogger} from '@playkit-js-contrib/common';
import {
  Popover,
  PopoverVerticalPositions,
  PopoverHorizontalPositions,
  KeyboardKeys,
} from '../popover';
import {PopoverMenu, PopoverMenuItem} from '../popover/popover-menu';
import {UpperBarItem} from '../../upper-bar-item';

export interface IconsMenuProps {
  content: UpperBarItem[];
}

export class IconsMenu extends Component<IconsMenuProps> {
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

  private _getPopoverMenuOptions = (): PopoverMenuItem[] => {
    return this.props.content.map((item: UpperBarItem) => {
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
              <div
                aria-hidden="true"
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                }}>
                {renderChild({})}
              </div>
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

  render(props: IconsMenuProps) {
    if (this._logger) {
      this._logger.trace(`render component`, {
        method: 'render',
      });
    }

    return (
      <Popover
        className="icons-menu"
        verticalPosition={PopoverVerticalPositions.Bottom}
        horizontalPosition={PopoverHorizontalPositions.Left}
        content={this._popoverContent()}>
        <button className={styles.iconMenu} tabIndex={1} />
      </Popover>
    );
  }
}
