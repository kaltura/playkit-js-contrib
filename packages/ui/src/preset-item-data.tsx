import {ComponentChild} from 'preact';

export enum ReservedPresetNames {
  Playback = 'Playback',
  Live = 'Live',
}

export enum ReservedPresetAreas {
  'PresetFloating' = 'PresetFloating',
  'BottomBarLeftControls' = 'BottomBarLeftControls',
  'BottomBarRightControls' = 'BottomBarRightControls',
  'TopBarLeftControls' = 'TopBarLeftControls',
  'TopBarRightControls' = 'TopBarRightControls',
  'SidePanelTop' = 'SidePanelTop',
  'SidePanelLeft' = 'SidePanelLeft',
  'SidePanelRight' = 'SidePanelRight',
  'SidePanelBottom' = 'SidePanelBottom',
  'PresetArea' = 'PresetArea',
  'InteractiveArea' = 'InteractiveArea',
  'PlayerArea' = 'PlayerArea',
  'VideoArea' = 'VideoArea',
}

export enum RelativeToTypes {
  Before = 'Before',
  After = 'After',
  Replace = 'Replace',
}

export interface PresetItemData {
  label: string;
  isolatedMode?: boolean;
  // this property replaces ShareAdvancedPlayerAPI and flips its default value
  // TODO: figure out default behaviour of isolatedMode === false
  isolatedOptions?: {
    fillContainer?: boolean;
    className?: string;
  };
  presetAreas: Record<
    ReservedPresetNames | string,
    ReservedPresetAreas | string
  >;
  renderChild: () => ComponentChild;
  relativeTo?: {
    type: RelativeToTypes;
    name: string;
  };
}
