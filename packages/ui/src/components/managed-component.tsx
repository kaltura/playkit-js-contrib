import { h, Component, ComponentChild, ComponentChildren } from "preact";
import { getContribLogger } from '@playkit-js-contrib/common';
import { ContribLogger } from '@playkit-js-contrib/common';

type State = {
    toggler: boolean;
};
type Props = {
    isShown: () => boolean;
    renderChildren: () => ComponentChildren;
    label: string
};

export class ManagedComponent extends Component<Props, State> {
    private _logger: ContribLogger | null = null;

    update() {
        this.setState((prev: State) => {
            return {
                toggler: !prev.toggler
            };
        });
    }

    componentDidMount(): void {
        this._logger = getContribLogger({
            module: 'contrib-ui',
            class: 'ManagedComponent',
            context: this.props.label
        });
        this._logger.info(`mount component`, {
            method: 'componentDidMount'
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
            method: 'componentWillUnmount'
        });
    }

    render() {
        if (!this.props.isShown()) {
            return null;
        }

        if (this._logger) {
            this._logger.trace(`render component`, {
                method: 'render'
            });
        }

        return <div data-contrib-item={this.props.label}>
            {this.props.renderChildren()}
        </div>;
    }
}
