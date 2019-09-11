import { OverlayItem } from "./overlayItem";
import { OverlayManager } from "./overlayManager";
import { PlayerAPI, PlayerContribServices } from "@playkit-js-contrib/common";
import { OverlayItemProps, OverlayPositions, OverlayUIModes } from "./overlayItemData";
import { ComponentChild, h } from "preact";
import { FloatingNotification } from "./components/floating-notification";
import { FloatingNotificationContainer } from "./components/floating-notification-container";
import { FloatingNotificationContainerProps } from "./components/floating-notification-container/floatingNotificationContainer";
import { getPlayerSize } from "./playerUtils";

export interface FloatingNotificationContent {
    text: string;
    title?: string;
    icon?: any;
}

export interface FloatingNotificationOptions {
    content: FloatingNotificationContent;
    autoClose?: boolean;
    duration?: number;
    renderContent?: (
        content: FloatingNotificationContent,
        overlayItemProps: OverlayItemProps
    ) => ComponentChild;
}

export interface FloatingNotificationManagerOptions {
    overlayManager: OverlayManager;
    playerApi: PlayerAPI;
}

export interface FloatingNotificationState {
    visibilityMode: VisibilityMode;
}

export enum VisibilityMode {
    VISIBLE = "VISIBLE",
    HIDDEN = "HIDDEN"
}

const ResourceToken: string = "FloatingNotificationManager-v1";
const MinPlayerWidth: number = 480;
const DefaultDuration: number = 60 * 1000;
const MinDuration: number = 5 * 1000;

/**
 * FloatingNotification manager manages the display (add / remove) of a single floatingNotification in the player.
 */
export class FloatingNotificationManager {
    static fromPlayer(
        playerContribServices: PlayerContribServices,
        creator: () => FloatingNotificationManager
    ) {
        return playerContribServices.register(ResourceToken, 1, creator);
    }

    private _options: FloatingNotificationManagerOptions;
    private _overlayItem: OverlayItem | null = null;
    private _timerSubscription: any | undefined = undefined;

    constructor(private options: FloatingNotificationManagerOptions) {
        this._options = options;
    }

    add(props: FloatingNotificationOptions): FloatingNotificationState {
        if (this._overlayItem) {
            this.remove();
        }
        this._overlayItem = this._options.overlayManager.add({
            label: "floatingNotification",
            mode: OverlayUIModes.Immediate,
            position: OverlayPositions.VisibleArea,
            renderContent: this._createRenderFloatingNotification(props, {
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

    private _createRenderFloatingNotification(
        { content, renderContent }: FloatingNotificationOptions,
        { onClose }: FloatingNotificationContainerProps
    ) {
        function _renderContent(overlayItemProps: OverlayItemProps) {
            return (
                <FloatingNotificationContainer onClose={onClose}>
                    {renderContent ? (
                        renderContent(content, overlayItemProps)
                    ) : (
                        <FloatingNotification content={content} />
                    )}
                </FloatingNotificationContainer>
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

    private _getState(): FloatingNotificationState {
        let playerSize = getPlayerSize(this._options.playerApi.kalturaPlayer);
        return {
            visibilityMode:
                !playerSize || playerSize.width < MinPlayerWidth
                    ? VisibilityMode.HIDDEN
                    : VisibilityMode.VISIBLE
        };
    }
}
