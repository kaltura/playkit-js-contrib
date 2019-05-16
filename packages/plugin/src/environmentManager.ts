import { enableLog } from "@playkit-js/ovp-common";
import { OverlayManager, UIManager, UpperBarManager, KitchenSinkManager } from "@playkit-js/ovp-ui";
import { ResourceManager } from "@playkit-js/ovp-common";

export interface EnvironmentManagerOptions {
    eventManager: any;
    kalturaPlayer: any;
}

function getResourceManager(kalturaPlayer: any): ResourceManager {
    return ResourceManager.get(kalturaPlayer);
}

export class EnvironmentManager {
    static get(options: EnvironmentManagerOptions): EnvironmentManager {
        const resourceManager = getResourceManager(options.kalturaPlayer);
        return resourceManager.getResource(
            {
                name: "EnvironmentManager",
                version: "1"
            },
            () => {
                return new EnvironmentManager(resourceManager, options);
            }
        );
    }

    constructor(
        private _resourceManager: ResourceManager,
        private _options: EnvironmentManagerOptions
    ) {
        // TODO hook log to player log flags
        enableLog(name);
    }

    public get resourceManager(): ResourceManager {
        return ResourceManager.get(this._options.kalturaPlayer);
    }

    public get uiManager(): UIManager {
        return this._resourceManager.getResource(
            {
                name: "uiManager",
                version: "1"
            },
            this._createUIManager
        );
    }

    private _createUIManager = (): UIManager => {
        const sharedOptions = {
            eventManager: this._options.eventManager,
            kalturaPlayer: this._options.kalturaPlayer
        };

        return new UIManager({
            upperBarManager: new UpperBarManager(sharedOptions),
            kitchenSinkManager: new KitchenSinkManager(sharedOptions),
            overlayManager: new OverlayManager(sharedOptions)
        });
    };
}
