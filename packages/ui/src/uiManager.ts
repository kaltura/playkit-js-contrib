import { UpperBarManager } from "./upperBarManager";
import { OverlayManager } from "./overlayManager";

export interface UIManagerOptions {
    upperBarManager: UpperBarManager;
    overlayManager: OverlayManager;
}

export class UIManager {
    constructor(private _options: UIManagerOptions) {}

    get upperBarItems(): UpperBarManager {
        return this._options.upperBarManager;
    }

    get overlayItems(): OverlayManager {
        return this._options.overlayManager;
    }

    reset(): void {
        this._options.upperBarManager && this._options.upperBarManager.reset();
        this._options.overlayManager && this._options.overlayManager.reset();
    }
}
