import { h, render, Ref } from "preact";
import { log } from "@playkit-js/ovp-common";
import { KitchenSinkItemData } from "./kitchenSinkItemData";

export interface KitchenSinkItemOptions {
    eventManager: any;
    kalturaPlayer: any;
    data: KitchenSinkItemData;
}

export interface KitchenSinkUIProps {}

export class KitchenSinkItem {
    private _options: KitchenSinkItemOptions;

    constructor(options: KitchenSinkItemOptions) {
        this._options = options;
        log("debug", `ovp-ui::KitchenSinkItem:ctor()`, "executed", { options });
    }
}
