export interface KitchenSinkContentRendererProps {
    onClose: () => void;
}

export interface KitchenSinkItemData {
    name: string;
    iconRenderer: () => JSX.Element;
    contentRenderer: (props: KitchenSinkContentRendererProps) => JSX.Element;
}
