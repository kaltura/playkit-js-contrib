import { h, Component } from "preact";
import * as styles from "./_floatingContainer.scss";
import { getContribLogger } from "@playkit-js-contrib/common";
import { ContribLogger } from "@playkit-js-contrib/common";

export interface KitchenSinkRendererProps {}

export class FloatingContainer extends Component<KitchenSinkRendererProps> {
    private _logger: ContribLogger | null = null;

    componentDidMount(): void {
        this._logger = getContribLogger({
            module: "contrib-ui",
            class: "FloatingContainer"
        });
        this._logger.info(`mount component`, {
            method: "componentDidMount"
        });
    }

    componentWillUnmount(): void {
        if (!this._logger) {
            return;
        }

        this._logger.info(`unmount component`, {
            method: "componentWillUnmount"
        });
    }

    render(props: any) {
        if (this._logger) {
            this._logger.trace(`render component`, {
                method: "render"
            });
        }
        return <div className={styles.root}>{this.props.children}</div>;
    }
}
