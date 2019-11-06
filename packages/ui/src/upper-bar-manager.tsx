import {ComponentChild, h, render} from 'preact';
import {UpperBarItem} from './upper-bar-item';
import {UpperBarItemData} from './upper-bar-item-data';
import {UpperBar} from './components/upper-bar';
import {PresetManager} from './preset-manager';
import {PresetNames} from './preset-item-data';
import {ArrayUtils, PlayerContribRegistry} from '@playkit-js-contrib/common';
import {PresetItem} from './preset-item';
import {ManagedComponent} from './components/managed-component';

export interface UpperBarManagerOptions {
  corePlayer: KalturaPlayerTypes.Player;
  presetManager: PresetManager;
}

const ResourceToken = 'UpperBarManager-v1';

export class UpperBarManager {
  static fromPlayer(
    playerContribRegistry: PlayerContribRegistry,
    creator: () => UpperBarManager
  ) {
    return playerContribRegistry.register(ResourceToken, 1, creator);
  }

  private _rootElement: ManagedComponent | null;
  private _items: UpperBarItem[] = [];
  private _options: UpperBarManagerOptions;

  constructor(options: UpperBarManagerOptions) {
    this._options = options;
    this._options.presetManager.add({
      label: 'upper-bar-manager',
      presets: [PresetNames.Playback, PresetNames.Live],
      container: {name: 'TopBar', position: 'Right'},
      renderChild: this._renderChild,
    });
  }

  private _renderChild = (): ComponentChild => {
    const items = this._items.map(item => item.renderChild({}));
    return (
      <ManagedComponent
        label={'upper-bar-manager'}
        renderChildren={() => this._renderItems()}
        isShown={() => true}
        ref={ref => (this._rootElement = ref)}
      />
    );
  };

  private _renderItems = () => {
    const items = this._items.map(item => item.renderChild({}));
    return <UpperBar>{items}</UpperBar>;
  };

  /**
   * initialize new upper bar item
   * @param item
   */
  add(data: UpperBarItemData): UpperBarItem {
    const itemOptions = {
      corePlayer: this._options.corePlayer,
      data,
    };
    const item = new UpperBarItem(itemOptions);
    this._items.push(item);
    if (this._rootElement) {
      this._rootElement.update();
    }
    return item;
  }

  remove(itemToRemove: UpperBarItem): void {
    const itemIndex = ArrayUtils.findIndex(this._items, item => {
      return item === itemToRemove;
    });
    if (itemIndex === -1) return;

    this._items.splice(itemIndex, 1);
    if (this._rootElement) {
      this._rootElement.update();
    }
  }

  /**
   * remove all ui manager items
   */
  reset(): void {}
}
