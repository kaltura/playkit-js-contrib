import { h, render } from "preact";
import { UpperBarItem } from "./upperBarItem";
import { UpperBarItemData } from "./upperBarItemData";
import { UpperBar } from "./components/upper-bar";

export interface UpperBarManagerOptions {
    eventManager: any;
    kalturaPlayer: any;
}

export class UpperBarManager {
    private _root: any;
    private _rootParent: any;
    private _destroyed = false;
    private _items: UpperBarItem[] = [];
    private _options: UpperBarManagerOptions;

    constructor(private options: UpperBarManagerOptions) {
        this._options = options;

        this._renderRoot();
    }

    /**
     * initialize new upper bar item
     * @param item
     */
    add(data: UpperBarItemData): UpperBarItem {
        const itemOptions = {
            ...this._options,
            data
        };
        const item = new UpperBarItem(itemOptions);
        this._items.push(item);
        return item;
    }

    private _renderRoot = (): void => {
        if (this._destroyed) {
            throw new Error("item was destroyed, cannot create root");
        }

        if (this._root) {
            return;
        }

        const { kalturaPlayer } = this._options;
        const playerViewId = kalturaPlayer.config.targetId;
        const playerParentElement = document.querySelector(`div#${playerViewId} div#player-gui`);

        if (!playerParentElement) {
            return;
        }

        this._rootParent = document.createElement("div");
        playerParentElement.append(this._rootParent);

        this._root = render(<UpperBar />, this._rootParent);
    };

    /**
     * remove all ui manager items
     */
    reset(): void {}
}
