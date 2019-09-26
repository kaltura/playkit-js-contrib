import { ComponentChild, h } from "preact";
import {
    KitchenSinkExpandModes,
    KitchenSinkItemData,
    KitchenSinkPositions
} from "./kitchenSinkItemData";
import { KitchenSinkItem, KitchenSinkItemRenderProps } from "./kitchenSinkItem";
import { UpperBarManager } from "./upperBarManager";
import { PresetManager } from "./presetManager";
import { PlayerAPI, PlayerContribServices } from "@playkit-js-contrib/common";
import { PresetNames } from "./presetItemData";
import { KitchenSink } from "./components/kitchen-sink/kitchenSink";
import { KitchenSinkAdapter } from "./components/kitchen-sink-adapter";

export interface KitchenSinkManagerOptions {
    playerAPI: PlayerAPI;
    presetManager: PresetManager;
    upperBarManager: UpperBarManager;
}

const ResourceToken = "KitchenSinkManager-v1";

export class KitchenSinkManager {
    static fromPlayer(
        playerContribServices: PlayerContribServices,
        creator: () => KitchenSinkManager
    ) {
        return playerContribServices.register(ResourceToken, 1, creator);
    }

    private _items: Record<KitchenSinkPositions, KitchenSinkItem[]> = {
        [KitchenSinkPositions.Bottom]: [],
        [KitchenSinkPositions.Right]: [],
        [KitchenSinkPositions.Top]: [],
        [KitchenSinkPositions.Left]: []
    };
    private _options: KitchenSinkManagerOptions;
    private _kitchenSinkAdapterRef: KitchenSinkAdapter | null = null;

    constructor(private options: KitchenSinkManagerOptions) {
        this._options = options;
        this.options.presetManager.add({
            label: "kitchen-sink-right",
            fitToContainer: true,
            presets: [PresetNames.Playback, PresetNames.Live],
            container: { name: "sidePanel", position: "right" },
            renderChild: this._renderChild.bind(this, KitchenSinkPositions.Right)
        });

        this.options.presetManager.add({
            label: "kitchen-sink-bottom",
            fitToContainer: true,
            presets: [PresetNames.Playback, PresetNames.Live],
            container: { name: "sidePanel", position: "bottom" },
            renderChild: this._renderChild.bind(this, KitchenSinkPositions.Bottom)
        });

        this.options.presetManager.add({
            label: "kitchen-sink-manager",
            fitToContainer: true,
            shareAdvancedPlayerAPI: true,
            presets: [PresetNames.Playback, PresetNames.Live],
            container: { name: "overlay" },
            renderChild: () => <KitchenSinkAdapter ref={this._setRef} />
        });
    }

    /**
     * initialize new upper bar item
     * @param item
     */
    add(data: KitchenSinkItemData): KitchenSinkItem {
        const itemOptions = {
            data,
            isExpanded: this._isExpanded,
            expand: this._expand
        };
        const item = new KitchenSinkItem(itemOptions);
        this._items[data.position].push(item);

        this.options.upperBarManager.add({
            label: data.label,
            renderItem: data.renderIcon,
            onClick: () => this._expand(item.data.position, item.data.expandMode)
        });

        return item;
    }

    private _isExpanded = (position: KitchenSinkPositions): boolean => {
        if (!this._kitchenSinkAdapterRef) {
            return false;
        }
        return (
            this._kitchenSinkAdapterRef.getSidePanelMode(position) !== KitchenSinkExpandModes.Hidden
        );
    };

    private _expand = (
        position: KitchenSinkPositions,
        expandMode: KitchenSinkExpandModes
    ): void => {
        if (!this._kitchenSinkAdapterRef) {
            return;
        }

        this._kitchenSinkAdapterRef.expand(position, expandMode);
    };

    private _renderChild = (position: KitchenSinkPositions): ComponentChild => {
        const itemProps: KitchenSinkItemRenderProps = {
            onClose: this._handleOnClose.bind(this, position)
        };
        const items = this._items[position].map(item => item.renderContentChild(itemProps));
        return <KitchenSink>{items}</KitchenSink>;
    };

    private _setRef = (ref: { _component: KitchenSinkAdapter } | null) => {
        this._kitchenSinkAdapterRef = ref ? ref._component : null;
    };

    /**
     * remove all ui manager items
     */
    reset(): void {}

    private _handleOnClose = (position: KitchenSinkPositions) => {
        if (!this._kitchenSinkAdapterRef) {
            return;
        }

        this._kitchenSinkAdapterRef.collapse(position);
    };
}
