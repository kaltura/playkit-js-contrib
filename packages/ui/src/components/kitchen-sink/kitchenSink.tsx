import { Component, h } from "preact";
import * as styles from "./_kitchenSink.scss";
import { ContribLogger, getContribLogger } from "@playkit-js-contrib/common";
import { KitchenSinkExpandModes } from "../../kitchenSinkItemData";

export interface KitchenSinkRendererProps {
    updateSidePanelMode(mode: SidePanelModes): void;
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
export class KitchenSink extends Component<KitchenSinkRendererProps> {
    static defaultProps = {
        updateSidePanelMode: () => {}
    };

    private _logger: ContribLogger | null = null;

    componentDidMount(): void {
        this._logger = getContribLogger({
            module: "contrib-ui",
            class: "KitchenSink"
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

    public expand(mode: KitchenSinkExpandModes) {
        let sidePanelMode = SidePanelModes.OverTheVideo;
        if (mode === KitchenSinkExpandModes.AlongSideTheVideo) {
            sidePanelMode = SidePanelModes.AlongSideTheVideo;
        }
        this.props.updateSidePanelMode(sidePanelMode);
    }

    public collapse() {
        this.props.updateSidePanelMode(SidePanelModes.Hidden);
    }

    render(props: any) {
        if (this._logger) {
            this._logger.trace(`render component`, {
                method: "render"
            });
        }

        return <div className={styles.root}>{this.props.children}</div>;
    }
}
