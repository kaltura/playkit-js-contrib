import { ComponentChild, Ref } from "preact";
import { PlayerSize, VideoSize } from "./common.types";

export enum OverlayUIModes {
    MediaLoaded = "MediaLoaded",
    OnDemand = "OnDemand",
    FirstPlay = "FirstPlay"
}

export interface OverlayItemData {
    name: string;
    mode: OverlayUIModes;
    renderer: (overlayItemProps: OverlayItemProps) => ComponentChild;
    className?: string;
}

export interface OverlayItemProps {
    currentTime: number;
    canvas: {
        playerSize: PlayerSize;
        videoSize: VideoSize;
    };
}
