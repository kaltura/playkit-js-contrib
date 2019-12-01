import {ComponentChild, h} from 'preact';
import {
  KitchenSinkExpandModes,
  KitchenSinkItemData,
  KitchenSinkPositions,
} from './kitchen-sink-item-data';
import {KitchenSinkItem, KitchenSinkItemRenderProps} from './kitchen-sink-item';
import {UpperBarManager} from './upper-bar-manager';
import {PresetManager} from './preset-manager';
import {
  ArrayUtils,
  EventsManager,
  ObjectUtils,
} from '@playkit-js-contrib/common';
import {KitchenSinkContainer} from './components/kitchen-sink-container/kitchen-sink-container';
import {KitchenSinkAdapter} from './components/kitchen-sink-adapter';
import {ManagedComponent} from './components/managed-component';
import {UpperBarItem} from './upper-bar-item';
import {PresetsUtils} from './presets-utils';
import {getContribConfig} from './contrib-utils';

export interface KitchenSinkManagerOptions {
  kalturaPlayer: KalturaPlayerTypes.Player;
  presetManager: PresetManager;
  upperBarManager: UpperBarManager;
}

const acceptableTypes = ['PlayerArea', 'SidePanelRight', 'SidePanelBottom'];

export enum ItemActiveStates {
  Active = 'Active',
  InActive = 'InActive',
}

export enum KitchenSinkEventTypes {
  ItemActiveStateChangeEvent = 'ItemActiveStateChangeEvent',
}

export interface ItemActiveStateChangeEvent {
  type: KitchenSinkEventTypes.ItemActiveStateChangeEvent;
  state: ItemActiveStates;
  item: KitchenSinkItem;
}

export type KitchenSinkEvents = ItemActiveStateChangeEvent;

interface KitchenSinkPanel {
  ref: ManagedComponent | null;
  items: {
    kitchenSinkItem: KitchenSinkItem;
    upperBarItem: UpperBarItem;
  }[];
  activeItem: KitchenSinkItem | null;
}

const defaultKitchenSinkConfig: KalturaPlayerContribTypes.KitchenSinkConfig = {
  theme: {
    backgroundColor: 'rgba(0, 0, 0, .7)',
    blur: '10px',
  },
  presetAreasMapping: {
    Playback: {
      PlayerArea: 'PlayerArea',
      SidePanelRight: 'SidePanelRight',
      SidePanelBottom: 'SidePanelBottom',
    },
    Live: {
      PlayerArea: 'PlayerArea',
      SidePanelRight: 'SidePanelRight',
      SidePanelBottom: 'SidePanelBottom',
    },
  },
};

export class KitchenSinkManager {
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
  private _kitchenSinkConfig: KalturaPlayerContribTypes.KitchenSinkConfig;

  on: EventsManager<KitchenSinkEvents>['on'] = this._events.on.bind(
    this._events
  );
  off: EventsManager<KitchenSinkEvents>['off'] = this._events.off.bind(
    this._events
  );

  constructor(private options: KitchenSinkManagerOptions) {
    this._options = options;

    this._kitchenSinkConfig = getContribConfig(
      this._options.kalturaPlayer,
      'ui.kitchenSink',
      defaultKitchenSinkConfig,
      {
        explicitMerge: ['presetAreasMapping'],
      }
    );

    const groupedPresets = PresetsUtils.groupPresetAreasByType({
      presetAreasMapping: this._kitchenSinkConfig.presetAreasMapping,
      acceptableTypes,
    });

    this.options.presetManager.add({
      label: 'kitchen-sink-right',
      fillContainer: true,
      presetAreas: groupedPresets['SidePanelRight'],
      renderChild: this._renderChild.bind(this, KitchenSinkPositions.Right),
    });

    this.options.presetManager.add({
      label: 'kitchen-sink-bottom',
      fillContainer: true,
      presetAreas: groupedPresets['SidePanelBottom'],
      renderChild: this._renderChild.bind(this, KitchenSinkPositions.Bottom),
    });

    this.options.presetManager.add({
      label: 'kitchen-sink-adapter',
      shareAdvancedPlayerAPI: true,
      presetAreas: groupedPresets['PlayerArea'],
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
      kitchenSinkConfig: this._kitchenSinkConfig,
    };

    const relevantPanel = this._panels[data.position];
    const kitchenSinkItem = new KitchenSinkItem(itemOptions);
    const upperBarItem = this.options.upperBarManager.add({
      label: data.label,
      renderItem: data.renderIcon,
      onClick: () => this._toggle(kitchenSinkItem),
    });
    relevantPanel.items.push({
      kitchenSinkItem,
      upperBarItem,
    });
    if (relevantPanel.ref) {
      relevantPanel.ref.update();
    }

    return kitchenSinkItem;
  }

  remove(item: KitchenSinkItem): void {
    const relevantPanel = this._panels[item.data.position];
    const itemsIndex = ArrayUtils.findIndex(
      relevantPanel.items,
      ({kitchenSinkItem}) => {
        return item === kitchenSinkItem;
      }
    );

    if (itemsIndex === -1) return;

    this._deactivateItem(item);
    const {upperBarItem} = relevantPanel.items[itemsIndex];
    item._destroy();
    this.options.upperBarManager.remove(upperBarItem);
    relevantPanel.items.splice(itemsIndex, 1);

    if (relevantPanel.ref) {
      relevantPanel.ref.update();
    }
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
        type: KitchenSinkEventTypes.ItemActiveStateChangeEvent,
        state: ItemActiveStates.InActive,
        item: relevantPanel.activeItem,
      });
    }
    //update new item as active
    relevantPanel.activeItem = item;
    //trigger new item activation event
    this._events.emit({
      type: KitchenSinkEventTypes.ItemActiveStateChangeEvent,
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
      type: KitchenSinkEventTypes.ItemActiveStateChangeEvent,
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
    const items = this._panels[position].items.map(({kitchenSinkItem}) => {
      const itemProps: KitchenSinkItemRenderProps = {
        onClose: this._deactivateItem.bind(this, kitchenSinkItem),
      };
      return kitchenSinkItem.renderContentChild(itemProps);
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
