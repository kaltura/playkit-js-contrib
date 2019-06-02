import { h, render } from "preact";
import { OverlayManager, UIManager, UpperBarManager } from "@playkit-js-contrib/ui";
import { EnvironmentManager } from "./environmentManager";

export interface OnRegisterUI {
	onRegisterUI(uiManager: UIManager): void;
}

function hasOnRegisterUI(plugin: any): plugin is OnRegisterUI  {
	return 'onRegisterUI' in plugin;
}

export interface KalturaServerConfig {
    ks: string;
    partnerId: number;
    serviceUrl: string;
    entryId: string;
}

export interface OnMediaLoad {
    onMediaLoad(config: KalturaServerConfig): void;
}

function hasOnMediaLoad(plugin: any): plugin is OnMediaLoad  {
    return 'onMediaLoad' in plugin;
}

export interface OnMediaUnload {
    onMediaUnload(): void;
}

function hasOnMediaUnload(plugin: any): plugin is OnMediaUnload  {
    return 'onMediaUnload' in plugin;
}

export interface OnRegisterEvents {
    onRegisterEvents(eventManager: any): void;
}

function hasOnRegisterEvents(plugin: any): plugin is OnRegisterEvents  {
    return 'onRegisterEvents' in plugin;
}

// TODO try to remove the 'as any'
// @ts-ignore
export abstract class PlayerContribPlugin extends (KalturaPlayer as any).core.BasePlugin {
    static defaultConfig = {};

    static isValid(player: any) {
        return true;
    }

    private _environment: EnvironmentManager = EnvironmentManager.get({
        playerAPI: {
            kalturaPlayer: this.player,
            eventManager: this.eventManager
        }
    });

    loadMedia(): void {
        if (hasOnRegisterUI(this)) {
            try {
                this.onRegisterUI(this._environment.uiManager)
            } catch(e) {
                console.log(`failed to register contrib ui items for plugin`, { error: e.message });
            }
        }

    	if (hasOnRegisterEvents(this)) {
            try {
                this.onRegisterEvents(this.eventManager);
            } catch (e) {
                console.log(`failed to register to kaltura player events`, {error: e.message});
            }
        }

        if (hasOnMediaLoad(this)) {
            this.eventManager.listenOnce(this.player, this.player.Event.MEDIA_LOAD, () => {
                try {
                    const config = this.getKalturaServerConfig();
                    this.onMediaLoad(config);
                } catch (e) {
                    console.log(`failure during media load `, {error: e.message});
                }
            });
        }
    }

    public destroy() {
        this.reset();
        this.eventManager.destroy();
    }

    public reset() {
        this.eventManager.removeAll();
        this._environment.uiManager.reset();
        if (hasOnMediaUnload(this)) {
            try {
                this.onMediaUnload();
            } catch (e) {
                console.log(`failure during media unload`, {error: e.message});
            }
        }
    }

    protected _sendAnalytics() {
        // TBD
        throw new Error("tbd");
    }

    getKalturaServerConfig(): KalturaServerConfig {
        return {
            ks: this.player.config.session.ks,
            serviceUrl: this.player.config.provider.env.serviceUrl,
            partnerId: this.player.config.session.partnerId,
            entryId: this.player.config.sources.id
        }
    }
}
