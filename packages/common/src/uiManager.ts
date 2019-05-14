export interface UIManagerItem {
    /**
     * mark ui manager item as destroyed.
     */
    destroy: () => void;
}

export class UIManager {
    private _items: any[] = [];

    constructor() {}

    /**
     * initialize new ui manager item
     * @param item
     */
    add<T extends UIManagerItem>(item: T): T {
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
