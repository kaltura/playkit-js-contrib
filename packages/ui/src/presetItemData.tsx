import { ComponentChild } from "preact";

export type PredefinedContainers =
    | { name: "overlay" }
    | { name: "bottomBar"; position: "left" }
    | { name: "topBar"; position: "right" }
    | { name: "sidePanel"; position: "right" | "bottom" }
    | { name: "video"; isModal: boolean }
    | string;

export enum PresetNames {
    Playback = "playback",
    Live = "live"
}

export interface PresetItemData {
    label: string;
    fitToContainer?: boolean;
    presets: (PresetNames | string)[];
    container: PredefinedContainers;
    shareAdvancedPlayerAPI?: boolean;
    renderChild: () => ComponentChild;
}
