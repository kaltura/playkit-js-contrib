import { h, ComponentChild } from "preact";
import { log } from "@playkit-js/ovp-common";
import { KitchenSinkItemData } from "./kitchenSinkItemData";
import { UpperBarItemProps } from "./upperBarItem";

export interface KitchenSinkItemOptions {
    data: KitchenSinkItemData;
}

export interface KitchenSinkItemRenderProps {
    onClose: () => void;
}

export class KitchenSinkItem {
    private _options: KitchenSinkItemOptions;

    constructor(options: KitchenSinkItemOptions) {
        this._options = options;
        log("debug", `ovp-ui::KitchenSinkItem:ctor()`, "executed", { options });
    }

    get displayName() {
        return this._options.data.name;
    }

    public render = (props: KitchenSinkItemRenderProps): ComponentChild => {
        const { contentRenderer } = this._options.data;
        return contentRenderer(props);
    };
}
