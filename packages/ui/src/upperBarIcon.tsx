import { h, render, Ref } from "preact";
import { log } from "@playkit-js/ovp-common";
import { UpperBarManager } from "./upperBarManager";

export interface UpperBarItemOptions {
    renderer: (setRef: any, upperBarUIProps: UpperBarUIProps) => any;
    tooltip: string;
}

export interface UpperBarUIProps {}

export interface Icon {}

export class UpperBarIcon {
    private _root: any;
    private _player: any;
    private _rootParent: any;
    private _iconRef: Icon | null = null;
    private _plugin: any;
    private _destroyed = false;
    private _options: UpperBarItemOptions;

    constructor(options: UpperBarItemOptions) {
        this._options = options;
        log("debug", `ovp-ui::upperBarUI:ctor()`, "executed", { options });
    }
}
