import {ComponentChild} from 'preact';
import {ContribLogger, getContribLogger} from '@playkit-js-contrib/common';
import * as styles from './_overlay-item-container.scss';
const {h, Component} = KalturaPlayer.ui.preact;

export interface OverlayContainerProps {
  renderContent: () => ComponentChild;
}

export class OverlayItemContainer extends Component<OverlayContainerProps> {
  private _logger: ContribLogger = getContribLogger({
    module: 'contrib-ui',
    class: 'OverlayContainer',
  });

  componentDidMount(): void {
    this._logger.info(`mount component`, {
      method: 'componentDidMount',
    });
  }

  componentWillUnmount(): void {
    this._logger.info(`unmount component`, {
      method: 'componentWillUnmount',
    });
  }

  render() {
    this._logger.trace(`render component`, {
      method: 'render',
    });
    const content = this.props.renderContent();
    if (!content) {
      return null;
    }
    return <div className={styles.overlayItemContainer}>{content}</div>;
  }
}
