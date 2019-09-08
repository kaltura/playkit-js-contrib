import { OverlayItem } from "./overlayItem";
import { OverlayItemData, OverlayItemProps, OverlayUIModes } from "./overlayItemData";
import { PresetManager } from "./presetManager";
import { PlayerAPI, PlayerContribServices } from "@playkit-js-contrib/common";
import { PresetNames } from "./presetItemData";
import { PresetItem } from "./presetItem";
import { ComponentChild, h } from "preact";
import { PlayerSize, VideoSize } from "./common.types";
import { getPlayerSize, getVideoSize } from "./playerUtils";
import { OverlayContainer } from "./components/overlay-container";
import { ManagedComponent } from "./components/managed-component";

export interface OverlayManagerOptions {
    playerAPI: PlayerAPI;
    presetManager: PresetManager;
}

const ResourceToken = "OverlayManager-v1";

export class OverlayManager {
    static fromPlayer(playerContribServices: PlayerContribServices, creator: () => OverlayManager) {
        return playerContribServices.register(ResourceToken, 1, creator);
    }

    private _overlayContainer: PresetItem | null = null;
    // TODO change _items to be a Record<OverlayPositions, OverlayItem[]> to support all kind of positions
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
        // TODO add representation
        // TODO add two place holders, one for each OverlayPositions values.
        this._options = options;
        this._overlayContainer = this.options.presetManager.add({
            label: "overlay-manager",
            presets: [PresetNames.Playback, PresetNames.Live],
            container: { name: "VideoOverlay" },
            renderChild: this._renderChild
        });
        this._addPlayerBindings();
        this._updateCachedCanvas();
    }

    /**
     * initialize new overlay ui item
     * @param item
     */
    //TODO push new item to relevant position array according to its' OverlayPositions value
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

    remove(item: OverlayItem) {
        let itemIndex = this._items.indexOf(item);
        if (itemIndex > -1) {
            this._items[itemIndex].destroy();
            this._items.splice(itemIndex, 1);
        } else {
            console.warn(`couldn't remove ${item} since it wasn't found`);
        }
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
        return this._items.map(item => item.renderOverlayChild(props));
    };
    private _renderChild = (): ComponentChild => {
        // TODO sakal get label from renderer executer
        return (
            <ManagedComponent
                label={"overlay-manager"}
                renderChildren={this._renderChildren}
                isShown={() => true}
                ref={ref => (this._componentRef = ref)}
            />
        );
    };

    private _addPlayerBindings() {
        const {
            playerAPI: { eventManager, kalturaPlayer }
        } = this._options;

        eventManager.listen(kalturaPlayer, kalturaPlayer.Event.TIME_UPDATE, () => {
            if (!this._componentRef) {
                return;
            }

            this._componentRef.update();
        });

        eventManager.listen(kalturaPlayer, kalturaPlayer.Event.MEDIA_LOADED, () => {
            if (!this._componentRef) {
                return;
            }
            this._updateCachedCanvas();
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
