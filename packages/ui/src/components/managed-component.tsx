import { h, Component } from "preact";
import { getFirstChild } from "./utils";

type State = {
    toggler: boolean;
};
type Props = {
    children: any;
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
        const { toggler } = this.state;
        console.log(">>>>> managed component render", { toggler: this.state.toggler });
        return getFirstChild(this.props.children);
    }
}
