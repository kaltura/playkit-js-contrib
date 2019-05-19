import { h } from "preact";
import { log, PlayerAPI } from "@playkit-js/ovp-common";
import { OverlayItemData, OverlayItemProps, OverlayUIModes } from "./overlayItemData";
import { PresetItem } from "./presetItem";
import { PlayerPresets, PresetAreas } from "./presetItemData";
import { PresetManager } from "./presetManager";

export interface OverlayItemOptions {
    playerAPI: PlayerAPI;
    presetManager: PresetManager;
    data: OverlayItemData<any>;
}

export class OverlayItem<TRoot> {
    private _destroyed = false;
    private _options: OverlayItemOptions;
    private _presetItem: PresetItem<OverlayItemProps>;

    constructor(options: OverlayItemOptions) {
        this._options = options;
        log("debug", `ovp-ui::OverlayItem:ctor()`, "executed", { options: options });
        this._addPlayerBindings();

        this._presetItem = this._createPresetItem();
    }

    private _createPresetItem(): PresetItem<OverlayItemProps> {
        const { presetManager, data } = this._options;

        return presetManager.add({
            label: data.name,
            preset: PlayerPresets.playback,
            area: PresetAreas.videoOverlay,
            renderer: (options: OverlayItemProps) => {
                const rendererProps = this._getRendererProps(options);
                return data.renderer(rendererProps);
            },
            initialProps: this._getRendererProps({})
        });
    }

    private _getRendererProps(props: Partial<OverlayItemProps>): OverlayItemProps {
        const { kalturaPlayer } = this._options.playerAPI;

        return {
            currentTime:
                typeof props.currentTime !== "undefined"
                    ? props.currentTime
                    : kalturaPlayer.currentTime * 1000,
            shouldHandleResize: props.shouldHandleResize || false
        };
    }
    remove = (): void => {
        log("debug", `plugin-v7::overlayUI.remove()`, "executed");
        this._presetItem.hide();
    };

    add = (): void => {
        log("debug", `plugin-v7::overlayUI.add()`, "executed");
        this._presetItem.show();
    };

    /**
     * destory the ui item
     */
    destroy(): void {
        log("debug", `plugin-v7::overlayUI.destroy()`, "executed");
        this._destroyed = true;
        this.remove();
    }

    private _addPlayerBindings() {
        const {
            playerAPI: { eventManager, kalturaPlayer },
            data
        } = this._options;

        if (data.mode === OverlayUIModes.MediaLoaded) {
            eventManager.listenOnce(kalturaPlayer, kalturaPlayer.Event.MEDIA_LOADED, this.add);
        }

        if (data.mode === OverlayUIModes.FirstPlay) {
            eventManager.listenOnce(kalturaPlayer, kalturaPlayer.Event.FIRST_PLAY, this.add);
        }

        eventManager.listen(kalturaPlayer, kalturaPlayer.Event.TIME_UPDATE, () => {
            this._presetItem.setProps(this._getRendererProps({}));
        });

        eventManager.listen(kalturaPlayer, kalturaPlayer.Event.RESIZE, () => {
            this._presetItem.setProps(this._getRendererProps({ shouldHandleResize: true }));
        });
    }
}
