import {h, Component} from 'preact';

const defaultProps = {};

interface PopoverContentProps {
  children?: JSX.Element;
  clickHandler: (e: any) => void;
  keyHandler: (e: KeyboardEvent) => void;
}

export class PopoverContent extends Component<PopoverContentProps> {
  static defaultProps = {
    ...defaultProps,
  };

  componentDidMount() {
    document.addEventListener('click', this.props.clickHandler);
    document.addEventListener('keydown', this.props.keyHandler);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.props.clickHandler);
    document.removeEventListener('keydown', this.props.keyHandler);
  }

  render(props: PopoverContentProps): JSX.Element | null {
    if (!props.children) {
      return null;
    }
    return <div className="popover-conntent">{props.children}</div>;
  }
}
