import { OverlayItem } from "./overlayItem";
import { OverlayItemData, OverlayItemProps, OverlayPositions } from "./overlayItemData";
import { PresetManager } from "./presetManager";
import { PlayerContribServices } from "@playkit-js-contrib/common";
import { PresetNames } from "./presetItemData";
import { ComponentChild, h } from "preact";
import { PlayerSize, VideoSize } from "./common.types";
import { getPlayerSize, getVideoSize } from "./playerUtils";
import { ManagedComponent } from "./components/managed-component";

export interface OverlayManagerOptions {
    kalturaPlayer: KalturaPlayerInstance;
    presetManager: PresetManager;
}

const ResourceToken = "OverlayManager-v1";

export class OverlayManager {
    static fromPlayer(playerContribServices: PlayerContribServices, creator: () => OverlayManager) {
        return playerContribServices.register(ResourceToken, 1, creator);
    }

    private _items: Record<OverlayPositions, OverlayItem[]> = {
        [OverlayPositions.VideoArea]: [],
        [OverlayPositions.InteractiveArea]: [],
        [OverlayPositions.PresetArea]: []
    };
    private _componentRef: Record<OverlayPositions, ManagedComponent | null> = {
        [OverlayPositions.InteractiveArea]: null,
        [OverlayPositions.VideoArea]: null,
        [OverlayPositions.PresetArea]: null
    };
    private _options: OverlayManagerOptions;
    private _cache: {
        canvas: {
            playerSize: PlayerSize;
            videoSize: VideoSize;
        };
    } = { canvas: { playerSize: { width: 0, height: 0 }, videoSize: { width: 0, height: 0 } } };

    constructor(private options: OverlayManagerOptions) {
        this._options = options;
        this.options.presetManager.add({
            label: "overlay-manager",
            presets: [PresetNames.Playback, PresetNames.Live],
            container: { name: "PresetArea" },
            renderChild: () => this._renderChild(OverlayPositions.PresetArea)
        });

        this.options.presetManager.add({
            label: "overlay-manager",
            presets: [PresetNames.Playback, PresetNames.Live],
            container: { name: "VideoArea" },
            renderChild: () => this._renderChild(OverlayPositions.VideoArea)
        });
        this.options.presetManager.add({
            label: "overlay-manager",
            presets: [PresetNames.Playback, PresetNames.Live],
            container: { name: "InteractiveArea" },
            renderChild: () => this._renderChild(OverlayPositions.InteractiveArea)
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
        this._items[data.position].push(item);
        return item;
    }

    remove(item: OverlayItem) {
        const positionItems = this._items[item.data.position];
        let itemIndex = positionItems.indexOf(item);
        if (itemIndex > -1) {
            positionItems[itemIndex].destroy();
            positionItems.splice(itemIndex, 1);
        } else {
            console.warn(`couldn't remove ${item} since it wasn't found`);
        }
    }

    reset(): void {
        // TODO sakal missing
    }
    /**
     * destroy all ui manager items
     */
    destroy(): void {
        // TODO sakal sohuld call on destroy
        const allItems = [
            ...this._items.VideoArea,
            ...this._items.InteractiveArea,
            ...this._items.PresetArea
        ];
        allItems.forEach(item => {
            try {
                item.destroy();
            } catch (e) {
                // TODO log error
                console.warn(e);
            }
        });

        this._items.VideoArea = [];
        this._items.PresetArea = [];
        this._items.InteractiveArea = [];
    }

    private _getRendererProps(props: Partial<OverlayItemProps>): OverlayItemProps {
        const { kalturaPlayer } = this._options;

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
            playerSize: getPlayerSize(this._options.kalturaPlayer),
            videoSize: getVideoSize(this._options.kalturaPlayer)
        };
    }

    private _renderChildren = (position: OverlayPositions) => {
        const props = this._getRendererProps({});
        return this._items[position].map(item => item.renderOverlayChild(props));
    };
    private _renderChild = (position: OverlayPositions): ComponentChild => {
        return (
            <ManagedComponent
                label={"overlay-manager"}
                renderChildren={() => this._renderChildren(position)}
                isShown={() => true}
                ref={ref => (this._componentRef[position] = ref)}
            />
        );
    };

    private _updateComponents() {
        if (this._componentRef.InteractiveArea) {
            this._componentRef.InteractiveArea.update();
        }

        if (this._componentRef.PresetArea) {
            this._componentRef.PresetArea.update();
        }

        if (this._componentRef.VideoArea) {
            this._componentRef.VideoArea.update();
        }
    }

    private _addPlayerBindings() {
        const { kalturaPlayer } = this._options;

        kalturaPlayer.addEventListener(kalturaPlayer.Event.TIME_UPDATE, () => {
            this._updateComponents();
        });

        kalturaPlayer.addEventListener(kalturaPlayer.Event.MEDIA_LOADED, () => {
            this._updateCachedCanvas();
            this._updateComponents();
        });

        kalturaPlayer.addEventListener(kalturaPlayer.Event.RESIZE, () => {
            this._updateCachedCanvas();
            this._updateComponents();
        });
    }
}
