import { PlayerAPI, PlayerContribServices } from "@playkit-js-contrib/common";
import {
    OverlayManager,
    UIManager,
    UpperBarManager,
    KitchenSinkManager,
    PresetManager,
    AnnouncementManager,
    AnnouncementManagerOptions
} from "@playkit-js-contrib/ui";
import { enableLogIfNeeded } from "@playkit-js-contrib/common";

export interface EnvironmentManagerOptions {
    playerAPI: PlayerAPI;
}

function getPlayerContribServices(kalturaPlayer: any): PlayerContribServices {
    return PlayerContribServices.get(kalturaPlayer);
}

// TODO SAKAL find more suitable location
enableLogIfNeeded();

export class EnvironmentManager {
    static get(options: EnvironmentManagerOptions): EnvironmentManager {
        const playerContribServices = getPlayerContribServices(options.playerAPI.kalturaPlayer);
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
        return PlayerContribServices.get(this._options.playerAPI.kalturaPlayer);
    }

    public get uiManager(): UIManager {
        return UIManager.fromPlayer(
            this.playerContribServices,
            (): UIManager => {
                const options = {
                    playerAPI: this._options.playerAPI,
                    presetManager: this.presetManager,
                    upperBarManager: this.upperBarManager,
                    kitchenSinkManager: this.kitchenSinkManager,
                    overlayManager: this.overlayManager,
                    announcementManager: this.announcementManager
                };

                return new UIManager(options);
            }
        );
    }

    public get presetManager(): PresetManager {
        return PresetManager.fromPlayer(this.playerContribServices, () => {
            const options = {
                playerAPI: this._options.playerAPI
            };

            return new PresetManager(options);
        });
    }

    public get upperBarManager(): UpperBarManager {
        return UpperBarManager.fromPlayer(this.playerContribServices, () => {
            const options = {
                playerAPI: this._options.playerAPI,
                presetManager: this.presetManager
            };

            return new UpperBarManager(options);
        });
    }

    public get kitchenSinkManager(): KitchenSinkManager {
        return KitchenSinkManager.fromPlayer(this.playerContribServices, () => {
            const options = {
                playerAPI: this._options.playerAPI,
                presetManager: this.presetManager,
                upperBarManager: this.upperBarManager
            };

            return new KitchenSinkManager(options);
        });
    }

    public get overlayManager(): OverlayManager {
        return OverlayManager.fromPlayer(this.playerContribServices, () => {
            const options = {
                playerAPI: this._options.playerAPI,
                presetManager: this.presetManager
            };

            return new OverlayManager(options);
        });
    }

    public get announcementManager(): AnnouncementManager {
        return AnnouncementManager.fromPlayer(this.playerContribServices, () => {
            const options: AnnouncementManagerOptions = {
                overlayManager: this.overlayManager
            };

            return new AnnouncementManager(options);
        });
    }
}
