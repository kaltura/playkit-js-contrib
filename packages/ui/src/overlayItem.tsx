import { h } from "preact";
import { log, PlayerAPI } from "@playkit-js-contrib/common";
import { OverlayItemData, OverlayItemProps, OverlayUIModes } from "./overlayItemData";
import { ManagedComponent } from "./components/managed-component";

export interface OverlayItemOptions {
    playerAPI: PlayerAPI;
    data: OverlayItemData;
}

export class OverlayItem {
    private _destroyed = false;
    private _options: OverlayItemOptions;
    private _isShown = false;
    private _componentRef: ManagedComponent | null = null;

    constructor(options: OverlayItemOptions) {
        this._options = options;
        log("debug", `contrib-ui::OverlayItem:ctor()`, "executed", { options: options });
        this._addPlayerBindings();
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
        log("debug", `plugin-v7::overlayUI.add()`, "executed");
        this._isShown = true;
        // TODO sakal check if need to manually call renderer update or if shown prop is enough
        if (!this._componentRef) {
            return;
        }

        this._componentRef.update();
    };

    /**
     * destory the ui item
     */
    destroy(): void {
        log("debug", `plugin-v7::overlayUI.destroy()`, "executed");
        this._destroyed = true;
        this.remove();
    }

    renderOverlayChild(props: OverlayItemProps) {
        // TODO sakal check if should rename 'name' to 'label'
        const {label} = this._options.data;

       return <ManagedComponent label={label} renderChildren={() => this._options.data.renderContent(props)} isShown={() => this._isShown} ref={ref => (this._componentRef = ref)}>
        </ManagedComponent>;
    }

    private _addPlayerBindings() {
        const {
            playerAPI: { eventManager, kalturaPlayer },
            data
        } = this._options;

        if (data.mode === OverlayUIModes.MediaLoaded) {
            eventManager.listenOnce(kalturaPlayer, kalturaPlayer.Event.MEDIA_LOADED, this.add);
        }

        if (data.mode === OverlayUIModes.FirstPlay) {
            eventManager.listenOnce(kalturaPlayer, kalturaPlayer.Event.FIRST_PLAY, this.add);
        }
    }
}
