import {h, Component} from 'preact';
import * as styles from './popover.scss';
import {PopoverContent} from './popover-content';

export enum PopoverVerticalPositions {
  Top = 'top',
  Bottom = 'bottom',
}
export enum PopoverHorizontalPositions {
  Left = 'left',
  Right = 'right',
}
export enum PopoverTriggerMode {
  Click = 'click',
  Hover = 'hover',
}

const CLOSE_ON_HOVER_DELAY = 500;

const defaultProps = {
  verticalPosition: PopoverVerticalPositions.Top,
  horizontalPosition: PopoverHorizontalPositions.Left,
  triggerMode: PopoverTriggerMode.Click,
  className: 'popover',
  closeOnEsc: true,
};

interface PopoverProps {
  onClose?: () => void;
  onOpen?: () => void;
  verticalPosition: PopoverVerticalPositions;
  horizontalPosition: PopoverHorizontalPositions;
  className: string;
  closeOnEsc: boolean;
  triggerMode: PopoverTriggerMode;
  content: JSX.Element;
  children: JSX.Element | JSX.Element[];
}

interface PopoverState {
  open: boolean;
}

/**
 * Popover renders popup with a target.
 * Properties description:
 *   onOpen - function that will be executed when popover opens;
 *   onClose - function that will be executed when popover closes;
 *   verticalPosition - vertical position of popover relative to target ("top" or "bottom"), default - "top";
 *   horizontalPosition - horizontal position of popover relative to target ("left" or "right"), default - "left";
 *   className - popover class, can be use for popover styling, default - 'popover';
 *   closeOnEsc - handle ESC keyboard pressed event and close popover, default - true;
 *   triggerMode - popover support 2 ways for opening: click (keyPress) and mouse hover ("click" or "hover"), default - "click";
 *   content - content of popover. Can be any valid Preact node, ex:
 *      <select>
 *          <option>Option 1</option>
 *          ...
 *          <option>Option n</option>
 *      </select>
 *   children - popover target. Can be any valid Preact node, ex:
 *      <button>
 *          <i className="icon" />
 *      </button>
 */

export class Popover extends Component<PopoverProps, PopoverState> {
  private _closeTimeout: any = null;
  private _controlElement = null;
  static defaultProps = {
    ...defaultProps,
  };
  state = {
    open: false,
  };

  private _clearTimeout = () => {
    clearTimeout(this._closeTimeout);
    this._closeTimeout = null;
  };

  private _handleClickOutside = (e: any) => {
    if (
      !!this._controlElement &&
      !this._controlElement.contains(e.target) &&
      this.state.open
    ) {
      this._closePopover();
    }
  };

  private _openPopover = () => {
    const {onOpen} = this.props;
    this.setState({open: true}, () => {
      if (onOpen) {
        onOpen();
      }
    });
  };

  private _closePopover = () => {
    const {onClose} = this.props;
    this._clearTimeout();
    this.setState({open: false}, () => {
      if (onClose) {
        onClose();
      }
    });
  };

  private _handleEscButtonPressed = (e: KeyboardEvent) => {
    // check if ESC or Enter pressed
    if (this.state.open && (e.keyCode === 27 || e.keyCode === 13)) {
      this._closePopover();
    }
  };
  private _handleClick = () => {
    if (this.props.triggerMode === PopoverTriggerMode.Click) {
      if (this.state.open) {
        this._closePopover();
      } else {
        this._openPopover();
      }
    }
  };
  private _handleMouseEnter = () => {
    if (
      this.props.triggerMode === PopoverTriggerMode.Hover &&
      !this.state.open
    ) {
      this._openPopover();
    }
  };
  private _handleMouseLeave = () => {
    if (this.props.triggerMode === PopoverTriggerMode.Hover) {
      this._closeTimeout = setTimeout(this._closePopover, CLOSE_ON_HOVER_DELAY);
    }
  };
  private _handleHoverOnPopover = () => {
    if (this.props.triggerMode === PopoverTriggerMode.Hover) {
      if (this.state.open && this._closeTimeout) {
        this._clearTimeout();
      } else {
        this._closePopover();
      }
    }
  };
  private _getHoverEvents = () => {
    if (this.props.triggerMode === PopoverTriggerMode.Hover) {
      return {
        targetEvents: {
          onMouseEnter: this._handleMouseEnter,
          onMouseLeave: this._handleMouseLeave,
        },
        popoverEvents: {
          onMouseEnter: this._handleHoverOnPopover,
          onMouseLeave: this._handleHoverOnPopover,
        },
      };
    }
    return {targetEvents: {}, popoverEvents: {}};
  };
  render(props: PopoverProps): JSX.Element | null {
    if (!props.content || !props.children) {
      return null;
    }
    const {targetEvents, popoverEvents} = this._getHoverEvents();
    const verticalAlignment =
      props.verticalPosition === PopoverVerticalPositions.Top
        ? PopoverVerticalPositions.Top
        : PopoverVerticalPositions.Bottom;
    const horizontalAlignment =
      props.horizontalPosition === PopoverHorizontalPositions.Left
        ? PopoverHorizontalPositions.Left
        : PopoverHorizontalPositions.Right;
    return (
      <div className={styles.popoverContainer}>
        <div
          className="popover-anchor-container"
          onClick={this._handleClick}
          ref={node => {
            this._controlElement = node;
          }}
          {...targetEvents}>
          {props.children}
        </div>
        <div
          aria-expanded={this.state.open ? 'true' : 'false'}
          tabIndex={-1}
          className={[
            props.className,
            styles.popoverComponent,
            this.state.open ? styles.visible : '',
            styles[verticalAlignment],
            styles[horizontalAlignment],
          ].join(' ')}
          {...popoverEvents}>
          {this.state.open && (
            <PopoverContent
              clickHandler={this._handleClickOutside}
              keyHandler={this._handleEscButtonPressed}>
              {props.content}
            </PopoverContent>
          )}
        </div>
      </div>
    );
  }
}
