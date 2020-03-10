// @ts-nocheck
const {h,Component} = KalturaPlayer.ui.preact;
import {UpperBarItem} from './upper-bar-item';
import {UpperBarItemData} from './upper-bar-item-data';
import {UpperBar} from './components/upper-bar';
import {PresetManager} from './preset-manager';
import {ArrayUtils, ObjectUtils} from '@playkit-js-contrib/common';
import {ManagedComponent} from './components/managed-component';
import {PresetsUtils} from './presets-utils';
import UpperBarConfig = KalturaPlayerContribTypes.UpperBarConfig;
import {getContribConfig} from './contrib-utils';

export interface UpperBarManagerOptions {
  kalturaPlayer: KalturaPlayerTypes.Player;
  presetManager: PresetManager;
}

const defaultUpperBarConfig: UpperBarConfig = {
  presetAreasMapping: {
    Playback: {
      TopBarRightControls: 'TopBarRightControls',
    },
    Live: {
      TopBarRightControls: 'TopBarRightControls',
    },
  },
};

const acceptableTypes = ['TopBarRightControls'];

export class UpperBarManager {
  private _rootElement: ManagedComponent | null;
  private _items: UpperBarItem[] = [];
  private _options: UpperBarManagerOptions;
  private _upperBarConfig: UpperBarConfig;

  constructor(options: UpperBarManagerOptions) {
    this._options = options;

    this._upperBarConfig = getContribConfig(
      this._options.kalturaPlayer,
      'ui.upperBar',
      defaultUpperBarConfig,
      {
        explicitMerge: ['presetAreasMapping'],
      }
    );

    const groupedPresets = PresetsUtils.groupPresetAreasByType({
      presetAreasMapping: this._upperBarConfig.presetAreasMapping,
      acceptableTypes,
    });

    this._options.presetManager.add({
      label: 'upper-bar-manager',
      presetAreas: groupedPresets['TopBarRightControls'],
      renderChild: this._renderChild,
    });
  }

  // @ts-ignore:
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
      kalturaPlayer: this._options.kalturaPlayer,
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
