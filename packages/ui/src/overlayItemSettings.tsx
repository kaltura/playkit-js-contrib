import { Ref } from "preact";

export enum OverlayUIModes {
    MediaLoaded = "MediaLoaded",
    OnDemand = "OnDemand",
    FirstPlay = "FirstPlay"
}

export interface OverlayItemSettings<TComponent> {
    name: string;
    mode: OverlayUIModes;
    renderer: (setRef: Ref<TComponent>, overlayItemProps: OverlayItemProps) => any;
    className?: string;
}

export interface OverlayItemProps {
    currentTime: number;
    shouldHandleResize: boolean;
}
