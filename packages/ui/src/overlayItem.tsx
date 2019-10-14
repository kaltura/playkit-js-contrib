import { h } from "preact";
import { ContribLogger, getContribLogger } from "@playkit-js-contrib/common";
import { OverlayItemData, OverlayItemProps, OverlayUIModes } from "./overlayItemData";
import { ManagedComponent } from "./components/managed-component";

export interface OverlayItemOptions {
    kalturaPlayer: KalturaPlayerInstance;
    data: OverlayItemData;
}

export class OverlayItem {
    private _destroyed = false;
    private _options: OverlayItemOptions;
    private _isShown = false;
    private _componentRef: ManagedComponent | null = null;
    private _logger: ContribLogger;

    constructor(options: OverlayItemOptions) {
        this._options = options;
        this._logger = getContribLogger({
            module: "contrib-ui",
            class: "OverlayItem",
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

        this._addPlayerBindings();
    }

    get data(): OverlayItemData {
        return this._options.data;
    }

    remove = (): void => {
        this._logger.info("remove item from player", {
            method: "remove"
        });
        this._isShown = false;
        // TODO sakal check if need to manually call renderer update or if shown prop is enough
        if (!this._componentRef) {
            return;
        }

        this._componentRef.update();
    };

    add = (): void => {
        this._logger.info("add item to player", {
            method: "add"
        });
        this._isShown = true;
        // TODO sakal check if need to manually call renderer update or if shown prop is enough
        if (!this._componentRef) {
            return;
        }

        this._componentRef.update();
    };

    public update() {
        if (!this._componentRef) {
            return;
        }

        this._componentRef.update();
    }

    /**
     * destory the ui item
     */
    destroy(): void {
        this._logger.info("destroy item", {
            method: "destroy"
        });
        this._destroyed = true;
        this.remove();
    }

    renderOverlayChild(props: OverlayItemProps) {
        // TODO sakal check if should rename 'name' to 'label'
        const { label } = this._options.data;

        return (
            <ManagedComponent
                label={label}
                renderChildren={() => this._options.data.renderContent(props)}
                isShown={() => this._isShown}
                ref={ref => (this._componentRef = ref)}
            />
        );
    }

    private _handleMediaLoaded = () => {
        const { kalturaPlayer } = this._options;
        kalturaPlayer.removeEventListener(
            kalturaPlayer.Event.MEDIA_LOADED,
            this._handleMediaLoaded
        );
        this.add();
    };

    private _handleFirstPlay = () => {
        const { kalturaPlayer } = this._options;
        kalturaPlayer.removeEventListener(kalturaPlayer.Event.FIRST_PLAY, this._handleFirstPlay);
        this.add();
    };

    private _addPlayerBindings() {
        const { kalturaPlayer, data } = this._options;

        if (data.mode === OverlayUIModes.MediaLoaded) {
            kalturaPlayer.addEventListener(
                kalturaPlayer.Event.MEDIA_LOADED,
                this._handleMediaLoaded
            );
        }

        if (data.mode === OverlayUIModes.FirstPlay) {
            kalturaPlayer.addEventListener(kalturaPlayer.Event.FIRST_PLAY, this._handleFirstPlay);
        }

        if (data.mode === OverlayUIModes.Immediate) {
            this.add();
        }
    }
}
