import { ComponentChild, h, render } from "preact";
import { log, PlayerAPI } from "@playkit-js-contrib/common";
import { PresetItemData, PresetContainer } from "./presetItemData";
import { ManagedComponent } from './components/managed-component';

export interface PresetItemOptions {
    playerAPI: PlayerAPI;
    data: PresetItemData;
}

export interface PresetItemProps {}

export interface KalturaPlayerPresetComponent {
    label: string,
    presets: string[],
    container: string,
    create: (options: { context?: any, parent: HTMLElement }) => void,
    onDestroy: (options: { context?: any, parent: HTMLElement }) => void
}

function getPlayerPresetContainer(container: PresetContainer): string {
    if (typeof container === 'string') {
        return container;
    }
    if (container.name === 'bottomBar') {
        return `bottom-bar__${container.position}-controls`
    }
    if (container.name === 'topBar') {
        return `top-bar__${container.position}-controls`
    }
    if (container.name === 'sidePanel') {
        return 'side-panel';
    }
    if (container.name === 'video') {
        return 'player-gui';
    }
    return '';
}

export class PresetItem {
    private _options: PresetItemOptions;
    private _componentRef: ManagedComponent | null = null;
    private _element: Element | null = null;

    constructor(options: PresetItemOptions & { shown?: boolean }) {
        this._options = options;
        log("debug", `contrib-ui::PresetItem:ctor()`, "executed", {options});
    }

    get playerConfig(): KalturaPlayerPresetComponent | null {
        const containerName = getPlayerPresetContainer(this._options.data.container);

        if (!containerName) {
            log(
                "warn",
                `c_addPresetComponent()`,
                `unknown container requested`
            );
            return null;
        }

        // TODO sakal change in @playkit-js/playkit-js-ui render to renderChild
        return {
            label: this._options.data.label,
            presets: this._options.data.presets,
            container: containerName,
            create: this._create,
            onDestroy: this._onDestroy
        }
    }

    private _onDestroy = (options: { context?: any, parent: HTMLElement }): void => {
        // TODO sakal handle destroy
        if (!options.parent) {
            log(
                "warn",
                "presetItem()._onDestroy()",
                "missing parent argument, aborting element removal"
            )
            return;
        }

        const {label} = this._options.data;

        if (!this._element) {
            log(
                "warn",
                `presetItem()._onDestroy(${label})`,
                "missing injected component reference, aborting element removal"
            )
            return;
        }

        log(
            "log",
            `presetItem()._onDestroy(${label})`,
            "remove injected contrib preset component"
        )
        this._element = render(null, options.parent, this._element);
    }

    private _create = (options: { context?: any, parent: HTMLElement }): void => {

        if (!options.parent) {
            log(
                "warn",
                "presetItem()._create()",
                "missing parent argument, aborting element creation"
            );
            return;
        }
        const {label} = this._options.data;
        const child = this._options.data.renderChild();

        if (!child) {
            log(
                "warn",
                `presetItem()._create(${label})`,
                "child renderer result is invalid, expected element got undefined|null"
            );
            return;
        }

        log(
            "log",
            `presetItem()._create(${label})`,
            "inject contrib preset component"
        )
        this._element = render(child, options.parent);
    }
}
