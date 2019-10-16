import { FloatingItem } from "./floatingItem";
import { FloatingItemData, FloatingItemProps, FloatingPositions } from "./floatingItemData";
import { PresetManager } from "./presetManager";
import { PlayerContribServices } from "@playkit-js-contrib/common";
import { PresetNames } from "./presetItemData";
import { ComponentChild, h } from "preact";
import { PlayerSize, VideoSize } from "./common.types";
import { getPlayerSize, getVideoSize } from "./playerUtils";
import { ManagedComponent } from "./components/managed-component";

export interface FloatingManagerOptions {
    corePlayer: CorePlayer;
    presetManager: PresetManager;
}

const ResourceToken = "FloatingManager-v1";

export class FloatingManager {
    static fromPlayer(
        playerContribServices: PlayerContribServices,
        creator: () => FloatingManager
    ) {
        return playerContribServices.register(ResourceToken, 1, creator);
    }

    private _items: Record<FloatingPositions, FloatingItem[]> = {
        [FloatingPositions.VideoArea]: [],
        [FloatingPositions.InteractiveArea]: [],
        [FloatingPositions.PresetArea]: []
    };
    private _componentRef: Record<FloatingPositions, ManagedComponent | null> = {
        [FloatingPositions.InteractiveArea]: null,
        [FloatingPositions.VideoArea]: null,
        [FloatingPositions.PresetArea]: null
    };
    private _options: FloatingManagerOptions;
    private _cache: {
        canvas: {
            playerSize: PlayerSize;
            videoSize: VideoSize;
        };
    } = { canvas: { playerSize: { width: 0, height: 0 }, videoSize: { width: 0, height: 0 } } };

    constructor(private options: FloatingManagerOptions) {
        this._options = options;
        this.options.presetManager.add({
            label: "floating-manager",
            presets: [PresetNames.Playback, PresetNames.Live],
            container: { name: "PresetArea" },
            renderChild: () => this._renderChild(FloatingPositions.PresetArea)
        });

        this.options.presetManager.add({
            label: "floating-manager",
            presets: [PresetNames.Playback, PresetNames.Live],
            container: { name: "VideoArea" },
            renderChild: () => this._renderChild(FloatingPositions.VideoArea)
        });
        this.options.presetManager.add({
            label: "floating-manager",
            presets: [PresetNames.Playback, PresetNames.Live],
            container: { name: "InteractiveArea" },
            renderChild: () => this._renderChild(FloatingPositions.InteractiveArea)
        });
        this._addPlayerBindings();
        this._updateCachedCanvas();
    }

    /**
     * initialize new floating ui item
     * @param item
     */
    //TODO push new item to relevant position array according to its' FloatingPositions value
    add(data: FloatingItemData): FloatingItem | null {
        const { presetManager } = this._options;

        const itemOptions = {
            presetManager,
            ...this.options,
            data
        };

        const item = new FloatingItem(itemOptions);
        this._items[data.position].push(item);
        return item;
    }

    remove(item: FloatingItem) {
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

    private _getRendererProps(props: Partial<FloatingItemProps>): FloatingItemProps {
        const { corePlayer } = this._options;

        return {
            currentTime:
                typeof props.currentTime !== "undefined"
                    ? props.currentTime
                    : corePlayer.currentTime * 1000,
            canvas: this._cache.canvas
        };
    }

    private _updateCachedCanvas() {
        this._cache.canvas = {
            playerSize: getPlayerSize(this._options.corePlayer),
            videoSize: getVideoSize(this._options.corePlayer)
        };
    }

    private _renderChildren = (position: FloatingPositions) => {
        const props = this._getRendererProps({});
        return this._items[position].map(item => item.renderFloatingChild(props));
    };
    private _renderChild = (position: FloatingPositions): ComponentChild => {
        return (
            <ManagedComponent
                label={"floating-manager"}
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
        const { corePlayer } = this._options;

        corePlayer.addEventListener(corePlayer.Event.TIME_UPDATE, () => {
            this._updateComponents();
        });

        corePlayer.addEventListener(corePlayer.Event.MEDIA_LOADED, () => {
            this._updateCachedCanvas();
            this._updateComponents();
        });

        corePlayer.addEventListener(corePlayer.Event.RESIZE, () => {
            this._updateCachedCanvas();
            this._updateComponents();
        });
    }
}
