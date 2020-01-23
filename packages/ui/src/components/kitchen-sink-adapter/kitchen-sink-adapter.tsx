import {ContribLogger, getContribLogger} from '@playkit-js-contrib/common';
import {
  KitchenSinkExpandModes,
  KitchenSinkPositions,
} from '../../kitchen-sink-item-data';
const {h, Component} = KalturaPlayer.ui.preact;

export interface KitchenSinkAdapterProps {
  updateSidePanelMode: (
    position: SidePanelPositions,
    sidePanelMode: SidePanelModes
  ) => void;
  sidePanelsModes?: SidePanelModes;
}

export enum SidePanelPositions {
  Left = 'LEFT',
  Top = 'TOP',
  Bottom = 'BOTTOM',
  Right = 'RIGHT',
}

export enum SidePanelModes {
  AlongSideTheVideo = 'ALONG_SIDE_THE_VIDEO',
  Hidden = 'HIDDEN',
  OverTheVideo = 'OVER_THE_VIDEO',
}

const mapStateToProps = state => {
  return {
    sidePanelsModes: state.shell.sidePanelsModes,
  };
};

@KalturaPlayer.ui.redux.connect(
  mapStateToProps,
  KalturaPlayer.ui.utils.bindActions(KalturaPlayer.ui.reducers.shell.actions),
  null,
  {
    forwardRef: true,
  }
)
export class KitchenSinkAdapter extends Component<KitchenSinkAdapterProps> {
  static defaultProps = {
    updateSidePanelMode: () => {},
  };

  private _logger: ContribLogger | null = null;

  componentDidMount(): void {
    this._logger = getContribLogger({
      module: 'contrib-ui',
      class: 'KitchenSinkAdapter',
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

  public expand(position: KitchenSinkPositions, mode: KitchenSinkExpandModes) {
    this.props.updateSidePanelMode(
      this._convertToAdapterPositionEnum(position),
      this._convertToAdapterModeEnum(mode)
    );
  }

  public getSidePanelMode(
    position: KitchenSinkPositions
  ): KitchenSinkExpandModes {
    if (!this.props.sidePanelsModes) return KitchenSinkExpandModes.Hidden;
    return this._convertToKitchenSinkModeEnum(
      this.props.sidePanelsModes[this._convertToAdapterPositionEnum(position)]
    );
  }

  public collapse(position: KitchenSinkPositions) {
    this.props.updateSidePanelMode(
      this._convertToAdapterPositionEnum(position),
      SidePanelModes.Hidden
    );
  }

  render(props: any) {
    return null;
  }

  private _convertToAdapterPositionEnum(
    position: KitchenSinkPositions
  ): SidePanelPositions {
    return position === KitchenSinkPositions.Top
      ? SidePanelPositions.Top
      : position === KitchenSinkPositions.Bottom
      ? SidePanelPositions.Bottom
      : position === KitchenSinkPositions.Right
      ? SidePanelPositions.Right
      : SidePanelPositions.Left;
  }

  private _convertToAdapterModeEnum(
    mode: KitchenSinkExpandModes
  ): SidePanelModes {
    return mode === KitchenSinkExpandModes.AlongSideTheVideo
      ? SidePanelModes.AlongSideTheVideo
      : mode === KitchenSinkExpandModes.OverTheVideo
      ? SidePanelModes.OverTheVideo
      : SidePanelModes.Hidden;
  }

  private _convertToKitchenSinkModeEnum(
    mode: SidePanelModes
  ): KitchenSinkExpandModes {
    return mode === SidePanelModes.AlongSideTheVideo
      ? KitchenSinkExpandModes.AlongSideTheVideo
      : mode === SidePanelModes.OverTheVideo
      ? KitchenSinkExpandModes.OverTheVideo
      : KitchenSinkExpandModes.Hidden;
  }
}
