import { UpperBarManager } from "./upperBarManager";
import { OverlayManager } from "./overlayManager";
import { KitchenSinkManager } from "./kitchenSinkManager";
import { PlayerContribServices } from "@playkit-js-contrib/common";
import { PresetManager } from "./presetManager";
import { FloatingNotificationManager } from "./floatingNotificationManager";

export interface UIManagerOptions {
    upperBarManager: UpperBarManager;
    overlayManager: OverlayManager;
    kitchenSinkManager: KitchenSinkManager;
    presetManager: PresetManager;
    floatingNotificationManager: FloatingNotificationManager;
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

    get overlay(): OverlayManager {
        return this._options.overlayManager;
    }

    get kitchenSink(): KitchenSinkManager {
        return this._options.kitchenSinkManager;
    }

    get floatingNotification(): FloatingNotificationManager {
        return this._options.floatingNotificationManager;
    }

    get playerUIComponents(): { add: PresetManager["add"] } {
        return {
            add: this._options.presetManager.add.bind(this._options.presetManager)
        };
    }

    reset(): void {
        this._options.upperBarManager && this._options.upperBarManager.reset();
        this._options.overlayManager && this._options.overlayManager.reset();
        this._options.kitchenSinkManager && this._options.kitchenSinkManager.reset();
        this._options.floatingNotificationManager &&
            this._options.floatingNotificationManager.reset();
    }
}
