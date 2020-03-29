import {ComponentChild, h} from 'preact';
import {UpperBarItem} from './upper-bar-item';
import {UpperBarItemData} from './upper-bar-item-data';
import {UpperBar} from './components/upper-bar';
import {PresetManager} from './preset-manager';
import {ArrayUtils, ObjectUtils} from '@playkit-js-contrib/common';
import {ManagedComponent} from './components/managed-component';
import {PresetsUtils} from './presets-utils';
import UpperBarConfig = KalturaPlayerContribTypes.UpperBarConfig;
import {getContribConfig} from './contrib-utils';
import {IconMenu} from './components/icon-menu';

enum PlayeSize {
  Tiny = 'tiny',
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

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
  private _playerSize: PlayeSize = PlayeSize.Large;

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

    this._options.kalturaPlayer.addEventListener(
      'resize',
      this._checkPlayerSize
    );
    // TODO: remove event listener

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

  private _checkPlayerSize = () => {
    console.log('check size', this._playerSize, this._options.kalturaPlayer);
  };

  private _renderChild = (): ComponentChild => {
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
    const {upperBarItems, iconMenuItems} = this._prepareUpperBarItems();

    const itemOptions = {
      kalturaPlayer: this._options.kalturaPlayer,
      data: {
        label: 'Icon-menu',
        onClick: () => console.log('click'),
        renderItem: () => <IconMenu content={iconMenuItems} />,
      },
    };
    const iconMenu = new UpperBarItem(itemOptions);
    const upperBarContent = [...upperBarItems, iconMenu].map(item =>
      item.renderChild({})
    );

    return <UpperBar>{upperBarContent}</UpperBar>;
  };

  /**
   * initialize new upper bar item
   * @param item
   */
  add(data: UpperBarItemData): UpperBarItem {
    const orderList = {
      Info: 20,
      Info2: 30,
      Info3: 40,
      Info4: 50,
      Info5: 60,
      Info6: 1,
      Info7: 100,
      Info8: 84,
    };
    const itemOptions = {
      kalturaPlayer: this._options.kalturaPlayer,
      data,
      order: orderList[data.label],
    };
    const item = new UpperBarItem(itemOptions);
    this._items.push(item);
    this._items = ArrayUtils.sortByKey(this._items, '_options.order').reverse();

    this._update();
    return item;
  }

  remove(itemToRemove: UpperBarItem): void {
    const itemIndex = ArrayUtils.findIndex(this._items, item => {
      return item === itemToRemove;
    });
    if (itemIndex === -1) return;

    this._items.splice(itemIndex, 1);
    this._update();
  }

  _update() {
    if (this._rootElement) {
      this._rootElement.update();
    }
  }

  _prepareUpperBarItems(): {
    upperBarItems: UpperBarItem[];
    iconMenuItems: UpperBarItem[];
  } {
    const iconMenuItems = [...this._items];
    let upperBarItems = [];
    switch (this._playerSize) {
      case PlayeSize.Large:
        upperBarItems = iconMenuItems.splice(0, 4);
        break;
      case PlayeSize.Medium:
        upperBarItems = iconMenuItems.splice(0, 2);
        break;
      default:
        upperBarItems = [];
    }
    return {
      upperBarItems,
      iconMenuItems,
    };
  }

  /**
   * remove all ui manager items
   */
  reset(): void {}
}
