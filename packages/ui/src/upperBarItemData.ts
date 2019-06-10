import { UpperBarItemProps } from "./upperBarItem";

export interface UpperBarItemData {
    renderer: (upperBarUIProps: UpperBarItemProps) => any;
    tooltip: string;
    onClick: () => void;
}
