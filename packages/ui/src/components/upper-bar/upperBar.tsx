import { h, Component } from "preact";
import * as styles from "./_upperBar.scss";
import { log } from "@playkit-js/ovp-common";

export interface UpperBarProps {}

export class UpperBar extends Component<UpperBarProps> {
    componentDidMount(): void {
        log(`debug`, "UpperBar", "componentDidMount");
    }

    componentWillUnmount(): void {
        log(`debug`, "UpperBar", "componentWillUnmount");
    }

    render(props: any) {
        return <div className={styles.root}>{this.props.children}</div>;
    }
}
