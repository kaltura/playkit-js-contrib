import { PlayerContribServices } from "@playkit-js-contrib/common";
import { PresetItemData } from "./presetItemData";
import { KalturaPlayerPresetComponent, PresetItem } from "./presetItem";

export interface PresetManagerOptions {
    kalturaPlayer: KalturaPlayerInstance;
}

const ResourceToken = "PresetManager-v1";

// TODO sakal rename to PlayerUIManager
export class PresetManager {
    static fromPlayer(playerContribServices: PlayerContribServices, creator: () => PresetManager) {
        return playerContribServices.register(ResourceToken, 1, creator);
    }

    private _isLocked = false;
    private _options: PresetManagerOptions;
    private _components: PresetItem[] = [];
    private _pendingComponents: PresetItem[] = [];

    constructor(options: PresetManagerOptions) {
        this._options = options;
    }

    add<TProps>(data: PresetItemData & { shown?: boolean }): void {
        if (this._isLocked) {
            console.warn(`cannot add new preset items once player completed its' setup phase`);
            return null;
        }
        const component = new PresetItem({
            kalturaPlayer: this._options.kalturaPlayer,
            data
        });

        this._pendingComponents.push(component);
    }

    lockManager(): void {
        this._isLocked = true;
    }

    registerComponents(): KalturaPlayerPresetComponent[] {
        const configs: (KalturaPlayerPresetComponent | null)[] = this._pendingComponents.map(
            component => component.playerConfig
        );
        this._components = [...this._components, ...this._pendingComponents];
        this._pendingComponents = [];
        return configs.filter(Boolean) as KalturaPlayerPresetComponent[];
    }
}
