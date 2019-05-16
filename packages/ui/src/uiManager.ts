import { UpperBarManager } from "./upperBarManager";
import { OverlayManager } from "./overlayManager";
import { KitchenSinkManager } from "./kitchenSinkManager";

export interface UIManagerOptions {
    upperBarManager: UpperBarManager;
    overlayManager: OverlayManager;
    kitchenSinkManager: KitchenSinkManager;
}

export class UIManager {
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

    reset(): void {
        this._options.upperBarManager && this._options.upperBarManager.reset();
        this._options.overlayManager && this._options.overlayManager.reset();
        this._options.kitchenSinkManager && this._options.kitchenSinkManager.reset();
    }
}
