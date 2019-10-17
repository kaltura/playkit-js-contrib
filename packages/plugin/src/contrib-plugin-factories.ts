import { ContribPluginFactory, CorePluginFactory } from "./contrib-plugin-manager";

export type PluginFactories = {
    contribPluginFactory: ContribPluginFactory;
    corePluginFactory?: CorePluginFactory;
    defaultConfig?: Record<string, any>;
};

export class ContribPluginFactories {
    // TODO sakal expose add/get instead of actual property
    static factories: Record<string, PluginFactories> = {};
}
