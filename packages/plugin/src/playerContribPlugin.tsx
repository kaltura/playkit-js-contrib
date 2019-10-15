import { h } from "preact";
import { UIManager } from "@playkit-js-contrib/ui";
import { EnvironmentManager } from "./environmentManager";

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

export interface OnRegisterUI {
    onRegisterUI(uiManager: UIManager): void;
}

function hasOnRegisterUI(plugin: any): plugin is OnRegisterUI {
    return "onRegisterUI" in plugin;
}

export interface OnPluginSetup {
    onPluginSetup(config: ContribConfig): void;
}

function hasOnPluginSetup(plugin: any): plugin is OnPluginSetup {
    return "onPluginSetup" in plugin;
}

export interface OnPluginDestroy {
    OnPluginDestroy(): void;
}

function hasOnPluginDestory(plugin: any): plugin is OnPluginDestroy {
    return "OnPluginDestroy" in plugin;
}

export type OnMediaLoadConfig = { sources: ContribConfigSources };

export interface OnMediaLoad {
    onMediaLoad(config: OnMediaLoadConfig): void;
}

function hasOnMediaLoad(plugin: any): plugin is OnMediaLoad {
    return "onMediaLoad" in plugin;
}

export interface OnMediaUnload {
    onMediaUnload(): void;
}

function hasOnMediaUnload(plugin: any): plugin is OnMediaUnload {
    return "onMediaUnload" in plugin;
}

// TODO try to remove the 'as any'
// @ts-ignore
export abstract class PlayerContribPlugin extends (KalturaPlayer as any).core.BasePlugin {
    static defaultConfig = {};
    static isValid(player: any) {
        return true;
    }

    private _wasSetupExecuted = false;
    private _wasSetupFailed = false;
    private _environment: EnvironmentManager = EnvironmentManager.get({
        kalturaPlayer: this.player
    });

    getUIComponents(): any[] {
        if (hasOnRegisterUI(this)) {
            try {
                this.onRegisterUI(this._environment.uiManager);
            } catch (e) {
                console.error(`failed to register contrib ui items for plugin`, {
                    error: e.message
                });
            }
        }

        return this._environment.presetManager.registerComponents();
    }

    get environment(): EnvironmentManager {
        return this._environment;
    }

    get uiManager(): UIManager {
        return this._environment.uiManager;
    }

    loadMedia(): void {
        this.eventManager.listenOnce(this.player, this.player.Event.MEDIA_LOADED, () => {
            if (!this._wasSetupExecuted) {
                if (hasOnPluginSetup(this)) {
                    try {
                        const config = this.getContribConfig();
                        this.onPluginSetup(config);
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

            if (hasOnMediaLoad(this)) {
                try {
                    const sources = this.getContribConfig().sources;

                    this.onMediaLoad({ sources });
                } catch (e) {
                    console.error(`failure during media load `, { error: e.message });
                }
            }
        });
    }

    public destroy() {
        this.reset();
        this.eventManager.destroy();

        if (hasOnPluginDestory(this)) {
            try {
                this.hasOnPluginDestory();
            } catch (e) {
                console.error(`failure during plugin destroy`, { error: e.message });
            }
        }
    }

    public reset() {
        this._environment.uiManager.reset();
        if (hasOnMediaUnload(this)) {
            try {
                this.onMediaUnload();
            } catch (e) {
                console.error(`failure during media unload`, { error: e.message });
            }
        }
    }

    protected _sendAnalytics() {
        // TBD
        throw new Error("tbd");
    }

    getContribConfig(): ContribConfig {
        const sources = this.player.config.sources
            ? {
                  entryId: this.player.config.sources.id,
                  entryType: this.player.config.sources.type
              }
            : undefined;

        return {
            sources,
            server: {
                ks: this.player.config.session.ks,
                serviceUrl: this.player.config.provider.env.serviceUrl,
                partnerId: this.player.config.session.partnerId,
                userId: this.player.config.session.userId
            }
        };
    }
}
