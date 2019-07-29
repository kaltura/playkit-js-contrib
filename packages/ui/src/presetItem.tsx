import preact, { h, render } from "preact";
import { getContribLogger, PlayerAPI } from "@playkit-js-contrib/common";
import { PresetItemData, PresetContainer } from "./presetItemData";
import { ManagedComponent } from "./components/managed-component";
import { ContribLogger } from "@playkit-js-contrib/common";

export interface PresetItemOptions {
    playerAPI: PlayerAPI;
    data: PresetItemData;
}

export interface PresetItemProps {}

export interface KalturaPlayerPresetComponent {
    label: string;
    presets: string[];
    container: string;
    render: () => ManagedComponent;
}

function getPlayerPresetContainer(container: PresetContainer): string {
    if (typeof container === "string") {
        return container;
    }
    if (container.name === "bottomBar") {
        return `bottom-bar__${container.position}-controls`;
    }
    if (container.name === "topBar") {
        return `top-bar__${container.position}-controls`;
    }
    if (container.name === "sidePanel") {
        return "side-panel";
    }
    if (container.name === "video") {
        return "player-gui";
    }
    return "";
}

export class PresetItem {
    private _options: PresetItemOptions;
    private _element: Element | null = null;
    private _logger: ContribLogger;

    constructor(options: PresetItemOptions & { shown?: boolean }) {
        this._options = options;
        this._logger = getContribLogger({
            module: "contrib-ui",
            class: "PresetItem",
            context: options.data.label
        });
        this._logger.debug("executed", {
            method: "constructor",
            data: {
                options
            }
        });
        this._logger.info(`created item ${options.data.label}`, {
            method: "constructor"
        });
    }

    get playerConfig(): KalturaPlayerPresetComponent | null {
        const containerName = getPlayerPresetContainer(this._options.data.container);

        if (!containerName) {
            this._logger.warn(`unknown container requested`, {
                method: "playerConfig"
            });
            return null;
        }

        // TODO sakal change in @playkit-js/playkit-js-ui render to renderChild
        return {
            label: this._options.data.label,
            presets: this._options.data.presets,
            container: containerName,
            render: this._render
        };
    }

    private _render = (): any => {
        if (this._options.data.shareAdvancedPlayerAPI) {
            return this._options.data.renderChild();
        }

        const InjectedComponent = h(KalturaPlayer.ui.components.InjectedComponent, {
            label: this._options.data.label,
            onCreate: this._onCreate,
            onDestroy: this._onDestroy
        });

        return InjectedComponent;
    };

    private _onDestroy = (options: { context?: any; parent: HTMLElement }): void => {
        // TODO sakal handle destroy
        if (!options.parent) {
            this._logger.warn(`missing parent argument, aborting element removal`, {
                method: "_onDestroy"
            });
            return;
        }

        if (!this._element) {
            this._logger.warn(`missing injected component reference, aborting element removal`, {
                method: "_onDestroy"
            });
            return;
        }

        this._logger.info(`remove injected contrib preset component`, {
            method: "_onDestroy"
        });

        this._element = render(null, options.parent, this._element);
    };

    private _onCreate = (options: { context?: any; parent: HTMLElement }): void => {
        try {
            if (!options.parent) {
                this._logger.warn(`missing parent argument, aborting element creation`, {
                    method: "_create"
                });
                return;
            }
            const child = this._options.data.renderChild();

            if (!child) {
                this._logger.warn(
                    `child renderer result is invalid, expected element got undefined|null`,
                    {
                        method: "_create"
                    }
                );
                return;
            }

            this._logger.info(`inject contrib preset component`, {
                method: "_create"
            });
            this._element = render(child, options.parent);
        } catch (error) {
            this._logger.error(`failed to create injected component.`, {
                method: "_onCreate"
            });
        }
    };
}
