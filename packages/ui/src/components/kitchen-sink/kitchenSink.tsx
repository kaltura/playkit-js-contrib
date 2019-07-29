import { Component, h } from "preact";
import * as styles from "./_kitchenSink.scss";
import { ContribLogger, getContribLogger } from "@playkit-js-contrib/common";
import { KitchenSinkExpandModes } from "../../kitchenSinkItemData";

export interface KitchenSinkRendererProps {
    updateSidePanelMode(mode: SidePanelModes): void;
}

export enum SidePanelModes {
    Expanded = "EXPANDED",
    Collapsed = "COLLAPSED",
    Partial = "PARTIAL"
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
        let sidePanelMode = SidePanelModes.Partial;
        if (mode === KitchenSinkExpandModes.SideToVideo) {
            sidePanelMode = SidePanelModes.Expanded;
        }
        this.props.updateSidePanelMode(sidePanelMode);
    }

    public collapse() {
        this.props.updateSidePanelMode(SidePanelModes.Collapsed);
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
