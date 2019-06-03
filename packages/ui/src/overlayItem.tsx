import { h } from "preact";
import { log, PlayerAPI } from "@playkit-js-contrib/common";
import { OverlayItemData, OverlayItemProps, OverlayUIModes } from "./overlayItemData";
import { PresetItem } from "./presetItem";
import { PlayerPresets, PresetAreas } from "./presetItemData";
import { PresetManager } from "./presetManager";
import { getPlayerSize, getVideoSize } from "./playerUtils";
import { PlayerSize, VideoSize } from "./common.types";

export interface OverlayItemOptions {
    playerAPI: PlayerAPI;
    presetManager: PresetManager;
    data: OverlayItemData<any>;
}

export class OverlayItem<TRoot> {
    private _destroyed = false;
    private _options: OverlayItemOptions;
    private _presetItem: PresetItem<OverlayItemProps>;
    private _cache: {
        canvas: {
            playerSize: PlayerSize;
            videoSize: VideoSize;
        };
    } = { canvas: { playerSize: { width: 0, height: 0 }, videoSize: { width: 0, height: 0 } } };

    constructor(options: OverlayItemOptions) {
        this._options = options;
        log("debug", `contrib-ui::OverlayItem:ctor()`, "executed", { options: options });
        this._addPlayerBindings();
        this._updateCachedCanvas();

        this._presetItem = this._createPresetItem();
    }

    private _updateCachedCanvas() {
        this._cache.canvas = {
            playerSize: getPlayerSize(this._options.playerAPI.kalturaPlayer),
            videoSize: getVideoSize(this._options.playerAPI.kalturaPlayer)
        };
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
            canvas: this._cache.canvas
        };
    }

    remove = (): void => {
        log("debug", `plugin-v7::overlayUI.remove()`, "executed");
        this._presetItem.hide();
    };

    add = (): void => {
        log("debug", `plugin-v7::overlayUI.add()`, "executed");
        this._cache.canvas = {
            playerSize: getPlayerSize(this._options.playerAPI.kalturaPlayer),
            videoSize: getVideoSize(this._options.playerAPI.kalturaPlayer)
        };

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
            this._updateCachedCanvas();
            this._presetItem.setProps(this._getRendererProps({}));
        });
    }
}
