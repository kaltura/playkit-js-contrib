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

    public render = (props: UpperBarItemProps): ComponentChild => {
        const { onClick, renderer, tooltip } = this._options.data;
        const children = renderer(props);

        return (
            <div onClick={onClick} title={tooltip} className={"icon--clickable"}>
                {children}
            </div>
        );
    };
}
