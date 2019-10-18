import { h, Component } from "preact";
import * as styles from "./popover.scss";

const VERTICAL_POSITIONS = ["top", "bottom"];
const HORIZONTAL_POSITIONS = ["left", "right"];

const defaultPositions = {
    verticalPosition: VERTICAL_POSITIONS[0],
    horizontalPosition: HORIZONTAL_POSITIONS[0]
};

interface PopoverProps {
    onClose: () => void;
    verticalPosition: "top" | "bottom";
    horizontalPosition: "left" | "right";
    popoverClassName: string;
}

export class Popover extends Component<PopoverProps> {
    static defaultProps = {
        popoverClassName: "popover",
        ...defaultPositions
    };
    render(props: any) {
        const popoverPosition = {
            vertical:
                VERTICAL_POSITIONS.indexOf(props.verticalPosition) > -1
                    ? props.verticalPosition
                    : defaultPositions.verticalPosition,
            horizontal:
                HORIZONTAL_POSITIONS.indexOf(props.horizontalPosition) > -1
                    ? props.horizontalPosition
                    : defaultPositions.horizontalPosition
        };
        return (
            <div
                onKeyDown={e => {
                    props.onClose(e);
                }}
                tabIndex={-1}
                className={[
                    props.popoverClassName,
                    styles.popoverComponent,
                    styles[popoverPosition.vertical],
                    styles[popoverPosition.horizontal]
                ].join(" ")}
            >
                {props.children}
            </div>
        );
    }
}
