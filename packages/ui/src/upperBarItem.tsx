import { h, render, Ref } from "preact";
import { log } from "@playkit-js/ovp-common";
import { UpperBarItemData } from "./upperBarItemData";

export interface UpperBarItemOptions {
    eventManager: any;
    kalturaPlayer: any;
    data: UpperBarItemData;
}

export interface UpperBarUIProps {}

export class UpperBarItem {
    private _options: UpperBarItemOptions;

    constructor(options: UpperBarItemOptions) {
        this._options = options;
        log("debug", `ovp-ui::UpperBarItem:ctor()`, "executed", { options });
    }
}
