import { UpperBarManager } from "./upperBarManager";
import { OverlayManager } from "./overlayManager";
import { KitchenSinkManager } from "./kitchenSinkManager";
import { PlayerContribServices } from "@playkit-js-contrib/common";
import { PresetManager } from "./presetManager";
import { BannerManager } from "./bannerManager";
import { ToastsManager } from "./toastsManager";

export interface UIManagerOptions {
    upperBarManager: UpperBarManager;
    overlayManager: OverlayManager;
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

    constructor(private _options: UIManagerOptions) {
        this._loadFont();
    }

    get upperBar(): UpperBarManager {
        return this._options.upperBarManager;
    }

    get overlay(): OverlayManager {
        return this._options.overlayManager;
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
        this._options.overlayManager && this._options.overlayManager.reset();
        this._options.kitchenSinkManager && this._options.kitchenSinkManager.reset();
        this._options.bannerManager && this._options.bannerManager.reset();
        this._options.toastManager && this._options.toastManager.reset();
    }

    private _loadFont() {
        //todo [sa] load font from config
        //todo [sa] use Lato font family - currently just testing
        const fontCss = `.playkit-player .playkit-player-gui  {
                font-family: inherit;
            }
        
            .playkit-player-gui-content {
                font-family: cursive, sans-serif;
            }
        
            button {
                font-family: inherit;
            }`;
        const lastHeadChild = (document.head || document.getElementsByTagName("head")[0])
            .lastElementChild;
        const style = document.createElement("style");
        //adding as last child
        lastHeadChild.parentNode.insertBefore(style, lastHeadChild.nextSibling);
        style.appendChild(document.createTextNode(fontCss));
    }
}
