import { h, render } from "preact";
import { enableLog } from "./logger";
import { UIManager } from "./uiManager";

// TODO try to remove the 'as any'
// @ts-ignore
export abstract class OVPBasePlugin extends (KalturaPlayer as any).core.BasePlugin {
    static defaultConfig = {};

    static isValid(player: any) {
        return true;
    }

    private _uiManager: UIManager;

    constructor(name: any, player: any, config: any) {
        super(name, player, config);

        // TODO hook log to player log flags
        enableLog(name);

        this._uiManager = new UIManager();
        debugger;
    }

    loadMedia(): void {
        this._onAddBindings(this.eventManager);
        this._onAddOverlays(this._uiManager);

        this.eventManager.listenOnce(this.player, this.player.Event.MEDIA_LOADED, () => {
            this._onMediaLoaded();
        });
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

    protected _onMediaLoaded() {}

    protected abstract _onAddOverlays(uiManager: UIManager): void;
    protected abstract _onAddBindings(eventManager: any): void;
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
