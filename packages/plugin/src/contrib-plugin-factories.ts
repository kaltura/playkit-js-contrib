import { CorePlugin } from "./core-plugin";
import { ContribPlugin } from "./contrib-plugin";

export type AdvancedContribPlugin = {
    contribPlugin: ContribPlugin;
    corePluginConstructor: CorePluginConstructor;
};

export function isAdvancedContribPlugin(item: any): item is AdvancedContribPlugin {
    return item && item.contribPlugin && item.corePlugin;
}

export interface CorePluginConstructor {
    new (...args: any[]): CorePlugin;
}

export type ContribPluginFactory = (context: {
    corePlayer: KalturaPlayerInstance;
}) => ContribPlugin | AdvancedContribPlugin;

export class ContribPluginFactories {
    // TODO sakal expose add/get instead of actual property
    static factories: Record<string, ContribPluginFactory> = {};
}
