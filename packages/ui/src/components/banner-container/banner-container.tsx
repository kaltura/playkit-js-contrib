import {Component, h} from 'preact';
import {ContribLogger, getContribLogger} from '@playkit-js-contrib/common';
import * as styles from './_banner-container.scss';

export interface BannerContainerProps {
  onClose: () => void;
  theme: BannerTheme;
}

interface BannerTheme {
  backgroundColor: string;
  blur: string;
}

export class BannerContainer extends Component<BannerContainerProps> {
  private _logger: ContribLogger = getContribLogger({
    module: 'contrib-ui',
    class: 'BannerContainer',
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

  render(props: BannerContainerProps) {
    this._logger.trace(`render component`, {
      method: 'render',
    });

    const {backgroundColor, blur} = this.props.theme;

    return (
      <div className={styles.bannerContainerRoot}>
        <div
          style={`
                background-color:${backgroundColor}; 
                backdrop-filter: blur(${blur});
             `}
          className={styles.bannerContainer}>
          <button className={styles.closeButton} onClick={props.onClose} />
          {this.props.children}
        </div>
      </div>
    );
  }
}
