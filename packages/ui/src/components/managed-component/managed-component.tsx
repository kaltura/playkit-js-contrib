import {
  h,
  Component,
  ComponentChild,
  ComponentChildren,
  Fragment,
} from 'preact';
import {getContribLogger} from '@playkit-js-contrib/common';
import {ContribLogger} from '@playkit-js-contrib/common';
import * as styles from './_managed-component.scss';
const {
  redux: {connect},
} = KalturaPlayer.ui;

type ManagedComponentState = {
  toggler: boolean;
};
type ManagedComponentProps = {
  isShown: () => boolean;
  renderChildren: (playerSize: string) => ComponentChildren;
  label: string;
  fillContainer: boolean;
  playerSize?: string;
  updateOnPlayerSizeChanged?: boolean;
};

const mapStateToProps = (state: Record<string, any>) => ({
  playerSize: state.shell.playerSize,
});
@connect(mapStateToProps, null, null, {forwardRef: true})
export class ManagedComponent extends Component<
  ManagedComponentProps,
  ManagedComponentState
> {
  private _logger: ContribLogger | null = null;

  static defaultProps = {
    fillContainer: false,
  };

  update() {
    this.setState((prev: ManagedComponentState) => {
      return {
        toggler: !prev.toggler,
      };
    });
  }

  shouldComponentUpdate(prevProps: Readonly<ManagedComponentProps>): boolean {
    const {updateOnPlayerSizeChanged, playerSize} = this.props;
    return (
      (updateOnPlayerSizeChanged && prevProps.playerSize !== playerSize) ||
      prevProps.playerSize === playerSize
    );
  }

  componentDidMount(): void {
    this._logger = getContribLogger({
      module: 'contrib-ui',
      class: 'ManagedComponent',
      context: this.props.label,
    });
    this._logger.info(`mount component`, {
      method: 'componentDidMount',
    });
    this.setState({
      toggler: false,
    });
  }

  render() {
    const {fillContainer, isShown, playerSize} = this.props;
    if (!isShown()) {
      return null;
    }

    if (this._logger) {
      this._logger.trace(`render component`, {
        method: 'render',
      });
    }

    return (
      <div
        data-contrib-item={this.props.label}
        className={[
          `${fillContainer ? styles.fillContainer : ''}`,
          styles.inlineContainer,
        ].join(' ')}>
        {this.props.renderChildren(playerSize)}
      </div>
    );
  }
}
