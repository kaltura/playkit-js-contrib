import { ComponentChild, Ref } from "preact";
import { PlayerSize, VideoSize } from "./common.types";

export enum OverlayUIModes {
    MediaLoaded = "MediaLoaded",
    OnDemand = "OnDemand",
    FirstPlay = "FirstPlay"
}

export interface OverlayItemData {
    label: string;
    mode: OverlayUIModes;
    renderContent: (overlayItemProps: OverlayItemProps) => ComponentChild;
    className?: string;
}

export interface OverlayItemProps {
    currentTime: number;
    canvas: {
        playerSize: PlayerSize;
        videoSize: VideoSize;
    };
}
