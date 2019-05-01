import { h, render, cloneElement, Ref } from "preact";
import { OVPBasePlugin, PluginUI } from "./ovpBasePlugin";

export enum OverlayVisibilities {
    MediaLoaded,
    OnDemand
}

export interface OverlayUIOptions {
    visibility: OverlayVisibilities;
    renderer: (setRef: any, overlayUIProps: OverlayUIProps) => any;
    className?: string;
}

export interface OverlayUIProps {
    currentTime: number;
    shouldHandleResize: boolean;
}

export class OverlayUI<TRoot> implements PluginUI {
    private _root: any;
    private _player: any;
    private _rootParent: any;
    private _rootRef: TRoot | null = null;
    private _plugin: any;
    private _options: OverlayUIOptions;

    constructor(plugin: OVPBasePlugin, options: OverlayUIOptions) {
        this._plugin = plugin;
        this._options = options;
        this._player = plugin.player;

        this._addPluginBindings();
        this._addPlayerBindings();
    }

    private _addPluginBindings() {
        // TODO
        // if (!this._root) {
        // 	return;
        // }
        //
        // render(
        // 	// @ts-ignore
        // 	h(null),
        // 	this._rootParent,
        // 	this._root
        // );
        //
        // this._root = null;
    }

    private _addPlayerBindings() {
        const { eventManager } = this._plugin;

        if (this._options.visibility === OverlayVisibilities.MediaLoaded) {
            eventManager.listen(this._player, this._player.Event.MEDIA_LOADED, this._createRoot);
        }

        eventManager.listen(this._player, this._player.Event.TIME_UPDATE, () => {
            this._updateRoot({ shouldHandleResize: false });
        });

        eventManager.listen(this._player, this._player.Event.RESIZE, () => {
            this._updateRoot({ shouldHandleResize: true });
        });
    }

    public get root(): any {
        return this._rootRef;
    }

    private setRef: Ref<TRoot> = (ref: TRoot) => (this._rootRef = ref);

    private getRendererProps(props: Partial<OverlayUIProps>): OverlayUIProps {
        return {
            currentTime:
                typeof props.currentTime !== "undefined"
                    ? props.currentTime
                    : this._player.currentTime * 1000,
            shouldHandleResize: props.shouldHandleResize || false
        };
    }

    private _updateRoot = ({ shouldHandleResize }: { shouldHandleResize: boolean }): void => {
        if (!this._root) {
            return;
        }

        const rendererProps = this.getRendererProps({ shouldHandleResize });
        this._root = render(this._options.renderer(this.setRef, rendererProps), this._rootParent);
    };

    private _createRoot = (): void => {
        if (this._root) {
            return;
        }

        // TODO check if it changes after media change
        const playerViewId = this._player.config.targetId;
        const playerParentElement = document.querySelector(`div#${playerViewId} div#player-gui`);

        if (!playerParentElement) {
            return;
        }

        this._rootParent = document.createElement("div");
        this._rootParent.setAttribute("id", `${this._plugin.name}Overlay`);
        if (this._options.className) {
            this._rootParent.setAttribute("class", this._options.className);
        }

        playerParentElement.append(this._rootParent);

        const rendererProps = this.getRendererProps({ shouldHandleResize: false });

        this._root = render(this._options.renderer(this.setRef, rendererProps), this._rootParent);
    };
}
