import { ContribPluginFactories } from "./contrib-plugin-factories";
import { CorePluginProxy } from "./core-plugin-proxy";
import { CorePlugin } from "./core-plugin";
import { ContribServices } from "./contrib-services";
import { ContribPlugin } from "./contrib-plugin";
import { ContribPluginConfigs } from "./contrib-plugin-configs";

export type ContribPluginData<TConfig extends Record<string, any>> = {
    corePlugin: CorePlugin;
    contribServices: ContribServices;
    configs: ContribPluginConfigs<TConfig>;
    player: KalturaPlayerTypes.Player;
};

export type ContribPluginFactory<TConfig> = (data: ContribPluginData<TConfig>) => ContribPlugin;
export type CorePluginFactory = (...args: any[]) => CorePlugin;

export class ContribPluginManager {
    static registerPlugin<TConfig extends Record<string, any>>(
        pluginName: string,
        contribPluginFactory: ContribPluginFactory<TConfig>,
        overrides?: {
            corePluginFactory?: CorePluginFactory;
            defaultConfig?: TConfig;
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
