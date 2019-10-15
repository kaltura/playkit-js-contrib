import { UpperBarManager } from "./upperBarManager";
import { FloatingManager } from "./floatingManager";
import { KitchenSinkManager } from "./kitchenSinkManager";
import { PlayerContribServices } from "@playkit-js-contrib/common";
import { PresetManager } from "./presetManager";
import { BannerManager } from "./bannerManager";
import { ToastsManager } from "./toastsManager";

export interface UIManagerOptions {
    upperBarManager: UpperBarManager;
    floatingManager: FloatingManager;
    kitchenSinkManager: KitchenSinkManager;
    presetManager: PresetManager;
    bannerManager: BannerManager;
    toastManager: ToastsManager;
}

const ResourceToken = "UIManager-v1";

export class UIManager {
    static fromPlayer(playerContribServices: PlayerContribServices, creator: () => UIManager) {
        return playerContribServices.register(ResourceToken, 1, creator);
    }

    constructor(private _options: UIManagerOptions) {}

    get upperBar(): UpperBarManager {
        return this._options.upperBarManager;
    }

    get floating(): FloatingManager {
        return this._options.floatingManager;
    }

    get kitchenSink(): KitchenSinkManager {
        return this._options.kitchenSinkManager;
    }

    get banner(): BannerManager {
        return this._options.bannerManager;
    }

    get toast(): ToastsManager {
        return this._options.toastManager;
    }

    get playerUIComponents(): { add: PresetManager["add"] } {
        return {
            add: this._options.presetManager.add.bind(this._options.presetManager)
        };
    }

    reset(): void {
        this._options.upperBarManager && this._options.upperBarManager.reset();
        this._options.floatingManager && this._options.floatingManager.reset();
        this._options.kitchenSinkManager && this._options.kitchenSinkManager.reset();
        this._options.bannerManager && this._options.bannerManager.reset();
        this._options.toastManager && this._options.toastManager.reset();
    }
}
