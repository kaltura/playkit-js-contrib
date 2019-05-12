import { h, render, cloneElement, Ref } from "preact";
import { OVPBasePlugin } from "./ovpBasePlugin";
import { UIManagerItem } from "./uiManager";
import { log } from "@playkit-js/playkit-js-ovp";

export enum OverlayUIModes {
    MediaLoaded = "MediaLoaded",
    OnDemand = "OnDemand",
    FirstPlay = "FirstPlay"
}

export interface OverlayUIOptions {
    mode: OverlayUIModes;
    renderer: (setRef: any, overlayUIProps: OverlayUIProps) => any;
    className?: string;
}

export interface OverlayUIProps {
    currentTime: number;
    shouldHandleResize: boolean;
}

export class OverlayUI<TRoot> implements UIManagerItem {
    private _root: any;
    private _player: any;
    private _rootParent: any;
    private _rootRef: TRoot | null = null;
    private _plugin: any;
    private _destroyed = false;
    private _options: OverlayUIOptions;

    constructor(options: OverlayUIOptions) {
        this._options = options;
        log("debug", `plugin-v7::overlayUI:ctor()`, "executed", { options });
    }

    public setPlugin(plugin: OVPBasePlugin): void {
        this._plugin = plugin;
        this._player = plugin.player;

        this._addPlayerBindings();
    }

    /**
     * trigeer update overlay root component
     */
    public rebuild(): void {
        this._updateRoot({ shouldHandleResize: false });
    }

    public get root(): any {
        return this._rootRef;
    }

    open = (): void => {
        log("debug", `plugin-v7::overlayUI.open()`, "executed");
        this._createRoot();
    };

    close = (): void => {
        log("debug", `plugin-v7::overlayUI.close()`, "executed");
        if (!this._root) {
            return;
        }

        render(
            // @ts-ignore
            h(null),
            this._rootParent,
            this._root
        );

        this._root = null;
    };

    /**
     * destory the ui item
     */
    destroy(): void {
        log("debug", `plugin-v7::overlayUI.destroy()`, "executed");
        this._destroyed = true;
        this.close();
    }

    private _addPlayerBindings() {
        const { eventManager } = this._plugin;

        if (this._options.mode === OverlayUIModes.MediaLoaded) {
            eventManager.listenOnce(this._player, this._player.Event.MEDIA_LOADED, this.open);
        }

        if (this._options.mode === OverlayUIModes.FirstPlay) {
            eventManager.listenOnce(this._player, this._player.Event.FIRST_PLAY, this.open);
            eventManager.listenOnce(this._player, this._player.Event.SEEKED, this.open);
        }

        eventManager.listen(this._player, this._player.Event.TIME_UPDATE, () => {
            this._updateRoot({ shouldHandleResize: false });
        });

        eventManager.listen(
            this._player,
            "resize" /* workaround as this._player.Event.RESIZE returns undefined */,
            () => {
                this._updateRoot({ shouldHandleResize: true });
            }
        );
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
        const root = this._options.renderer(this.setRef, rendererProps);
        this._root = render(root, this._rootParent, this._root);
    };

    private _createRoot = (): void => {
        if (this._destroyed) {
            throw new Error("item was destroyed, cannot create root");
        }

        if (this._root) {
            return;
        }

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
