import { CorePlugin } from "./core-plugin";
import { ContribPlugin, hasSetCorePlugin } from "./contrib-plugin";
import {
    AdvancedContribPlugin,
    ContribPluginFactories,
    isAdvancedContribPlugin
} from "./contrib-plugin-factories";

// @ts-ignore
export class CorePluginProxy extends KalturaPlayer.core.BasePlugin {
    static isValid(player: any) {
        return true;
    }

    static createPlugin(name: string, player: any, config: any): any {
        const factory = ContribPluginFactories.factories[name];

        if (!factory) {
            throw new Error(`cannot find contrib plugin factory for '${name}`);
        }

        const plugin = factory({ corePlayer: player });

        let contribPlugin: ContribPlugin;
        let corePlugin: CorePlugin;
        if (isAdvancedContribPlugin(plugin)) {
            corePlugin = new plugin.corePluginConstructor(name, player, config);
            contribPlugin = plugin.contribPlugin;
        } else {
            corePlugin = new CorePlugin(name, player, config);
            contribPlugin = plugin;
        }

        corePlugin.setContribPlugin(contribPlugin);
        if (hasSetCorePlugin(contribPlugin)) {
            contribPlugin.setCorePlugin(corePlugin);
        }

        return corePlugin;
    }

    protected _contribPlugin!: ContribPlugin;

    setPluginContext(contribPlugin: ContribPlugin) {
        this._contribPlugin = contribPlugin;
    }
}
