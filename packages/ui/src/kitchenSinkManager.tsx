import { ComponentChild, h } from "preact";
import {
    KitchenSinkExpandModes,
    KitchenSinkItemData,
    KitchenSinkPositions
} from "./kitchenSinkItemData";
import { KitchenSinkItem, KitchenSinkItemRenderProps } from "./kitchenSinkItem";
import { UpperBarManager } from "./upperBarManager";
import { PresetManager } from "./presetManager";
import { EventsManager, PlayerContribRegistry } from "@playkit-js-contrib/common";
import { PresetNames } from "./presetItemData";
import { KitchenSinkContainer } from "./components/kitchen-sink-container/kitchenSinkContainer";
import { KitchenSinkAdapter } from "./components/kitchen-sink-adapter";

export interface KitchenSinkManagerOptions {
    corePlayer: KalturaPlayerTypes.Player;
    presetManager: PresetManager;
    upperBarManager: UpperBarManager;
}

export enum ItemActiveStates {
    Active = "Active",
    InActive = "InActive"
}

export enum EventTypes {
    ItemActiveStateChangeEvent = "ItemActiveStateChangeEvent"
}

export interface ItemActiveStateChangeEvent {
    type: EventTypes.ItemActiveStateChangeEvent;
    state: ItemActiveStates;
    item: KitchenSinkItem;
}

type Events = ItemActiveStateChangeEvent;

const ResourceToken = "KitchenSinkManager-v1";

export class KitchenSinkManager {
    static fromPlayer(
        playerContribRegistry: PlayerContribRegistry,
        creator: () => KitchenSinkManager
    ) {
        return playerContribRegistry.register(ResourceToken, 1, creator);
    }

    private _events: EventsManager<Events> = new EventsManager<Events>();

    private _items: Record<KitchenSinkPositions, KitchenSinkItem[]> = {
        [KitchenSinkPositions.Bottom]: [],
        [KitchenSinkPositions.Right]: [],
        [KitchenSinkPositions.Top]: [],
        [KitchenSinkPositions.Left]: []
    };

    private _activeItems: Record<KitchenSinkPositions, KitchenSinkItem> = {
        [KitchenSinkPositions.Bottom]: null,
        [KitchenSinkPositions.Right]: null,
        [KitchenSinkPositions.Top]: null,
        [KitchenSinkPositions.Left]: null
    };

    private _options: KitchenSinkManagerOptions;
    private _kitchenSinkAdapterRef: KitchenSinkAdapter | null = null;

    on: EventsManager<Events>["on"] = this._events.on.bind(this._events);
    off: EventsManager<Events>["off"] = this._events.off.bind(this._events);

    constructor(private options: KitchenSinkManagerOptions) {
        this._options = options;
        this.options.presetManager.add({
            label: "kitchen-sink-right",
            fillContainer: true,
            presets: [PresetNames.Playback, PresetNames.Live],
            container: { name: "SidePanel", position: "Right" },
            renderChild: this._renderChild.bind(this, KitchenSinkPositions.Right)
        });

        this.options.presetManager.add({
            label: "kitchen-sink-bottom",
            fillContainer: true,
            presets: [PresetNames.Playback, PresetNames.Live],
            container: { name: "SidePanel", position: "Bottom" },
            renderChild: this._renderChild.bind(this, KitchenSinkPositions.Bottom)
        });

        this.options.presetManager.add({
            label: "kitchen-sink-adapter",
            shareAdvancedPlayerAPI: true,
            presets: [PresetNames.Playback, PresetNames.Live],
            container: { name: "PlayerArea" },
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
            isActive: this._isActive,
            activate: this._activateItem,
            deactivate: this._deactivateItem,
            onActivationStateChange: this.on,
            unregisterActivationStateChange: this.off
        };
        const item = new KitchenSinkItem(itemOptions);
        this._items[data.position].push(item);

        this.options.upperBarManager.add({
            label: data.label,
            renderItem: data.renderIcon,
            onClick: () => this._toggle(item)
        });

        return item;
    }

    //todo [sa] implement
    remove(item: KitchenSinkItem): void {
        //deactivate item if needed
        //remove upper bar icon
        //remove from _items
        //call item.destroy
        //refresh UI ???
    }

    private _toggle = (item: KitchenSinkItem): void => {
        if (this._isActive(item)) {
            this._deactivateItem(item);
        } else {
            this._activateItem(item);
        }
    };

    private _activateItem = (item: KitchenSinkItem): void => {
        const { position, expandMode } = item.data;
        // trying to activate an already active item
        if (this._activeItems[position] === item) return;
        // switch between items if currently there is an active one (without collapsing / expanding KS)
        if (this._activeItems[position]) {
            //trigger item de-activation event
            this._events.emit({
                type: EventTypes.ItemActiveStateChangeEvent,
                state: ItemActiveStates.InActive,
                item: this._activeItems[position]
            });
        }
        //update new item as active
        this._activeItems[position] = item;
        //trigger new item activation event
        this._events.emit({
            type: EventTypes.ItemActiveStateChangeEvent,
            state: ItemActiveStates.Active,
            item: item
        });
        //expand kitchenSink component (won't do anything if already expanded)
        this._expand(position, expandMode);
    };

    private _deactivateItem = (item: KitchenSinkItem): void => {
        const { position } = item.data;
        //item is not active
        if (this._activeItems[position] !== item) return;
        //collapse kitchenSink component
        this._collapse(position);
        //trigger item de-activation event
        this._events.emit({
            type: EventTypes.ItemActiveStateChangeEvent,
            state: ItemActiveStates.InActive,
            item: this._activeItems[position]
        });
        //remove item from _activeItems
        this._activeItems[position] = null;
    };

    private _isActive = (item: KitchenSinkItem): boolean => {
        return this._activeItems[item.data.position] === item;
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

    private _collapse(position: KitchenSinkPositions): void {
        if (!this._kitchenSinkAdapterRef) {
            return;
        }

        this._kitchenSinkAdapterRef.collapse(position);
    }

    private _renderChild = (position: KitchenSinkPositions): ComponentChild => {
        const items = this._items[position].map(item => {
            const itemProps: KitchenSinkItemRenderProps = {
                onClose: this._deactivateItem.bind(this, item)
            };
            return item.renderContentChild(itemProps);
        });
        return <KitchenSinkContainer>{items}</KitchenSinkContainer>;
    };

    private _setRef = (ref: KitchenSinkAdapter | null) => {
        this._kitchenSinkAdapterRef = ref ? ref : null;
    };

    /**
     * remove all ui manager items
     */
    reset(): void {
        //todo [sa] unregister items from eventManager events
        //iterate over all items and call this.remove(item)
    }
}
