import { ComponentChild, h, render } from "preact";
import { UpperBarItem } from "./upperBarItem";
import { UpperBarItemData } from "./upperBarItemData";
import { UpperBar } from "./components/upper-bar";
import { PresetManager } from "./presetManager";
import { PlayerPresets, PresetAreas } from "./presetItemData";
import { PlayerContribServices } from "@playkit-js-contrib/common";
import { PlayerAPI } from "@playkit-js-contrib/common";
import { PresetItem } from "./presetItem";

export interface UpperBarManagerOptions {
    playerAPI: PlayerAPI;
    presetManager: PresetManager;
}

export interface UpperBarRendererProps {}

const ResourceToken = "UpperBarManager-v1";

export class UpperBarManager {
    static fromPlayer(
        playerContribServices: PlayerContribServices,
        creator: () => UpperBarManager
    ) {
        return playerContribServices.register(ResourceToken, 1, creator);
    }

    private _items: UpperBarItem[] = [];
    private _options: UpperBarManagerOptions;
    private _upperBar: PresetItem<UpperBarRendererProps>;

    constructor(options: UpperBarManagerOptions) {
        this._options = options;
        this._upperBar = this._options.presetManager.add({
            label: "upper-bar-manager",
            preset: PlayerPresets.playback,
            area: PresetAreas.topBarRightControls,
            renderer: this._renderUpperBar,
            initialProps: {}
        });
    }

    private _renderUpperBar = (props: UpperBarRendererProps): ComponentChild => {
        const items = this._items.map(item => item.render({}));
        return <UpperBar>{items}</UpperBar>;
    };

    /**
     * initialize new upper bar item
     * @param item
     */
    add(data: UpperBarItemData): UpperBarItem {
        const itemOptions = {
            playerAPI: this._options.playerAPI,
            data
        };
        const item = new UpperBarItem(itemOptions);
        this._items.push(item);
        return item;
    }

    /**
     * remove all ui manager items
     */
    reset(): void {}
}
