import { UpperBarUIProps } from "./upperBarItem";

export interface UpperBarItemData {
    renderer: (setRef: any, upperBarUIProps: UpperBarUIProps) => any;
    tooltip: string;
}
