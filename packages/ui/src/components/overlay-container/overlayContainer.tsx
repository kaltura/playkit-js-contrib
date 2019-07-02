import { h, Component } from "preact";
import * as styles from "./_overlayContainer.scss";
import { log } from "@playkit-js-contrib/common";

export interface KitchenSinkRendererProps {
}

export class OverlayContainer extends Component<KitchenSinkRendererProps> {
    componentDidMount(): void {
        log(`debug`, "OverlayContainer", "componentDidMount");
    }

    componentWillUnmount(): void {
        log(`debug`, "OverlayContainer", "componentWillUnmount");
    }

    render(props: any) {
        return <div className={styles.root}>{this.props.children}</div>;
    }
}
