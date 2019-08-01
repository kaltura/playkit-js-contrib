import { h } from "preact";
import { ContribLogger, getContribLogger } from "@playkit-js-contrib/common";
import { KitchenSinkExpandModes, KitchenSinkPositions } from "../../kitchenSinkItemData";

export interface KitchenSinkAdapterProps {
    updateSidePanelMode: (position: SidePanelPositions, sidePanelMode: SidePanelModes) => void;
}

export enum SidePanelPositions {
    Left = "LEFT",
    Top = "TOP",
    Bottom = "BOTTOM",
    Right = "RIGHT"
}

export enum SidePanelModes {
    AlongSideTheVideo = "ALONG_SIDE_THE_VIDEO",
    Hidden = "HIDDEN",
    OverTheVideo = "OVER_THE_VIDEO"
}

@KalturaPlayer.ui.redux.connect(
    null,
    KalturaPlayer.ui.utils.bindActions(KalturaPlayer.ui.reducers.shell.actions),
    null,
    {
        forwardRef: true // TODO sakal fix reference by connect
    }
)
export class KitchenSinkAdapter extends KalturaPlayer.ui.preact.Component<KitchenSinkAdapterProps> {
    static defaultProps = {
        updateSidePanelMode: () => {}
    };

    private _logger: ContribLogger | null = null;

    componentDidMount(): void {
        this._logger = getContribLogger({
            module: "contrib-ui",
            class: "KitchenSinkManager"
        });
        this._logger.info(`mount component`, {
            method: "componentDidMount"
        });
    }

    componentWillUnmount(): void {
        if (!this._logger) {
            return;
        }

        this._logger.info(`unmount component`, {
            method: "componentWillUnmount"
        });
    }

    public expand(position: KitchenSinkPositions, mode: KitchenSinkExpandModes) {
        const sidePanelPosition =
            position === KitchenSinkPositions.Top
                ? SidePanelPositions.Top
                : position === KitchenSinkPositions.Bottom
                ? SidePanelPositions.Bottom
                : position === KitchenSinkPositions.Right
                ? SidePanelPositions.Right
                : SidePanelPositions.Left;

        const sidePanelMode =
            mode === KitchenSinkExpandModes.AlongSideTheVideo
                ? SidePanelModes.AlongSideTheVideo
                : SidePanelModes.OverTheVideo;

        this.props.updateSidePanelMode(sidePanelPosition, sidePanelMode);
    }

    public collapse(position: KitchenSinkPositions) {
        const sidePanelPosition =
            position === KitchenSinkPositions.Top
                ? SidePanelPositions.Top
                : position === KitchenSinkPositions.Bottom
                ? SidePanelPositions.Bottom
                : position === KitchenSinkPositions.Right
                ? SidePanelPositions.Right
                : SidePanelPositions.Left;
        this.props.updateSidePanelMode(sidePanelPosition, SidePanelModes.Hidden);
    }

    render(props: any) {
        return null;
    }
}
