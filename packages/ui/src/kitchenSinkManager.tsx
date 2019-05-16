import { KitchenSinkItemData } from "./kitchenSinkItemData";
import { KitchenSinkItem } from "./kitchenSinkItem";
import { OverlayManagerOptions } from "./overlayManager";

export interface KitchenSinkManagerOptions {
    eventManager: any;
    kalturaPlayer: any;
}

export class KitchenSinkManager {
    private _items: KitchenSinkItem[] = [];
    private _options: KitchenSinkManagerOptions;

    constructor(private options: KitchenSinkManagerOptions) {
        this._options = options;
    }
    /**
     * initialize new upper bar item
     * @param item
     */
    add(data: KitchenSinkItemData): KitchenSinkItem {
        const itemOptions = {
            ...this._options,
            data
        };
        const item = new KitchenSinkItem(itemOptions);
        this._items.push(item);
        return item;
    }

    /**
     * remove all ui manager items
     */
    reset(): void {}
}
