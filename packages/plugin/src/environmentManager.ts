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

export interface EnvironmentManagerOptions {
    kalturaPlayer: KalturaPlayerInstance;
}

function getPlayerContribServices(kalturaPlayer: any): PlayerContribServices {
    return PlayerContribServices.get(kalturaPlayer);
}

// TODO SAKAL find more suitable location
enableLogIfNeeded();

export class EnvironmentManager {
    static get(options: EnvironmentManagerOptions): EnvironmentManager {
        const playerContribServices = getPlayerContribServices(options.kalturaPlayer);
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
        return PlayerContribServices.get(this._options.kalturaPlayer);
    }

    public get uiManager(): UIManager {
        return UIManager.fromPlayer(
            this.playerContribServices,
            (): UIManager => {
                const options = {
                    kalturaPlayer: this._options.kalturaPlayer,
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
                kalturaPlayer: this._options.kalturaPlayer
            };

            return new PresetManager(options);
        });
    }

    public get upperBarManager(): UpperBarManager {
        return UpperBarManager.fromPlayer(this.playerContribServices, () => {
            const options = {
                kalturaPlayer: this._options.kalturaPlayer,
                presetManager: this.presetManager
            };

            return new UpperBarManager(options);
        });
    }

    public get kitchenSinkManager(): KitchenSinkManager {
        return KitchenSinkManager.fromPlayer(this.playerContribServices, () => {
            const options = {
                kalturaPlayer: this._options.kalturaPlayer,
                presetManager: this.presetManager,
                upperBarManager: this.upperBarManager
            };

            return new KitchenSinkManager(options);
        });
    }

    public get floatingManager(): FloatingManager {
        return FloatingManager.fromPlayer(this.playerContribServices, () => {
            const options = {
                kalturaPlayer: this._options.kalturaPlayer,
                presetManager: this.presetManager
            };

            return new FloatingManager(options);
        });
    }

    public get bannerManager(): BannerManager {
        return BannerManager.fromPlayer(this.playerContribServices, () => {
            const options: BannerManagerOptions = {
                kalturaPlayer: this._options.kalturaPlayer,
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
