import { PlayerContribRegistry } from "@playkit-js-contrib/common";
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
import {
    PushNotifications,
    PushNotificationsFactory,
    PushNotificationsOptions
} from "@playkit-js-contrib/push-notifications";

export interface ContribServicesOptions {
    corePlayer: CorePlayer;
}

function getPlayerContribRegistry(corePlayer: any): PlayerContribRegistry {
    return PlayerContribRegistry.get(corePlayer);
}

// TODO SAKAL find more suitable location
enableLogIfNeeded();

export class ContribServices {
    static get(options: ContribServicesOptions): ContribServices {
        const playerContribRegistry = getPlayerContribRegistry(options.corePlayer);
        return playerContribRegistry.register("ContribServices-v1", 1, () => {
            return new ContribServices(playerContribRegistry, options);
        });
    }

    constructor(
        private _playerContribRegistry: PlayerContribRegistry,
        private _options: ContribServicesOptions
    ) {}

    private registerResources() {}

    public get playerContribRegistry(): PlayerContribRegistry {
        return PlayerContribRegistry.get(this._options.corePlayer);
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
            this.playerContribRegistry,
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
        return PresetManager.fromPlayer(this.playerContribRegistry, () => {
            const options = {
                corePlayer: this._options.corePlayer
            };

            return new PresetManager(options);
        });
    }

    public get upperBarManager(): UpperBarManager {
        return UpperBarManager.fromPlayer(this.playerContribRegistry, () => {
            const options = {
                corePlayer: this._options.corePlayer,
                presetManager: this.presetManager
            };

            return new UpperBarManager(options);
        });
    }

    public pushNotifications(options: PushNotificationsOptions): PushNotifications {
        const factory = PushNotificationsFactory.fromPlayer(this.playerContribRegistry, () => {
            return new PushNotificationsFactory();
        });

        return factory.getInstance(options);
    }
    public get kitchenSinkManager(): KitchenSinkManager {
        return KitchenSinkManager.fromPlayer(this.playerContribRegistry, () => {
            const options = {
                corePlayer: this._options.corePlayer,
                presetManager: this.presetManager,
                upperBarManager: this.upperBarManager
            };

            return new KitchenSinkManager(options);
        });
    }

    public get floatingManager(): FloatingManager {
        return FloatingManager.fromPlayer(this.playerContribRegistry, () => {
            const options = {
                corePlayer: this._options.corePlayer,
                presetManager: this.presetManager
            };

            return new FloatingManager(options);
        });
    }

    public get bannerManager(): BannerManager {
        return BannerManager.fromPlayer(this.playerContribRegistry, () => {
            const options: BannerManagerOptions = {
                corePlayer: this._options.corePlayer,
                floatingManager: this.floatingManager
            };

            return new BannerManager(options);
        });
    }

    public get toastManager(): ToastManager {
        return ToastManager.fromPlayer(this.playerContribRegistry, () => {
            const options: ToastManagerOptions = {
                floatingManager: this.floatingManager
            };

            return new ToastManager(options);
        });
    }
}
