import { CorePlugin } from "./core-plugin";
import { ContribPluginFactories, ContribPluginFactory } from "./contrib-plugin-factories";
import { CorePluginProxy } from "./core-plugin-proxy";

export class ContribPluginManager {
    static registerPlugin(pluginName: string, factory: ContribPluginFactory) {
        ContribPluginFactories.factories[pluginName] = factory;
        KalturaPlayer.core.registerPlugin(pluginName, CorePluginProxy);
    }
}
