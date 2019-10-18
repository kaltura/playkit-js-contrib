import { ContribServices } from "./contrib-services";
import {
    ContribPlugin,
    hasOnMediaLoad,
    hasOnMediaUnload,
    hasOnPluginDestroy,
    hasOnPluginSetup,
    hasOnRegisterUI
} from "./contrib-plugin";

export enum EntryTypes {
    Vod = "Vod",
    Live = "Live"
}

export interface ContribConfig {
    sources?: {
        entryId: string;
        entryType: EntryTypes;
    };
    server: {
        ks: string;
        partnerId: number;
        serviceUrl: string;
        userId?: string;
    };
}

export class CorePlugin<TContribPlugin extends ContribPlugin = ContribPlugin> extends KalturaPlayer
    .core.BasePlugin {
    static defaultConfig = {};
    static isValid(player: any) {
        return true;
    }

    protected _contribPlugin!: TContribPlugin;
    protected _contribServices!: ContribServices;

    constructor(...args: any[]) {
        super(...args);
    }

    setContribContext(context: {
        contribPlugin: TContribPlugin;
        contribServices: ContribServices;
    }) {
        this._contribPlugin = context.contribPlugin;
        this._contribServices = context.contribServices;
    }

    private _wasSetupExecuted = false;
    private _wasSetupFailed = false;

    getUIComponents(): any[] {
        if (hasOnRegisterUI(this._contribPlugin)) {
            try {
                this._contribPlugin.onRegisterUI(this._contribServices.uiManager);
            } catch (e) {
                console.error(`failed to register contrib ui items for plugin`, {
                    error: e.message
                });
            }
        }

        return this._contribServices.presetManager.registerComponents();
    }

    loadMedia(): void {
        this.eventManager.listenOnce(this.player, this.player.Event.MEDIA_LOADED, () => {
            if (!this._wasSetupExecuted) {
                if (hasOnPluginSetup(this._contribPlugin)) {
                    try {
                        const config = this._contribServices.getContribConfig();
                        this._contribPlugin.onPluginSetup(config);
                    } catch (e) {
                        this._wasSetupFailed = true;
                        console.error(`failed to execute plugin setup, suspend plugin`, {
                            error: e.message
                        });
                    }
                }
                this._wasSetupExecuted = true;
            }

            if (this._wasSetupFailed) {
                return;
            }

            if (hasOnMediaLoad(this._contribPlugin)) {
                try {
                    const sources = this._contribServices.getContribConfig().sources;

                    this._contribPlugin.onMediaLoad({ sources });
                } catch (e) {
                    console.error(`failure during media load `, { error: e.message });
                }
            }
        });
    }

    public destroy() {
        this.reset();
        this.eventManager.destroy();

        if (hasOnPluginDestroy(this._contribPlugin)) {
            try {
                this._contribPlugin.onPluginDestroy();
            } catch (e) {
                console.error(`failure during plugin destroy`, { error: e.message });
            }
        }
    }

    public reset() {
        this._contribServices.uiManager.reset();
        if (hasOnMediaUnload(this._contribPlugin)) {
            try {
                this._contribPlugin.onMediaUnload();
            } catch (e) {
                console.error(`failure during media unload`, { error: e.message });
            }
        }
    }
}
