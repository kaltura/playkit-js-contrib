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
import {IconsMenu} from './components/icons-menu';

enum PlayeSize {
  Tiny = 'Tiny',
  Medium = 'Medium',
  Large = 'Large',
}

export interface UpperBarManagerOptions {
  kalturaPlayer: KalturaPlayerTypes.Player;
  presetManager: PresetManager;
}

interface IconsMenuConfig {
  iconsOrder: Record<string, number>;
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
  private _iconsMenuConfig: IconsMenuConfig;

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
    this._iconsMenuConfig = getContribConfig(
      this._options.kalturaPlayer,
      'ui.iconsMenu',
      {iconsOrder: {}}
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
    this._registerToPlayer();
  }

  private _checkPlayerSize = () => {
    // TODO: replace with property from redux srore of Player (VIP-1154)
    const {width} = this._options.kalturaPlayer.dimensions;
    const currentPlayerSize = this._playerSize;
    if (width <= 280) {
      this._playerSize = PlayeSize.Tiny;
    } else if (width <= 480) {
      this._playerSize = PlayeSize.Medium;
    } else {
      this._playerSize = PlayeSize.Large;
    }
    if (currentPlayerSize !== this._playerSize) {
      this._update();
    }
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

    const isIconMenuVisible = !!(upperBarItems.length && iconMenuItems.length);

    if (isIconMenuVisible) {
      const itemOptions = {
        kalturaPlayer: this._options.kalturaPlayer,
        data: {
          label: 'Icon-menu',
          onClick: () => {},
          renderItem: () => <IconsMenu content={iconMenuItems} />,
        },
      };
      const iconMenu = new UpperBarItem(itemOptions);
      upperBarItems.push(iconMenu);
    }

    const upperBarContent = upperBarItems.map(item => item.renderChild({}));

    return <UpperBar>{upperBarContent}</UpperBar>;
  };

  // TODO: replace with property from redux srore of Player (VIP-1154)
  private _registerToPlayer = () => {
    this._options.kalturaPlayer.addEventListener(
      this._options.kalturaPlayer.Event.RESIZE,
      this._checkPlayerSize
    );

    this._options.kalturaPlayer.addEventListener(
      this._options.kalturaPlayer.Event.LOADED_DATA,
      this._checkPlayerSize
    );
  };

  private _unregisterToPlayer = () => {
    this._options.kalturaPlayer.removeEventListener(
      this._options.kalturaPlayer.Event.RESIZE,
      this._checkPlayerSize
    );

    this._options.kalturaPlayer.removeEventListener(
      this._options.kalturaPlayer.Event.LOADED_DATA,
      this._checkPlayerSize
    );
  };

  /**
   * initialize new upper bar item
   * @param item
   */
  add(data: UpperBarItemData): UpperBarItem {
    // TODO: for now list of icons order loads from embeded config, ex:
    // contrib: {
    //   ui: {
    //       fonts: { ... },
    //       iconsMenu: {
    //           iconsOrder: {
    //               'Report Video': 41,
    //               Info: 50,
    //               'Q&A': 60,
    //           }
    //       }
    //     }
    // };
    const itemOptions = {
      kalturaPlayer: this._options.kalturaPlayer,
      data,
      order: ObjectUtils.get(
        this._iconsMenuConfig,
        `iconsOrder.${data.label}`,
        0
      ),
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
  reset(): void {
    this._unregisterToPlayer();
    this._items.forEach((item: UpperBarItem) => {
      this.remove(item);
    });
  }
}
