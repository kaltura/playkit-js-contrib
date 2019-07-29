import { ComponentChild } from "preact";

export interface KitchenSinkContentRendererProps {
    onClose: () => void;
}

export enum KitchenSinkExpandModes {
    AlongSideTheVideo,
    OverTheVideo
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
    renderContent: (props: KitchenSinkContentRendererProps) => ComponentChild;
}
