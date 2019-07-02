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

export interface PresetItemData<TProps extends Record<string, any>> {
    label: string;
    fitToContainer?: boolean;
    presets: PresetNames[];
    container: PresetContainer;
    renderer: (props: any) => ComponentChild;
    initialProps: TProps;
}
