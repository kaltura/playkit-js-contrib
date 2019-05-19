import { h, Component } from "preact";
import * as styles from "./_presetItem.scss";

export interface PresetItemProps {
    label: string;
    fitToContainer?: boolean;
}

export class PresetItem extends Component<PresetItemProps> {
    render(props: any) {
        const { label, fitToContainer } = props;
        const classNames = [];

        if (fitToContainer) {
            classNames.push(styles.fitToContainer);
        }

        return (
            <div className={classNames.join(" ")} data-contrib-name={label}>
                {this.props.children}
            </div>
        );
    }
}
