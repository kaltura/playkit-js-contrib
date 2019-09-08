import { ComponentChild } from "preact";

export type VerticalPositions = "Top" | "Bottom";
export type HorizontalPositions = "Left" | "Right";

export type PredefinedContainers =
    | { name: "PresetOverlay" }
    | { name: "BottomBar"; position: HorizontalPositions }
    | { name: "TopBar"; position: HorizontalPositions }
    | { name: "SidePanel"; position: HorizontalPositions | VerticalPositions }
    | { name: "VideoOverlay" }
    | { name: "PresetMiddleArea" }
    | { name: "PlayerOverlay" }
    | { name: "visibleArea"; isModal: boolean }
    | string;

export enum PresetNames {
    Playback = "Playback",
    Live = "Live"
}

export enum RelativeToTypes {
    Before = "Before",
    After = "After",
    Replace = "Replace"
}

export interface PresetItemData {
    label: string;
    fillContainer?: boolean;
    presets: (PresetNames | string)[];
    container: PredefinedContainers;
    shareAdvancedPlayerAPI?: boolean;
    renderChild: () => ComponentChild;
    relativeTo?: {
        type: RelativeToTypes;
        name: string;
    };
}
