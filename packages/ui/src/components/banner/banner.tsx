import {Component, h} from 'preact';
import {ContribLogger, getContribLogger} from '@playkit-js-contrib/common';
import {BannerContent} from '../../bannerManager';
import * as styles from './_banner.scss';

export interface BannerProps {
  content: BannerContent;
}

export class Banner extends Component<BannerProps> {
  private _logger: ContribLogger = getContribLogger({
    module: 'contrib-ui',
    class: 'Banner',
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

  render({content}: BannerProps) {
    const {
      text,
      title = 'Audience asks:',
      icon = this._defaultIcon(),
    } = content;

    this._logger.trace(`render component`, {
      method: 'render',
    });

    return (
      <div className={styles.defaultBannerRoot + ' ' + styles.bannerWrapper}>
        <div className={styles.iconContainer}>
          <div className={styles.iconWrapper}>{icon}</div>
        </div>
        <div className={styles.bannerBody}>
          <div className={styles.title}>{title}</div>
          <div className={styles.text}>{text}</div>
        </div>
      </div>
    );
  }

  private _defaultIcon() {
    return <div className={styles.iconImage} />;
  }
}
