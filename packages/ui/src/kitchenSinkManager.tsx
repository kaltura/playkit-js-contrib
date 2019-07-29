import { ComponentChild, h } from "preact";
import { KitchenSinkExpandModes, KitchenSinkItemData } from "./kitchenSinkItemData";
import { KitchenSinkItem, KitchenSinkItemRenderProps } from "./kitchenSinkItem";
import { UpperBarManager } from "./upperBarManager";
import { PresetManager } from "./presetManager";
import { PlayerAPI, PlayerContribServices } from "@playkit-js-contrib/common";
import { PresetNames } from "./presetItemData";
import { KitchenSink } from "./components/kitchen-sink/kitchenSink";

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

    private _items: KitchenSinkItem[] = [];
    private _options: KitchenSinkManagerOptions;
    // TODO sakal fix reference by connect
    private _kitchenSinkRef: { _component: KitchenSink } | null = null;

    constructor(private options: KitchenSinkManagerOptions) {
        this._options = options;
        this.options.presetManager.add({
            label: "kitchen-sink-manager",
            fitToContainer: true,
            shareAdvancedPlayerAPI: true,
            presets: [PresetNames.Playback, PresetNames.Live],
            container: { name: "sidePanel", position: "right" },
            renderChild: this._renderChild
        });
    }

    /**
     * initialize new upper bar item
     * @param item
     */
    add(data: KitchenSinkItemData): KitchenSinkItem {
        const itemOptions = {
            data
        };
        const item = new KitchenSinkItem(itemOptions);
        this._items.push(item);

        this.options.upperBarManager.add({
            label: data.label,
            renderItem: data.renderIcon,
            onClick: () => this._handleIconClick(item)
        });

        return item;
    }

    private _renderChild = (): ComponentChild => {
        const itemProps: KitchenSinkItemRenderProps = {
            onClose: this._handleOnClose
        };
        const items = this._items.map(item => item.renderContentChild(itemProps));
        return <KitchenSink ref={this._setRef}>{items}</KitchenSink>;
    };

    private _setRef = (ref: { _component: KitchenSink } | null) => {
        this._kitchenSinkRef = ref;
    };

    /**
     * remove all ui manager items
     */
    reset(): void {}

    private _handleOnClose = () => {
        if (!this._kitchenSinkRef) {
            return;
        }

        this._kitchenSinkRef._component.collapse();
    };

    private _handleIconClick = (item: KitchenSinkItem) => {
        if (!this._kitchenSinkRef) {
            return;
        }

        // TODO sakal fix reference by connect
        this._kitchenSinkRef._component.expand(item.data.expandMode);
    };
}
