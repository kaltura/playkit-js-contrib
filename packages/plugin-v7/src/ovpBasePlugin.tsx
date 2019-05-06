import { h, render } from "preact";

import { PlayerCompat } from "./playerCompat";
import { UIManager } from "./uiManager";

// TODO try to remove the 'as any'
// @ts-ignore
export abstract class OVPBasePlugin extends (KalturaPlayer as any).core.BasePlugin {
    static defaultConfig = {};
    private _uiManager: UIManager;
    //protected playerCompat = new PlayerCompat(this.player);

    static isValid(player: any) {
        return true;
    }

    constructor(name: any, player: any, config: any) {
        super(name, player, config);
        this._uiManager = new UIManager({ plugin: this });
    }

    loadMedia(): void {
        this._onAddOverlays(this._uiManager);
        this._onAddBindings(this.eventManager);
    }

    public getUIManager(): UIManager {
        return this._uiManager;
    }

    public destroy() {
        this.eventManager.removeAll();
        this.eventManager.destroy();
        this._onResetState();
    }

    public reset() {
        this.eventManager.removeAll();
        this._uiManager.reset();
        this._onInitMembers();
    }

    protected _sendAnalytics() {
        // TBD
        throw new Error("tbd");
    }

    protected abstract _onAddBindings(eventManager: any): void;
    protected abstract _onAddOverlays(uiManager: UIManager): void;
    protected abstract _onInitMembers(): void;

    getServiceUrl(): string {
        return this.player.config.provider.env.serviceUrl;
    }

    getEntryId(): string {
        return this.player.config.sources.id;
    }

    getPartnerId(): number {
        return this.player.config.session.partnerId;
    }

    getKS(): string {
        return this.player.config.session.ks;
    }
}
