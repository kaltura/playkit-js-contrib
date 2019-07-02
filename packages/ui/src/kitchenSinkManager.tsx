import { ComponentChild, h } from "preact";
import { KitchenSinkItemData } from "./kitchenSinkItemData";
import { KitchenSinkItem } from "./kitchenSinkItem";
import { UpperBarManager } from "./upperBarManager";
import { PresetManager } from "./presetManager";
import { PlayerAPI, PlayerContribServices } from "@playkit-js-contrib/common";
import { PresetNames } from "./presetItemData";
import { KitchenSink } from "./components/kitchen-sink/kitchenSink";
import { PresetItem } from "./presetItem";

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

    private _kitchenSink: PresetItem<any> | null;
    private _items: KitchenSinkItem[] = [];
    private _options: KitchenSinkManagerOptions;

    constructor(private options: KitchenSinkManagerOptions) {
        this._options = options;
        this._kitchenSink = this.options.presetManager.add({
            label: "kitchen-sink-manager",
            fitToContainer: true,
            presets: [PresetNames.Playback, PresetNames.Live],
            container: { name: 'sidePanel', position: 'right'},
            renderer: this._render,
            initialProps: this._getRenderProps()
        });
    }

    private _getRenderProps() {
        return {
            onClose: this._onClose
        };
    }

    private _onClose = () => {
        // TODO replace with actual api
        // this is a workaround until the player external preset component support will be added
        const { kalturaPlayer } = this._options.playerAPI;
        const externalPlayerId = kalturaPlayer.config.targetId;
        const externalPlayer = KalturaPlayer.getPlayer(externalPlayerId);

        externalPlayer.setSidePanelMode("COLLAPSED");
    };

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
            tooltip: data.name,
            renderer: data.iconRenderer,
            onClick: () => this._onUpperBarClick(item)
        });

        return item;
    }

    private _render = (): ComponentChild => {
        const props = this._getRenderProps();
        const items = this._items.map(item => item.render(props));
        return <KitchenSink onClose={this._onClose}>{items}</KitchenSink>;
    };

    /**
     * remove all ui manager items
     */
    reset(): void {}

    private _onUpperBarClick(item: KitchenSinkItem) {
        // TODO replace with actual api
        // this is a workaround until the player external preset component support will be added
        const { kalturaPlayer } = this._options.playerAPI;
        const externalPlayerId = kalturaPlayer.config.targetId;
        const externalPlayer = KalturaPlayer.getPlayer(externalPlayerId);

        // TODO use enum that should be exposed by player
        if (externalPlayer.getSidePanelMode() === "COLLAPSED") {
            externalPlayer.setSidePanelMode("EXPANDED");
            return;
        }

        externalPlayer.setSidePanelMode("COLLAPSED");
    }
}
