import {Component, h, ComponentChild} from 'preact';
import {ContribLogger, getContribLogger} from '@playkit-js-contrib/common';
import * as styles from './_overlay-container.scss';

export interface OverlayContainerProps {
  label: string;
  content: () => OverlayItemOptions | null;
}

export interface OverlayItemOptions {
  label: string;
  renderContent: () => ComponentChild;
}

export class OverlayContainer extends Component<OverlayContainerProps> {
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

  update() {
    // trigger update of the comoponent
    this.forceUpdate();
  }

  render() {
    this._logger.trace(`render component`, {
      method: 'render',
    });
    const content = this.props.content();
    if (!content) {
      return null;
    }
    return (
      <div
        className={styles.overlayContainerRoot}
        data-contrib-item={this.props.label}>
        <div data-contrib-item={content.label} className={styles.overlayItem}>
          {content.renderContent && content.renderContent()}
        </div>
      </div>
    );
  }
}
