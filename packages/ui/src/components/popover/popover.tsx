import {h, Component} from 'preact';
import * as styles from './popover.scss';

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

export class Popover extends Component<PopoverProps, PopoverState> {
  private _closeTimeout: any = null;
  private _controlElement = null;
  static defaultProps = {
    ...defaultProps,
  };
  state = {
    open: false,
  };
  componentDidMount() {
    document.addEventListener('click', this._handleClickOutside);
    document.addEventListener('keydown', this._handleEscButtonPressed);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._handleClickOutside);
    document.removeEventListener('keydown', this._handleEscButtonPressed);
    clearTimeout(this._closeTimeout);
  }

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
        clearTimeout(this._closeTimeout);
        this._closeTimeout = null;
      } else {
        this._closePopover();
      }
    }
  };
  render(props: PopoverProps): JSX.Element | null {
    if (!props.content || !props.children) {
      return null;
    }
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
          onMouseEnter={this._handleMouseEnter}
          onMouseLeave={this._handleMouseLeave}
          ref={node => {
            this._controlElement = node;
          }}>
          {props.children}
        </div>
        <div
          aria-expanded={this.state.open ? 'true' : 'false'}
          tabIndex={-1}
          onMouseEnter={this._handleHoverOnPopover}
          onMouseLeave={this._handleHoverOnPopover}
          className={[
            props.className,
            styles.popoverComponent,
            this.state.open ? styles.visible : '',
            styles[verticalAlignment],
            styles[horizontalAlignment],
          ].join(' ')}>
          {props.content}
        </div>
      </div>
    );
  }
}
