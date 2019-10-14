import { OverlayItem } from "./overlayItem";
import { OverlayManager } from "./overlayManager";
import { PlayerContribServices } from "@playkit-js-contrib/common";
import { OverlayItemProps, OverlayPositions, OverlayUIModes } from "./overlayItemData";
import { ComponentChild, h } from "preact";
import { Banner } from "./components/banner";
import { BannerContainer } from "./components/banner-container";
import { BannerContainerProps } from "./components/banner-container/bannerContainer";
import { getPlayerSize } from "./playerUtils";

export interface BannerContent {
    text: string;
    title?: string;
    icon?: any;
}

export interface BannerOptions {
    content: BannerContent;
    autoClose?: boolean;
    duration?: number;
    renderContent?: (content: BannerContent, overlayItemProps: OverlayItemProps) => ComponentChild;
}

export interface BannerManagerOptions {
    overlayManager: OverlayManager;
    kalturaPlayer: KalturaPlayerInstance;
}

export interface BannerState {
    visibilityMode: VisibilityMode;
}

export enum VisibilityMode {
    VISIBLE = "VISIBLE",
    HIDDEN = "HIDDEN"
}

const ResourceToken: string = "BannerManager-v1";
const MinPlayerWidth: number = 480;
const DefaultDuration: number = 60 * 1000;
const MinDuration: number = 5 * 1000;

/**
 * banner manager manages the display (add / remove) of a single banner in the player.
 */
export class BannerManager {
    static fromPlayer(playerContribServices: PlayerContribServices, creator: () => BannerManager) {
        return playerContribServices.register(ResourceToken, 1, creator);
    }

    private _options: BannerManagerOptions;
    private _overlayItem: OverlayItem | null = null;
    private _timerSubscription: any | undefined = undefined;

    constructor(private options: BannerManagerOptions) {
        this._options = options;
    }

    add(props: BannerOptions): BannerState {
        if (this._overlayItem) {
            this.remove();
        }
        this._overlayItem = this._options.overlayManager.add({
            label: "Banner",
            mode: OverlayUIModes.Immediate,
            position: OverlayPositions.InteractiveArea,
            renderContent: this._createRenderBanner(props, {
                onClose: this._handleCloseEvent.bind(this)
            })
        });
        if (props.autoClose) {
            this._startDurationTimer(props.duration);
        }
        return this._getState();
    }

    remove() {
        if (this._overlayItem) {
            if (this._timerSubscription) clearTimeout(this._timerSubscription);
            this._options.overlayManager.remove(this._overlayItem);
            this._overlayItem = null;
        }
    }

    reset() {
        this.remove();
    }

    private _createRenderBanner(
        { content, renderContent }: BannerOptions,
        { onClose }: BannerContainerProps
    ) {
        function _renderContent(overlayItemProps: OverlayItemProps) {
            return (
                <BannerContainer onClose={onClose}>
                    {renderContent ? (
                        renderContent(content, overlayItemProps)
                    ) : (
                        <Banner content={content} />
                    )}
                </BannerContainer>
            );
        }
        return _renderContent;
    }

    private _handleCloseEvent() {
        this.remove();
    }

    private _startDurationTimer(displayDuration: number = DefaultDuration) {
        this._timerSubscription = setTimeout(
            this.remove.bind(this),
            Math.max(MinDuration, displayDuration)
        );
    }

    private _getState(): BannerState {
        let playerSize = getPlayerSize(this._options.kalturaPlayer);
        return {
            visibilityMode:
                !playerSize || playerSize.width < MinPlayerWidth
                    ? VisibilityMode.HIDDEN
                    : VisibilityMode.VISIBLE
        };
    }
}
