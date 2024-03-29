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

const DefaultPluginOrder: {[pluginName: string]: number} = {
  Navigation: 10,
  'Q&A': 20,
  Moderation: 30,
  Transcript: 40,
  'Download transcript': 50,
  Share: 70,
  Playlist: 80,
  Info: 90,
  Related: 100,
  Quiz: 110,
  Layout: 120,
  'Source Selector': 140,
  Polls: 150,
};

const {
  components: {PLAYER_SIZE},
} = KalturaPlayer.ui;

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
  }

  private _renderChild = (): ComponentChild => {
    return (
      <ManagedComponent
        label={'upper-bar-manager'}
        renderChildren={playerSize => this._renderItems(playerSize)}
        isShown={() => true}
        updateOnPlayerSizeChanged
        ref={ref => (this._rootElement = ref)}
      />
    );
  };

  private _renderItems = (playerSize: string) => {
    const {upperBarItems, iconMenuItems} = this._prepareUpperBarItems(
      playerSize
    );

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
        DefaultPluginOrder[data.label] || Infinity
      ),
    };
    const item = new UpperBarItem(itemOptions);
    this._items.push(item);
    this._items = ArrayUtils.sortByKey(this._items, '_options.order').reverse();
    this.update();
    return item;
  }

  remove(itemToRemove: UpperBarItem): void {
    const itemIndex = ArrayUtils.findIndex(this._items, item => {
      return item === itemToRemove;
    });
    if (itemIndex === -1) return;

    this._items.splice(itemIndex, 1);
    this.update();
  }

  update() {
    if (this._rootElement) {
      this._rootElement.update();
    }
  }

  _prepareUpperBarItems(
    playerSize: string
  ): {
    upperBarItems: UpperBarItem[];
    iconMenuItems: UpperBarItem[];
  } {
    const iconMenuItems = [...this._items];
    let upperBarItems = [];
    switch (playerSize) {
      case PLAYER_SIZE.TINY:
        upperBarItems = [];
        break;
      case PLAYER_SIZE.EXTRA_SMALL:
      case PLAYER_SIZE.SMALL:
        upperBarItems = iconMenuItems.splice(0, 2);
        break;
      default:
        upperBarItems = iconMenuItems.splice(0, 4);
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
    this._items.forEach((item: UpperBarItem) => {
      this.remove(item);
    });
  }
}
