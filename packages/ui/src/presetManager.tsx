import { PlayerAPI, PlayerContribServices } from "@playkit-js-contrib/common";
import { PresetItemData } from "./presetItemData";
import { PresetItem } from "./presetItem";

export interface PresetManagerOptions {
    playerAPI: PlayerAPI;
}

const ResourceToken = "PresetManager-v1";

export class PresetManager {
    static fromPlayer(playerContribServices: PlayerContribServices, creator: () => PresetManager) {
        return playerContribServices.register(ResourceToken, 1, creator);
    }

    private _options: PresetManagerOptions;
    private _components: PresetItem<any>[] = [];

    constructor(options: PresetManagerOptions) {
        this._options = options;
    }

    add<TProps>(data: PresetItemData<TProps>): PresetItem<TProps> {
        const component = new PresetItem({
            playerAPI: this._options.playerAPI,
            data
        });

        this._components.push(component);
        return component;
    }
}
