import { h, render, cloneElement } from "preact";
import { OVPBasePlugin } from "./ovpBasePlugin";

export interface UIManagerItem {
    /**
     * mark ui manager item as destroyed.
     */
    destroy: () => void;

    /**
     * initialize ui manager item with relevant plugin instance
     * @param plugin
     */
    setPlugin(plugin: OVPBasePlugin): void;
}

export interface Options {
    plugin: any;
}

export class UIManager {
    private _plugin: any;

    private _items: UIManagerItem[] = [];

    constructor(options: Options) {
        this._plugin = options.plugin;
    }

    /**
     * initialize new ui manager item
     * @param item
     */
    add<T extends UIManagerItem>(item: T): T {
        item.setPlugin(this._plugin);
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
