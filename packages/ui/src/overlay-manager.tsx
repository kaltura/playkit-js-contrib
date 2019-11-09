import {ComponentChild, h} from 'preact';
import {OverlayItem} from './overlay-item';
import {OverlayItemData, OverlayPositions} from './overlay-item-data';
import {PresetManager} from './preset-manager';
import {PresetNames} from './preset-item-data';
import {ManagedComponent} from './components/managed-component';
import {OverlayItemContainer} from './components/overlay-item-container';

export interface OverlayManagerOptions {
  presetManager: PresetManager;
}

export class OverlayManager {
  private _items: Record<OverlayPositions, OverlayItem[]> = {
    [OverlayPositions.PlayerArea]: [],
  };

  private _componentRef: Record<OverlayPositions, ManagedComponent | null> = {
    [OverlayPositions.PlayerArea]: null,
  };

  private _options: OverlayManagerOptions;

  constructor(private options: OverlayManagerOptions) {
    this._options = options;
    this.options.presetManager.add({
      label: 'overlay-manager',
      fillContainer: true,
      presets: [PresetNames.Playback, PresetNames.Live],
      container: {name: 'PlayerArea'},
      renderChild: () => this._renderChild(OverlayPositions.PlayerArea),
    });
  }

  /**
   * initialize new overlay ui item
   * @param item
   */
  add(data: OverlayItemData): OverlayItem | null {
    const {presetManager} = this._options;

    const itemOptions = {
      presetManager,
      ...this.options,
      data,
    };

    const item = new OverlayItem(itemOptions);
    this._items[data.position].unshift(item);
    this._updateComponents(data.position);
    return item;
  }

  remove(item: OverlayItem) {
    const positionItems = this._items[item.data.position];
    const itemIndex = positionItems.indexOf(item);
    if (itemIndex > -1) {
      positionItems[itemIndex].destroy();
      positionItems.splice(itemIndex, 1);

      if (itemIndex === 0) {
        this._updateComponents(item.data.position);
      }
    } else {
      console.warn(`couldn't remove ${item} since it wasn't found`);
    }
  }

  reset(): void {
    // TODO sakal missing
  }
  /**
   * destroy all ui manager items
   */
  destroy(): void {
    // TODO sakal sohuld call on destroy
    const allItems = [...this._items.PlayerArea];
    allItems.forEach(item => {
      try {
        item.destroy();
      } catch (e) {
        // TODO log error
        console.warn(e);
      }
    });

    this._items.PlayerArea = [];
  }

  private _renderItems = (position: OverlayPositions) => {
    const items = this._items[position];

    if (items.length === 0) {
      return null;
    }

    return (
      <OverlayItemContainer
        renderContent={() => this._items[position][0].renderOverlayChild({})}
      />
    );
  };

  private _renderChild = (position: OverlayPositions): ComponentChild => {
    return (
      <ManagedComponent
        label={'overlay-manager'}
        renderChildren={() => this._renderItems(position)}
        isShown={() => true}
        ref={ref => (this._componentRef[position] = ref)}
      />
    );
  };

  private _updateComponents(position?: OverlayPositions) {
    if (
      this._componentRef.PlayerArea &&
      (!position || position === OverlayPositions.PlayerArea)
    ) {
      this._componentRef.PlayerArea.update();
    }
  }
}
