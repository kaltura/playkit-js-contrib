import { h, render } from "preact";

import { PlayerCompat } from "./playerCompat";

export interface PluginUI {}

// TODO try to remove the 'as any'
// @ts-ignore
export abstract class OVPBasePlugin extends (KalturaPlayer as any).core.BasePlugin {
    static defaultConfig = {};

    protected playerCompat = new PlayerCompat(this.player);
    //private _uiManager: UIManager;

    static isValid(player: any) {
        return true;
    }

    constructor(name: any, player: any, config: any) {
        super(name, player, config);

        this._addBindings();
        this.setup();
    }

    protected abstract setup(): void;

    addUI(pluginUI: PluginUI) {
        // TODO
    }

    public destroy() {
        // TODO unlisten to events on destroy
    }

    public reset() {
        // TODO cancel load request
    }

    protected _sendAnalytics() {
        // TBD
        throw new Error("tbd");
    }

    protected _addBindings() {}

    getServiceUrl(): string {
        return this.player.config.provider.env.serviceUrl;
    }
}
