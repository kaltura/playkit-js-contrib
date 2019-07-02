import { OverlayItem } from "./overlayItem";
import { OverlayItemData, OverlayItemProps, OverlayUIModes } from "./overlayItemData";
import { PresetManager } from "./presetManager";
import { PlayerAPI, PlayerContribServices } from "@playkit-js-contrib/common";
import { PresetNames } from "./presetItemData";
import { PresetItem } from "./presetItem";
import { ComponentChild, h } from "preact";
import { PlayerSize, VideoSize } from "./common.types";
import { getPlayerSize, getVideoSize } from "./playerUtils";
import { OverlayContainer } from './components/overlay-container';
import { ManagedComponent } from './components/managed-component';

export interface OverlayManagerOptions {
    playerAPI: PlayerAPI;
    presetManager: PresetManager;
}

const ResourceToken = "OverlayManager-v1";

export class OverlayManager {
    static fromPlayer(playerContribServices: PlayerContribServices, creator: () => OverlayManager) {
        return playerContribServices.register(ResourceToken, 1, creator);
    }

    private _overlayContainer: PresetItem<any> | null = null;
    private _items: OverlayItem[] = [];
    private _componentRef: ManagedComponent | null = null;
    private _options: OverlayManagerOptions;
    private _cache: {
        canvas: {
            playerSize: PlayerSize;
            videoSize: VideoSize;
        };
    } = { canvas: { playerSize: { width: 0, height: 0 }, videoSize: { width: 0, height: 0 } } };

    constructor(private options: OverlayManagerOptions) {
        this._options = options;
        this._overlayContainer = this.options.presetManager.add({
            label: "overlay-manager",
            fitToContainer: true,
            presets: [PresetNames.Playback, PresetNames.Live],
            container: { name: "video", isModal: false },
            renderer: this._render,
            initialProps: this._getRendererProps({})
        });
        this._addPlayerBindings();
        this._updateCachedCanvas();
    }

    /**
     * initialize new overlay ui item
     * @param item
     */
    add(data: OverlayItemData): OverlayItem | null {
        const { presetManager } = this._options;

        const itemOptions = {
            presetManager,
            ...this.options,
            data
        };

        const item = new OverlayItem(itemOptions);
        this._items.push(item);
        return item;
    }

    /**
     * remove all ui manager items
     */
    reset(): void {
        this._items.forEach(item => {
            try {
                item.destroy();
            } catch (e) {
                // TODO log error
                console.warn(e);
            }
        });

        this._items = [];
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

    private _updateCachedCanvas() {
        this._cache.canvas = {
            playerSize: getPlayerSize(this._options.playerAPI.kalturaPlayer),
            videoSize: getVideoSize(this._options.playerAPI.kalturaPlayer)
        };
    }

    private _renderChildren = () => {
        const props = this._getRendererProps({});
        return this._items.map(item => item.render(props));
    }
    private _render = (): ComponentChild => {
        // TODO sakal get label from renderer executer
        return <ManagedComponent label={'overlay-manager'}  renderChildren={this._renderChildren} shown={true} ref={ref => (this._componentRef = ref)} />
    };

    private _addPlayerBindings() {
        const {
            playerAPI: { eventManager, kalturaPlayer },
        } = this._options;

        eventManager.listen(kalturaPlayer, kalturaPlayer.Event.TIME_UPDATE, () => {
            if (!this._componentRef) {
                return;
            }

            this._componentRef.update();
        });

        eventManager.listen(kalturaPlayer, kalturaPlayer.Event.RESIZE, () => {
            if (!this._componentRef) {
                return;
            }

            this._updateCachedCanvas();

            this._componentRef.update();
        });
    }
}
