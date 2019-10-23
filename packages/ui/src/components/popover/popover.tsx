import { h, Component } from "preact";
import * as styles from "./popover.scss";

export enum PopoverVerticalPositions {
    Top = "top",
    Bottom = "bottom"
}
export enum PopoverHorizontalPositions {
    Left = "left",
    Right = "right"
}
export enum PopoverTriggerMode {
    Click = "click",
    Hover = "hover"
}

const defaultProps = {
    verticalPosition: PopoverVerticalPositions.Top,
    horizontalPosition: PopoverHorizontalPositions.Left,
    triggerMode: PopoverTriggerMode.Click,
    className: "popover",
    open: false,
    closeOnEsc: true
};

interface PopoverProps {
    onClose?: () => void;
    onOpen?: () => void;
    verticalPosition: PopoverVerticalPositions.Top | PopoverVerticalPositions.Bottom;
    horizontalPosition: PopoverHorizontalPositions.Right | PopoverHorizontalPositions.Left;
    className: string;
    open: boolean;
    closeOnEsc: boolean;
    triggerMode: PopoverTriggerMode.Click | PopoverTriggerMode.Hover;
    anchorEl: JSX.Element;
    children: JSX.Element | JSX.Element[];
}

export class Popover extends Component<PopoverProps> {
    static defaultProps = {
        ...defaultProps
    };
    componentDidMount() {
        if (this.props.closeOnEsc && this.props.onClose) {
            document.addEventListener("keydown", this._handleEscButtonPressed);
        }
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this._handleEscButtonPressed);
    }
    private _handleEscButtonPressed = (e: KeyboardEvent) => {
        const { onClose } = this.props;
        if (e.keyCode === 27 && onClose) {
            onClose();
        }
    };
    private _getTrigger = () => {
        const { triggerMode } = this.props;
        return triggerMode in PopoverTriggerMode ? triggerMode : defaultProps.triggerMode;
    };
    private _handleClick = () => {
        const trigger = this._getTrigger();
        if (trigger === "click") {
            this._handleOpenOrClose();
        }
    };
    private _handleHover = () => {
        const trigger = this._getTrigger();
        if (trigger === "hover") {
            this._handleOpenOrClose();
        }
    };
    private _handleOpenOrClose = () => {
        const { onOpen, onClose, open } = this.props;
        if (!open && onOpen) {
            onOpen();
        } else if (open && onClose) {
            onClose();
        }
    };
    render(props: PopoverProps): JSX.Element | null {
        if (!props.anchorEl || !props.children) {
            return null;
        }
        const popoverPosition = {
            vertical:
                props.verticalPosition in PopoverVerticalPositions
                    ? props.verticalPosition
                    : defaultProps.verticalPosition,
            horizontal:
                props.horizontalPosition in PopoverHorizontalPositions
                    ? props.horizontalPosition
                    : defaultProps.horizontalPosition
        };
        return (
            <div className={styles.popoverContainer}>
                <div
                    className="popover-anchor-container"
                    onClick={this._handleClick}
                    onMouseEnter={this._handleHover}
                    onMouseLeave={this._handleHover}
                >
                    {props.anchorEl}
                </div>
                <div
                    aria-expanded="true"
                    onKeyDown={this.props.onClose}
                    tabIndex={-1}
                    className={[
                        props.className,
                        styles.popoverComponent,
                        props.open ? styles.visible : "",
                        styles[popoverPosition.vertical],
                        styles[popoverPosition.horizontal]
                    ].join(" ")}
                >
                    {props.children}
                </div>
            </div>
        );
    }
}
