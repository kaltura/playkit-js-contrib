import { ComponentChild } from 'preact';

export interface KitchenSinkContentRendererProps {
    onClose: () => void;
}

export interface KitchenSinkItemData {
    label: string;
    renderIcon: () => ComponentChild;
    renderContent: (props: KitchenSinkContentRendererProps) => ComponentChild;
}
