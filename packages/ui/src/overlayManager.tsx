import { OverlayItem } from "./overlayItem";
import { OverlayItemData, OverlayItemProps } from "./overlayItemData";
import { PresetManager } from "./presetManager";
import { PlayerPresets, PresetAreas } from "./presetItemData";
import { PlayerAPI, PlayerContribServices } from "@playkit-js/ovp-common";

export interface OverlayManagerOptions {
    playerAPI: PlayerAPI;
    presetManager: PresetManager;
}

const ResourceToken = "OverlayManager-v1";

export class OverlayManager {
    static fromPlayer(playerContribServices: PlayerContribServices, creator: () => OverlayManager) {
        return playerContribServices.register(ResourceToken, 1, creator);
    }

    private _items: OverlayItem<any>[] = [];
    private _options: OverlayManagerOptions;

    constructor(private options: OverlayManagerOptions) {
        this._options = options;
    }

    /**
     * initialize new overlay ui item
     * @param item
     */
    add<T>(data: OverlayItemData<T>): OverlayItem<T> | null {
        const { presetManager } = this._options;

        const itemOptions = {
            presetManager,
            ...this.options,
            data
        };

        const item = new OverlayItem<any>(itemOptions);
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
}
