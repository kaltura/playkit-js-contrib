import {ComponentChild, h} from 'preact';
import {
  KitchenSinkExpandModes,
  KitchenSinkItemData,
  KitchenSinkPositions,
} from './kitchen-sink-item-data';
import {KitchenSinkItem, KitchenSinkItemRenderProps} from './kitchen-sink-item';
import {UpperBarManager} from './upper-bar-manager';
import {PresetManager} from './preset-manager';
import {EventsManager, PlayerContribRegistry} from '@playkit-js-contrib/common';
import {PresetNames} from './preset-item-data';
import {KitchenSinkContainer} from './components/kitchen-sink-container/kitchen-sink-container';
import {KitchenSinkAdapter} from './components/kitchen-sink-adapter';
import {ManagedComponent} from './components/managed-component';

export interface KitchenSinkManagerOptions {
  corePlayer: KalturaPlayerTypes.Player;
  presetManager: PresetManager;
  upperBarManager: UpperBarManager;
}

export enum ItemActiveStates {
  Active = 'Active',
  InActive = 'InActive',
}

export enum EventTypes {
  ItemActiveStateChangeEvent = 'ItemActiveStateChangeEvent',
}

export interface ItemActiveStateChangeEvent {
  type: EventTypes.ItemActiveStateChangeEvent;
  state: ItemActiveStates;
  item: KitchenSinkItem;
}

export type KitchenSinkEvents = ItemActiveStateChangeEvent;

const ResourceToken = 'KitchenSinkManager-v1';

interface KitchenSinkPanel {
  ref: ManagedComponent | null;
  items: KitchenSinkItem[];
  activeItem: KitchenSinkItem | null;
}

export class KitchenSinkManager {
  static fromPlayer(
    playerContribRegistry: PlayerContribRegistry,
    creator: () => KitchenSinkManager
  ) {
    return playerContribRegistry.register(ResourceToken, 1, creator);
  }

  private _events: EventsManager<KitchenSinkEvents> = new EventsManager<
    KitchenSinkEvents
  >();

  private _panels: Record<KitchenSinkPositions, KitchenSinkPanel> = {
    [KitchenSinkPositions.Bottom]: {ref: null, items: [], activeItem: null},
    [KitchenSinkPositions.Right]: {ref: null, items: [], activeItem: null},
    [KitchenSinkPositions.Top]: {ref: null, items: [], activeItem: null},
    [KitchenSinkPositions.Left]: {ref: null, items: [], activeItem: null},
  };

  private _options: KitchenSinkManagerOptions;
  private _kitchenSinkAdapterRef: KitchenSinkAdapter | null = null;

  on: EventsManager<KitchenSinkEvents>['on'] = this._events.on.bind(
    this._events
  );
  off: EventsManager<KitchenSinkEvents>['off'] = this._events.off.bind(
    this._events
  );

  constructor(private options: KitchenSinkManagerOptions) {
    this._options = options;
    this.options.presetManager.add({
      label: 'kitchen-sink-right',
      fillContainer: true,
      presets: [PresetNames.Playback, PresetNames.Live],
      container: {name: 'SidePanel', position: 'Right'},
      renderChild: this._renderChild.bind(this, KitchenSinkPositions.Right),
    });

    this.options.presetManager.add({
      label: 'kitchen-sink-bottom',
      fillContainer: true,
      presets: [PresetNames.Playback, PresetNames.Live],
      container: {name: 'SidePanel', position: 'Bottom'},
      renderChild: this._renderChild.bind(this, KitchenSinkPositions.Bottom),
    });

    this.options.presetManager.add({
      label: 'kitchen-sink-adapter',
      shareAdvancedPlayerAPI: true,
      presets: [PresetNames.Playback, PresetNames.Live],
      container: {name: 'PlayerArea'},
      renderChild: () => <KitchenSinkAdapter ref={this._setRef} />,
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
      eventManager: this._events,
    };

    const relevantPanel = this._panels[data.position];
    const item = new KitchenSinkItem(itemOptions);
    relevantPanel.items.push(item);
    if (relevantPanel.ref) {
      relevantPanel.ref.update();
    }

    this.options.upperBarManager.add({
      label: data.label,
      renderItem: data.renderIcon,
      onClick: () => this._toggle(item),
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
    const {position, expandMode} = item.data;
    const relevantPanel = this._panels[position];

    // trying to activate an already active item
    if (relevantPanel.activeItem === item) return;
    // switch between items if currently there is an active one (without collapsing / expanding KS)
    if (relevantPanel.activeItem) {
      //trigger item de-activation event
      this._events.emit({
        type: EventTypes.ItemActiveStateChangeEvent,
        state: ItemActiveStates.InActive,
        item: relevantPanel.activeItem,
      });
    }
    //update new item as active
    relevantPanel.activeItem = item;
    //trigger new item activation event
    this._events.emit({
      type: EventTypes.ItemActiveStateChangeEvent,
      state: ItemActiveStates.Active,
      item: item,
    });
    //expand kitchenSink component (won't do anything if already expanded)
    this._expand(position, expandMode);
  };

  private _deactivateItem = (item: KitchenSinkItem): void => {
    const {position} = item.data;
    const relevantPanel = this._panels[position];

    //item is not active
    if (relevantPanel.activeItem !== item) return;
    //collapse kitchenSink component
    this._collapse(position);
    //trigger item de-activation event
    this._events.emit({
      type: EventTypes.ItemActiveStateChangeEvent,
      state: ItemActiveStates.InActive,
      item: relevantPanel.activeItem,
    });
    //remove item from _activeItems
    relevantPanel.activeItem = null;
  };

  private _isActive = (item: KitchenSinkItem): boolean => {
    return this._panels[item.data.position].activeItem === item;
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

  private _renderKitchenSink(position: KitchenSinkPositions) {
    const items = this._panels[position].items.map(item => {
      const itemProps: KitchenSinkItemRenderProps = {
        onClose: this._deactivateItem.bind(this, item),
      };
      return item.renderContentChild(itemProps);
    });
    return <KitchenSinkContainer>{items}</KitchenSinkContainer>;
  }

  private _renderChild = (position: KitchenSinkPositions): ComponentChild => {
    return (
      <ManagedComponent
        label={'kitchen-sink-manager'}
        renderChildren={() => this._renderKitchenSink(position)}
        isShown={() => true}
        ref={ref => (this._panels[position].ref = ref)}
      />
    );
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