const {h} = KalturaPlayer.ui.preact;
import {ContribLogger, getContribLogger} from '@playkit-js-contrib/common';

export interface UIPlayerAdapterProps {
  player: KalturaPlayerTypes.Player;
  onMount: (player: KalturaPlayerTypes.Player) => void;
  onUnmount: (player: KalturaPlayerTypes.Player) => void;
}

@KalturaPlayer.ui.components.withPlayer
export class UIPlayerAdapter extends KalturaPlayer.ui.preact.Component<
  UIPlayerAdapterProps
> {
  static defaultProps = {
    player: null,
  };

  private _logger: ContribLogger | null = null;

  componentDidMount(): void {
    this._logger = getContribLogger({
      module: 'contrib-ui',
      class: 'UIPlayerAdapter',
    });
    this._logger.info(`mount component`, {
      method: 'componentDidMount',
    });

    this.props.onMount(this.props.player);
  }

  componentWillUnmount(): void {
    this.props.onUnmount(this.props.player);

    if (!this._logger) {
      return;
    }

    this._logger.info(`unmount component`, {
      method: 'componentWillUnmount',
    });
  }

  render(props: any) {
    return null;
  }
}
