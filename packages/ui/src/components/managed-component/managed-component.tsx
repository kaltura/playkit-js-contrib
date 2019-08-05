import { h, Component, ComponentChild, ComponentChildren } from "preact";
import { getContribLogger } from "@playkit-js-contrib/common";
import { ContribLogger } from "@playkit-js-contrib/common";
import * as styles from "./_managed-component.scss";

type ManagedComponentState = {
    toggler: boolean;
};
type ManagedComponentProps = {
    isShown: () => boolean;
    renderChildren: () => ComponentChildren;
    label: string;
    fitToContainer: boolean;
};

export class ManagedComponent extends Component<ManagedComponentProps, ManagedComponentState> {
    private _logger: ContribLogger | null = null;

    static defaultProps = {
        fitToContainer: false
    };

    update() {
        this.setState((prev: ManagedComponentState) => {
            return {
                toggler: !prev.toggler
            };
        });
    }

    componentDidMount(): void {
        this._logger = getContribLogger({
            module: "contrib-ui",
            class: "ManagedComponent",
            context: this.props.label
        });
        this._logger.info(`mount component`, {
            method: "componentDidMount"
        });
        this.setState({
            toggler: false
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

    render() {
        const { fitToContainer, isShown } = this.props;
        if (!isShown()) {
            return null;
        }

        if (this._logger) {
            this._logger.trace(`render component`, {
                method: "render"
            });
        }

        return (
            <div
                data-contrib-item={this.props.label}
                className={fitToContainer ? styles.fillContainer : ""}
            >
                {this.props.renderChildren()}
            </div>
        );
    }
}
