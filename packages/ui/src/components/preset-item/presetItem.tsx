import { h, Component, render } from "preact";
import * as styles from "./_presetItem.scss";
import { getFirstChild } from "../utils";

export interface PresetItemProps {
    label: string;
    fitToContainer?: boolean;
}

export class PresetItem extends Component<PresetItemProps> {
    private _root: HTMLDivElement | null = null;
    private _element: Element | null = null;

    componentDidMount(): void {
        if (!this._root || !this.props.children) {
            return;
        }

        const child = getFirstChild(this.props.children);

        if (!child) {
            return;
        }
        this._element = render(child, this._root);
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
                data-contrib-name={label}
            />
        );
    }
}
