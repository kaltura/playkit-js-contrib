import { h } from "preact";
import { UIManager } from "@playkit-js-contrib/ui";
import { EnvironmentManager } from "./environmentManager";

export interface ContribConfig {
    server: {
        ks: string;
        partnerId: number;
        serviceUrl: string;
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

export interface OnMediaLoadConfig {
    entryId: string;
}
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
        playerAPI: {
            kalturaPlayer: this.player,
            eventManager: this.eventManager
        }
    });

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

            if (hasOnRegisterUI(this)) {
                try {
                    this.onRegisterUI(this._environment.uiManager);
                } catch (e) {
                    console.error(`failed to register contrib ui items for plugin`, {
                        error: e.message
                    });
                }
            }

            if (hasOnMediaLoad(this)) {
                try {
                    const config = {
                        entryId: this.player.config.sources.id
                    };

                    this.onMediaLoad(config);
                } catch (e) {
                    console.error(`failure during media load `, { error: e.message });
                }
            }
        });
    }

    public destroy() {
        this.reset();
        this.eventManager.destroy();
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

    get entryId(): string {
        return this.player.config.sources.id;
    }

    getContribConfig(): ContribConfig {
        return {
            server: {
                ks: this.player.config.session.ks,
                serviceUrl: this.player.config.provider.env.serviceUrl,
                partnerId: this.player.config.session.partnerId
            }
        };
    }
}
