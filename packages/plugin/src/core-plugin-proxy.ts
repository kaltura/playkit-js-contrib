import { CorePlugin } from "./core-plugin";
import { ContribPlugin } from "./contrib-plugin";
import { ContribPluginFactories } from "./contrib-plugin-factories";
import { ContribServices } from "./contrib-services";
import { getContribLogger } from "@playkit-js-contrib/common";
import { ContribPluginConfigs } from "./contrib-plugin-configs";

const _logger = getContribLogger({
    module: "contrib-plugin",
    class: "core-plugin-proxy"
});

// @ts-ignore
export class CorePluginProxy extends KalturaPlayer.core.BasePlugin {
    static isValid(player: any) {
        return true;
    }

    static createPlugin(name: string, player: any, config: any): any {
        const pluginFactories = ContribPluginFactories.factories[name];

        if (!pluginFactories) {
            _logger.error("cannot find requested contrib plugin", {
                data: {
                    pluginName: name
                }
            });
            throw new Error(`cannot find contrib plugin factory named '${name}`);
        }

        try {
            const corePluginConfig = KalturaPlayer.core.utils.Object.mergeDeep(
                {},
                pluginFactories.defaultConfig || {},
                config
            );
            const contribServices = ContribServices.get({ corePlayer: player });

            const corePlugin = pluginFactories.corePluginFactory
                ? pluginFactories.corePluginFactory(name, player, corePluginConfig)
                : new CorePlugin(name, player, corePluginConfig);

            const contribPlugin = pluginFactories.contribPluginFactory({
                corePlugin,
                contribServices,
                configs: new ContribPluginConfigs<any>(player, corePlugin),
                player
            });

            corePlugin.setContribContext({ contribPlugin, contribServices });

            _logger.info("created contrib plugin", {
                data: {
                    pluginName: name
                }
            });

            return corePlugin;
        } catch (e) {
            _logger.error("failed to create contrib plugin", {
                data: {
                    pluginName: name,
                    error: e
                }
            });
            throw e;
        }
    }

    protected _contribPlugin!: ContribPlugin;

    setPluginContext(contribPlugin: ContribPlugin) {
        this._contribPlugin = contribPlugin;
    }
}
