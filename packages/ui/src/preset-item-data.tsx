import {ComponentChild} from 'preact';

export enum PresetNames {
  Playback = 'Playback',
  Live = 'Live',
}

export enum ReservedPresetAreas {
  'PresetFloating',
  'BottomBarLeftControls',
  'BottomBarRightControls',
  'TopBarLeftControls',
  'TopBarRightControls',
  'SidePanelTop',
  'SidePanelLeft',
  'SidePanelRight',
  'SidePanelBottom',
  'PresetArea',
  'InteractiveArea',
  'PlayerArea',
  'VideoArea',
}

export enum RelativeToTypes {
  Before = 'Before',
  After = 'After',
  Replace = 'Replace',
}

export interface PresetItemData {
  label: string;
  fillContainer?: boolean;
  presetAreas: Record<string, string>;
  shareAdvancedPlayerAPI?: boolean;
  renderChild: () => ComponentChild;
  relativeTo?: {
    type: RelativeToTypes;
    name: string;
  };
}
