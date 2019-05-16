import { OverlayItem } from "./overlayItem";
import { OverlayItemData } from "./overlayItemData";
import { UpperBarManagerOptions } from "./upperBarManager";

export interface OverlayManagerOptions {
    eventManager: any;
    kalturaPlayer: any;
}

export class OverlayManager {
    private _items: OverlayItem<any>[] = [];
    private _options: OverlayManagerOptions;

    constructor(private options: OverlayManagerOptions) {
        this._options = options;
    }

    /**
     * initialize new overlay ui item
     * @param item
     */
    add<T>(data: OverlayItemData<T>): OverlayItem<T> {
        const itemOptions = {
            ...this._options,
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
