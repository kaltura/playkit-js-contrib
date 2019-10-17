import { ContribPluginFactories } from "./contrib-plugin-factories";
import { CorePluginProxy } from "./core-plugin-proxy";
import { CorePlugin } from "./core-plugin";
import { ContribServices } from "./contrib-services";
import { ContribPlugin } from "./contrib-plugin";

export type ContribPluginData = {
    corePlugin: CorePlugin;
    contribServices: ContribServices;
};

export type ContribPluginFactory = (data: ContribPluginData) => ContribPlugin;
export type CorePluginFactory = (...args: any[]) => CorePlugin;

export class ContribPluginManager {
    static registerPlugin(
        pluginName: string,
        contribPluginFactory: ContribPluginFactory,
        overrides?: {
            corePluginFactory?: CorePluginFactory;
            defaultConfig?: Record<string, any>;
        }
    ) {
        ContribPluginFactories.factories[pluginName] = {
            contribPluginFactory,
            corePluginFactory: overrides.corePluginFactory,
            defaultConfig: overrides.defaultConfig
        };
        KalturaPlayer.core.registerPlugin(pluginName, CorePluginProxy);
    }
}
