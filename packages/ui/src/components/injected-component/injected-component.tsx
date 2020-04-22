import * as styles from './injected-component.scss';
import {getContribLogger} from '@playkit-js-contrib/common';

const logger = getContribLogger({
  module: 'contrib-ui',
  class: 'InjectedComponent',
});

const {h} = KalturaPlayer.ui.preact;

export interface InjectedComponentProps {
  onCreate: (options: {parent: HTMLDivElement}) => void;
  onDestroy: (options: {parent: HTMLDivElement}) => void;
  label: string;
  fillContainer: boolean;
}

class InjectedComponent extends KalturaPlayer.ui.preact.Component<
  InjectedComponentProps
> {
  _root = null;

  shouldComponentUpdate(): boolean {
    return false;
  }

  componentDidMount(): void {
    const {onCreate, label} = this.props;

    if (!onCreate) {
      logger.warn(`Cannot inject item, missing 'onCreate' method`, {
        data: {
          label,
        },
      });
      return;
    }

    const parentElement = this._root;
    if (!parentElement) {
      logger.warn(`Cannot inject item, ailed to create parent component`, {
        data: {
          label,
        },
      });
      return;
    }

    logger.debug(`inject component`, {
      data: {
        label,
      },
    });

    onCreate({parent: parentElement});
  }

  componentWillUnmount(): void {
    const {onDestroy, label} = this.props;
    const parentElement = this._root;

    if (!parentElement || !onDestroy) {
      return;
    }

    onDestroy({parent: parentElement});

    logger.debug(`destroy injected component`, {
      data: {
        label,
      },
    });
  }

  render() {
    const {label, fillContainer} = this.props;
    const className = fillContainer ? styles.fillContainer : '';
    return (
      <div
        data-contrib-injected={label}
        className={className}
        ref={ref => (this._root = ref)}
      />
    );
  }
}

export {InjectedComponent};
