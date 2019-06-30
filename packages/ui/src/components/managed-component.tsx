import { h, Component, ComponentChild } from "preact";
import { getFirstChild } from "./utils";

type State = {
    toggler: boolean;
};
type Props = {
    children: any;
    renderer?: () => ComponentChild;
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
        this.setState(() => {
            return { toggler: false };
        });
    }

    render() {
        const { renderer } = this.props;
        return renderer ? renderer() : getFirstChild(this.props.children);
    }
}
