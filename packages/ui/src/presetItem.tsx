import { ComponentChild, h } from "preact";
import { log, PlayerAPI } from "@playkit-js/ovp-common";
import { PresetAreas, PresetItemData } from "./presetItemData";
import { PresetItem as PresetItemComponent } from "./components/preset-item";

export interface PresetItemOptions<TProps extends Record<string, any>> {
    playerAPI: PlayerAPI;
    data: PresetItemData<TProps>;
}

export interface PresetItemProps {}

export class PresetItem<TProps extends Record<string, any>> {
    private _options: PresetItemOptions<TProps>;
    private _props: TProps;

    constructor(options: PresetItemOptions<TProps>) {
        this._options = options;
        log("debug", `ovp-ui::PresetItem:ctor()`, "executed", { options });
        this._props = this._options.data.initialProps;
        this._addPresetComponent();
    }

    setProps(props: TProps) {
        this._props = props;
    }

    show() {}

    hide() {}

    private _getPresetContainer(): string | null {
        const { area } = this._options.data;
        if (area === PresetAreas.videoOverlay) {
            return "player-gui";
        }

        if (area === PresetAreas.topBarRightControls) {
            return "top-bar__right-controls";
        }

        if (area === PresetAreas.sidePanel) {
            return "side-panel";
        }

        return null;
    }

    private _addPresetComponent(): void {
        const containerName = this._getPresetContainer();

        if (!containerName) {
            log(
                "warn",
                `ovp-ui::_addPresetComponent()`,
                `failed to match container for area ${this._options.data.area} `
            );
            return;
        }

        // TODO options and dedicated parent         if (this._presetParentMapping[])
        // TODO replace with actual api
        // this is a workaround until the player external preset component support will be added
        const { kalturaPlayer } = this._options.playerAPI;
        const externalPlayerId = kalturaPlayer.config.targetId;
        const externalPlayer = KalturaPlayer.getPlayer(externalPlayerId);
        externalPlayer.addExternalPresetComponent({
            presets: ["playbackUI", "liveUI"],
            container: containerName,
            component: this._render
        });
    }

    public _render = (): ComponentChild => {
        const { label, renderer, fitToContainer } = this._options.data;
        const children = renderer(this._props);
        // TODO set here actual name of plugin
        return (
            <PresetItemComponent label={label} fitToContainer={fitToContainer}>
                {children}
            </PresetItemComponent>
        );
    };
}
