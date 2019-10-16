import { UIManager } from "@playkit-js-contrib/ui";
import { EnvironmentManager } from "./environmentManager";
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

export interface ContribConfigSources {
    entryId: string;
    entryType: EntryTypes;
}

export interface ContribConfig {
    sources?: ContribConfigSources;
    server: {
        ks: string;
        partnerId: number;
        serviceUrl: string;
        userId?: string;
    };
}

export class CorePlugin extends KalturaPlayer.core.BasePlugin {
    static defaultConfig = {};
    static isValid(player: any) {
        return true;
    }

    protected _contribPlugin!: ContribPlugin;
    protected _contribServices!: EnvironmentManager;

    constructor(...args: any[]) {
        super(...args);
    }

    setContribContext(context: {
        contribPlugin: ContribPlugin;
        contribServices: EnvironmentManager;
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
