import { ContribPluginFactory, CorePluginFactory } from "./contrib-plugin-manager";

export type PluginFactories = {
    contribPluginFactory: ContribPluginFactory;
    corePluginFactory?: CorePluginFactory;
    defaultConfig?: Record<string, any>;
};

export class ContribPluginFactories {
    static factories: Record<string, PluginFactories> = {};
}
