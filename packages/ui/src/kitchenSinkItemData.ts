import { ComponentChild } from "preact";

export interface KitchenSinkContentRendererProps {
    onClose: () => void;
}

export enum KitchenSinkExpandModes {
    AlongSideTheVideo = "ALONG_SIDE_THE_VIDEO",
    Hidden = "HIDDEN",
    OverTheVideo = "OVER_THE_VIDEO"
}

export enum KitchenSinkPositions {
    Top = "top",
    Left = "left",
    Right = "right",
    Bottom = "bottom"
}

export interface KitchenSinkItemData {
    label: string;
    renderIcon: () => ComponentChild;
    expandMode: KitchenSinkExpandModes;
    position: KitchenSinkPositions;
    fitToContainer?: boolean;
    renderContent: (props: KitchenSinkContentRendererProps) => ComponentChild;
}
