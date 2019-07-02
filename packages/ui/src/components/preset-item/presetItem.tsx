import { h, Component, render, ComponentChildren, ComponentChild } from "preact";
import * as styles from "./_presetItem.scss";
import { getFirstChild } from "../utils";

export interface PresetItemProps {
    label: string;
    fitToContainer?: boolean;
    renderChild: () => ComponentChild;
}


// TODO sakal should extend the player preact component or ask player to provide life cycle hooks
export class PresetItem extends Component<PresetItemProps> {
    private _root: HTMLDivElement | null = null;
    private _element: Element | null = null;

    shouldComponentUpdate(nextProps: Readonly<PresetItemProps>, nextState: Readonly<{}>, nextContext: any): boolean {
        return false;
    }

    componentDidMount(): void {
        // TODO sakal review design with Omri about which react instance manages this component.
        // is seems like the player preact but it works with my extended Component
        if (!this._root || !this.props.renderChild) {
            // TODO sakal use logger to warn
            return;
        }

        // TODO sakal
        const child = this.props.renderChild();


        if (!child) {
            // TODO sakal use logger to warn
            return;
        }
        this._element = render(child, this._root);
    }


    componentWillUnmount(): void {
        // TODO sakal remove from preact _root _element
    }

    render(props: any) {
        const { label, fitToContainer } = props;
        const classNames = [];

        if (fitToContainer) {
            classNames.push(styles.fitToContainer);
        }

        return (
            <div
                ref={ref => (this._root = ref)}
                className={classNames.join(" ")}
                data-preset-item={label}
            />
        );
    }
}
