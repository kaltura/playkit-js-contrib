import { Component, h } from "preact";
import { ContribLogger, getContribLogger } from "@playkit-js-contrib/common";
import * as styles from "./_kitchenSink.scss";

export interface KitchenSinkProps {
    isActive: boolean;
}

export class KitchenSink extends Component<KitchenSinkProps> {
    static defaultProps = {
        isActive: false
    };

    private _logger: ContribLogger | null = null;

    componentDidMount(): void {
        this._logger = getContribLogger({
            module: "contrib-ui",
            class: "KitchenSink"
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

        return <div className={this._getClass()}>{this.props.children}</div>;
    }

    private _getClass(): string {
        return styles.root + " " + (this.props.isActive ? styles.active : "");
    }
}
