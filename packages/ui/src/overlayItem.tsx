import { h, render, Ref } from "preact";
import { log } from "@playkit-js/ovp-common";
import { OverlayItemSettings, OverlayItemProps, OverlayUIModes } from "./overlayItemSettings";

export interface OverlayItemOptions {
    eventManager: any;
    kalturaPlayer: any;
    item: OverlayItemSettings<any>;
}

let uniqueIdCounter = 0;

export class OverlayItem<TRoot> {
    private _root: any;
    private _rootParent: any;
    private _rootRef: TRoot | null = null;
    private _destroyed = false;

    constructor(private _options: OverlayItemOptions) {
        log("debug", `ovp-ui::overlayUI:ctor()`, "executed", { options: _options });
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
        const { eventManager, item, kalturaPlayer } = this._options;

        if (item.mode === OverlayUIModes.MediaLoaded) {
            eventManager.listenOnce(kalturaPlayer, kalturaPlayer.Event.MEDIA_LOADED, this.open);
        }

        if (item.mode === OverlayUIModes.FirstPlay) {
            eventManager.listenOnce(kalturaPlayer, kalturaPlayer.Event.FIRST_PLAY, this.open);
            eventManager.listenOnce(kalturaPlayer, kalturaPlayer.Event.SEEKED, this.open);
        }

        eventManager.listen(kalturaPlayer, kalturaPlayer.Event.TIME_UPDATE, () => {
            this._updateRoot({ shouldHandleResize: false });
        });

        eventManager.listen(
            kalturaPlayer,
            "resize" /* workaround as kalturaPlayer.Event.RESIZE returns undefined */,
            () => {
                this._updateRoot({ shouldHandleResize: true });
            }
        );
    }

    private setRef: Ref<TRoot> = (ref: TRoot) => (this._rootRef = ref);

    private getRendererProps(props: Partial<OverlayItemProps>): OverlayItemProps {
        const { kalturaPlayer } = this._options;

        return {
            currentTime:
                typeof props.currentTime !== "undefined"
                    ? props.currentTime
                    : kalturaPlayer.currentTime * 1000,
            shouldHandleResize: props.shouldHandleResize || false
        };
    }

    private _updateRoot = ({ shouldHandleResize }: { shouldHandleResize: boolean }): void => {
        if (!this._root) {
            return;
        }

        const { item } = this._options;

        const rendererProps = this.getRendererProps({ shouldHandleResize });
        const root = item.renderer(this.setRef, rendererProps);
        this._root = render(root, this._rootParent, this._root);
    };

    private _createRoot = (): void => {
        if (this._destroyed) {
            throw new Error("item was destroyed, cannot create root");
        }

        if (this._root) {
            return;
        }

        const { kalturaPlayer, item } = this._options;
        const playerViewId = kalturaPlayer.config.targetId;
        const playerParentElement = document.querySelector(`div#${playerViewId} div#player-gui`);

        if (!playerParentElement) {
            return;
        }

        this._rootParent = document.createElement("div");
        const overlayId = this._getUniqueId();
        this._rootParent.setAttribute("id", `${item.name}OVP${overlayId}Overlay`);
        if (item.className) {
            this._rootParent.setAttribute("class", item.className);
        }

        playerParentElement.append(this._rootParent);

        const rendererProps = this.getRendererProps({ shouldHandleResize: false });

        this._root = render(item.renderer(this.setRef, rendererProps), this._rootParent);
    };

    private _getUniqueId(): number {
        const id = uniqueIdCounter;
        uniqueIdCounter++;
        return id;
    }
}
