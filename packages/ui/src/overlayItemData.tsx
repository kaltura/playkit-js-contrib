import { ComponentChild, Ref } from "preact";
import { PlayerSize, VideoSize } from "./common.types";

export enum OverlayUIModes {
    MediaLoaded = "MediaLoaded",
    OnDemand = "OnDemand",
    Immediate = "Immediate",
    FirstPlay = "FirstPlay"
}

// TODO sakal VisibleArea to InteractiveArea
export enum OverlayPositions {
    VideoArea = "VideoArea",
    PresetArea = "PresetArea",
    InteractiveArea = "InteractiveArea"
}

export interface OverlayItemData {
    label: string;
    mode: OverlayUIModes;
    renderContent: (overlayItemProps: OverlayItemProps) => ComponentChild;
    className?: string;
    position: OverlayPositions;
}

export interface OverlayItemProps {
    currentTime: number;
    canvas: {
        playerSize: PlayerSize;
        videoSize: VideoSize;
    };
}
