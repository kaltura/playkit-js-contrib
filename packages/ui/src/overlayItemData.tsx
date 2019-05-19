import { ComponentChild, Ref } from "preact";

export enum OverlayUIModes {
    MediaLoaded = "MediaLoaded",
    OnDemand = "OnDemand",
    FirstPlay = "FirstPlay"
}

export interface OverlayItemData<TComponent> {
    name: string;
    mode: OverlayUIModes;
    renderer: (overlayItemProps: OverlayItemProps) => ComponentChild;
    className?: string;
}

export interface OverlayItemProps {
    currentTime: number;
    shouldHandleResize: boolean;
}
