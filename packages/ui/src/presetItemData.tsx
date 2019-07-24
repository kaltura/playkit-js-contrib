import { ComponentChild } from "preact";

export type PresetContainer =
    { name: 'bottomBar', position: 'left'}
    | { name: 'topBar', position: 'right'}
    | { name: 'sidePanel', position: 'right'}
    | { name: 'video', isModal: boolean}
    | string

export enum PresetNames {
    Playback = "playback",
    Live = "live"
}

export interface PresetItemData {
    label: string;
    fitToContainer?: boolean;
    presets: (PresetNames | string)[];
    container: PresetContainer;
    shareAdvancedPlayerAPI?: boolean;
    renderChild: () => ComponentChild;
}
