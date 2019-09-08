import { h, render } from "preact";
import { getContribLogger, PlayerAPI } from "@playkit-js-contrib/common";
import { PresetItemData, PredefinedContainers, RelativeToTypes } from "./presetItemData";
import { ManagedComponent } from "./components/managed-component";
import { ContribLogger } from "@playkit-js-contrib/common";
import { InjectedComponent } from "./components/injected-component/injected-component";

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

function getPlayerPresetContainer(container: PredefinedContainers): string {
    if (typeof container === "string") {
        return container;
    }

    if (container.name === "BottomBar") {
        return `BottomBar${container.position}Controls`;
    }
    if (container.name === "TopBar") {
        return `top-bar__${container.position}-controls`;
    }
    if (container.name === "SidePanel") {
        return `side-panel-${container.position}`;
    }
    if (container.name === "PresetOverlay") {
        return "PresetOverlay";
    }
    if (container.name === "VideoOverlay") {
        return "VideoOverlay";
    }
    if (container.name === "PlayerOverlay") {
        return "VideoOverlay";
    }
    if (container.name === "PresetMiddleArea") {
        return "PresetMiddleArea";
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
        const { relativeTo } = this._options.data;

        if (!containerName) {
            this._logger.warn(`unknown container requested`, {
                method: "playerConfig"
            });
            return null;
        }

        // TODO sakal change in @playkit-js/playkit-js-ui render to renderChild
        const result: any = {
            label: this._options.data.label,
            presets: this._options.data.presets,
            container: containerName,
            render: this._render
        };

        if (relativeTo) {
            switch (relativeTo.type) {
                case RelativeToTypes.After:
                    result["afterComponent"] = relativeTo.name;
                    break;
                case RelativeToTypes.Before:
                    result["beforeComponent"] = relativeTo.name;
                    break;
                case RelativeToTypes.Replace:
                    result["replaceComponent"] = relativeTo.name;
                    break;
            }
        }

        return result;
    }

    private _render = (): any => {
        if (this._options.data.shareAdvancedPlayerAPI) {
            return this._options.data.renderChild();
        }

        const {
            data: { label, fillContainer }
        } = this._options;

        return (
            <InjectedComponent
                label={label}
                fillContainer={fillContainer || false}
                onCreate={this._onCreate}
                onDestroy={this._onDestroy}
            />
        );
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
