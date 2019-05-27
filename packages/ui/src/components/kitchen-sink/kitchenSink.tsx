import { h, Component } from "preact";
import * as styles from "./_kitchenSink.scss";
import { log } from "@playkit-js-contrib/common";

export interface KitchenSinkRendererProps {
    onClose: () => void;
}

export class KitchenSink extends Component<KitchenSinkRendererProps> {
    componentDidMount(): void {
        log(`debug`, "KitchenSink", "componentDidMount");
    }

    componentWillUnmount(): void {
        log(`debug`, "KitchenSink", "componentWillUnmount");
    }

    render(props: any) {
        return <div className={styles.root}>{this.props.children}</div>;
    }
}
