import { ComponentChild, h } from "preact";
import { log, PlayerAPI } from "@playkit-js-contrib/common";
import { PresetItemData, PresetContainer } from "./presetItemData";
import { PresetItem as PresetItemComponent } from "./components/preset-item";
import { ManagedComponent } from './components/managed-component';

export interface PresetItemOptions<TProps extends Record<string, any>> {
    playerAPI: PlayerAPI;
    data: PresetItemData<TProps>;
}

export interface PresetItemProps {}

export interface KalturaPlayerPresetComponent {
    presets: string[],
    container: string,
    render: () => ComponentChild
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

export class PresetItem<TProps extends Record<string, any>> {
    private _options: PresetItemOptions<TProps>;
    private _props: TProps;
    private _componentRef: ManagedComponent | null = null;
    private _isShown: boolean;


    constructor(options: PresetItemOptions<TProps> & { shown?: boolean}) {
        this._options = options;
        log("debug", `contrib-ui::PresetItem:ctor()`, "executed", { options });
        this._props = this._options.data.initialProps;
        this._isShown = options.shown || true;
    }

    setProps(props: TProps) {
        this._props = props;
    }

    remove = (): void => {
        log("debug", `plugin-v7::overlayUI.remove()`, "executed");
        this._isShown = false;

        // TODO sakal check if need to manually call renderer update or if shown prop is enough
        if (!this._componentRef) {
            return;
        }

        this._componentRef.update();
    };

    add = (): void => {

        log("debug", `plugin-v7::PresetItem.add()`, "executed");
        this._isShown = true;

        // TODO sakal check if need to manually call renderer update or if shown prop is enough
        if (!this._componentRef) {
            return;
        }

        this._componentRef.update();
    };

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
            presets: this._options.data.presets,
            container: containerName,
            render: this._render
        }
    }

    private _renderChild = (): ComponentChild => {
        const {label, renderer} = this._options.data;
        return <ManagedComponent label={label} renderChildren={() => renderer(this._props)} shown={this._isShown}
                                 ref={(ref) => this._componentRef = ref}/>
    }

    public _render = (): ComponentChild => {
        const { label, fitToContainer } = this._options.data;
        // TODO set here actual name of plugin
        return (
            <PresetItemComponent label={label} fitToContainer={fitToContainer} renderChild={this._renderChild} />
        );
    };
}
