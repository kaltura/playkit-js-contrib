import { h, ComponentChild } from "preact";
import { log, PlayerAPI } from "@playkit-js-contrib/common";
import { UpperBarItemData } from "./upperBarItemData";

export interface UpperBarItemOptions {
    data: UpperBarItemData;
}

export interface UpperBarItemProps {}

export class UpperBarItem {
    private _options: UpperBarItemOptions;

    constructor(options: UpperBarItemOptions) {
        this._options = options;
        log("debug", `contrib-ui::UpperBarItem:ctor()`, "executed", { options });
    }

    public renderChild = (props: UpperBarItemProps): ComponentChild => {
        const { onClick, renderItem, label } = this._options.data;
        const children = renderItem(props);

        return (
            <div data-contrib-item={label} onClick={onClick} className={"icon--clickable"}>
                {children}
            </div>
        );
    };
}
