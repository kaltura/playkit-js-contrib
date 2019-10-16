import { PlayerContribServices } from "@playkit-js-contrib/common";
import {
    FloatingManager,
    UIManager,
    UpperBarManager,
    KitchenSinkManager,
    PresetManager,
    BannerManager,
    BannerManagerOptions,
    ToastManager,
    ToastManagerOptions
} from "@playkit-js-contrib/ui";
import { enableLogIfNeeded } from "@playkit-js-contrib/common";
import { ContribConfig, EntryTypes } from "./core-plugin";

export interface EnvironmentManagerOptions {
    corePlayer: CorePlayer;
}

function getPlayerContribServices(corePlayer: any): PlayerContribServices {
    return PlayerContribServices.get(corePlayer);
}

// TODO SAKAL find more suitable location
enableLogIfNeeded();

export class EnvironmentManager {
    static get(options: EnvironmentManagerOptions): EnvironmentManager {
        const playerContribServices = getPlayerContribServices(options.corePlayer);
        return playerContribServices.register("EnvironmentManager-v1", 1, () => {
            return new EnvironmentManager(playerContribServices, options);
        });
    }

    constructor(
        private _playerContribServices: PlayerContribServices,
        private _options: EnvironmentManagerOptions
    ) {}

    private registerResources() {}

    public get playerContribServices(): PlayerContribServices {
        return PlayerContribServices.get(this._options.corePlayer);
    }

    public getContribConfig(): ContribConfig {
        const { corePlayer } = this._options;

        const sources = corePlayer.config.sources
            ? {
                  entryId: corePlayer.config.sources.id,
                  entryType: EntryTypes[corePlayer.config.sources.type] || EntryTypes.Vod
              }
            : undefined;

        return {
            sources,
            server: {
                ks: corePlayer.config.session.ks,
                serviceUrl: corePlayer.config.provider.env.serviceUrl,
                partnerId: corePlayer.config.session.partnerId,
                userId: corePlayer.config.session.userId
            }
        };
    }

    public get uiManager(): UIManager {
        return UIManager.fromPlayer(
            this.playerContribServices,
            (): UIManager => {
                const options = {
                    corePlayer: this._options.corePlayer,
                    presetManager: this.presetManager,
                    upperBarManager: this.upperBarManager,
                    kitchenSinkManager: this.kitchenSinkManager,
                    floatingManager: this.floatingManager,
                    bannerManager: this.bannerManager,
                    toastManager: this.toastManager
                };

                return new UIManager(options);
            }
        );
    }

    public get presetManager(): PresetManager {
        return PresetManager.fromPlayer(this.playerContribServices, () => {
            const options = {
                corePlayer: this._options.corePlayer
            };

            return new PresetManager(options);
        });
    }

    public get upperBarManager(): UpperBarManager {
        return UpperBarManager.fromPlayer(this.playerContribServices, () => {
            const options = {
                corePlayer: this._options.corePlayer,
                presetManager: this.presetManager
            };

            return new UpperBarManager(options);
        });
    }

    public get kitchenSinkManager(): KitchenSinkManager {
        return KitchenSinkManager.fromPlayer(this.playerContribServices, () => {
            const options = {
                corePlayer: this._options.corePlayer,
                presetManager: this.presetManager,
                upperBarManager: this.upperBarManager
            };

            return new KitchenSinkManager(options);
        });
    }

    public get floatingManager(): FloatingManager {
        return FloatingManager.fromPlayer(this.playerContribServices, () => {
            const options = {
                corePlayer: this._options.corePlayer,
                presetManager: this.presetManager
            };

            return new FloatingManager(options);
        });
    }

    public get bannerManager(): BannerManager {
        return BannerManager.fromPlayer(this.playerContribServices, () => {
            const options: BannerManagerOptions = {
                corePlayer: this._options.corePlayer,
                floatingManager: this.floatingManager
            };

            return new BannerManager(options);
        });
    }

    public get toastManager(): ToastManager {
        return ToastManager.fromPlayer(this.playerContribServices, () => {
            const options: ToastManagerOptions = {
                floatingManager: this.floatingManager
            };

            return new ToastManager(options);
        });
    }
}
