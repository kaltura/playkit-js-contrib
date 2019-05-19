import { ComponentChild } from "preact";

export enum PresetAreas {
    videoOverlay = "videoOverlay",
    sidePanel = "sidePanel",
    topBarRightControls = "topBarRightControls"
}

export enum PlayerPresets {
    playback = "playback",
    live = "live"
}

export interface PresetItemData<TProps extends Record<string, any>> {
    label: string;
    fitToContainer?: boolean;
    preset: PlayerPresets;
    area: PresetAreas;
    renderer: (props: any) => ComponentChild;
    initialProps: TProps;
}
