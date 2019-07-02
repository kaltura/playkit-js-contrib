import { h, Component, ComponentChild, ComponentChildren } from "preact";
import { getFirstChild } from "./utils";

type State = {
    toggler: boolean;
};
type Props = {
    isShown: () => boolean;
    renderChildren: () => ComponentChildren;
    label: string
};

export class ManagedComponent extends Component<Props, State> {
    update() {
        this.setState((prev: State) => {
            return {
                toggler: !prev.toggler
            };
        });
    }

    componentDidMount(): void {
        this.setState({
            toggler: false
        });
    }

    render() {
        if (!this.props.isShown()) {
            return null;
        }

        console.log(`[contrib] [ManagedComponent(${this.props.label}).render()]: executed`);
        return <div data-contrib-item={this.props.label}>
            {this.props.renderChildren()}
        </div>;
    }
}
