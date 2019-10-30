import {Component, h} from 'preact';
import * as styles from './_kitchen-sink-container.scss';
import {ContribLogger, getContribLogger} from '@playkit-js-contrib/common';

export interface KitchenSinkContainerRendererProps {}

export class KitchenSinkContainer extends Component<
  KitchenSinkContainerRendererProps
> {
  static defaultProps = {
    updateSidePanelMode: () => {},
  };

  private _logger: ContribLogger | null = null;

  componentDidMount(): void {
    this._logger = getContribLogger({
      module: 'contrib-ui',
      class: 'KitchenSinkContainer',
    });
    this._logger.info(`mount component`, {
      method: 'componentDidMount',
    });
  }

  componentWillUnmount(): void {
    if (!this._logger) {
      return;
    }

    this._logger.info(`unmount component`, {
      method: 'componentWillUnmount',
    });
  }

  render(props: any) {
    if (this._logger) {
      this._logger.trace(`render component`, {
        method: 'render',
      });
    }

    return <div className={styles.root}>{this.props.children}</div>;
  }
}
