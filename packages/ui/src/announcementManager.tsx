import { OverlayItem } from "./overlayItem";
import { OverlayManager } from "./overlayManager";
import { PlayerContribServices } from "@playkit-js-contrib/common";
import { OverlayItemProps, OverlayPositions, OverlayUIModes } from "./overlayItemData";
import { ComponentChild, h } from "preact";
import { Announcement } from "./components/announcement";
import { AnnouncementContainer } from "./components/announcement-container";
import { AnnouncementContainerProps } from "./components/announcement-container/announcementContainer";

export interface AnnouncementContent {
    text: string;
    title?: string;
    icon?: any;
}

export interface AnnouncementOptions {
    content: AnnouncementContent;
    autoClose?: boolean;
    duration?: number;
    renderContent?: (
        content: AnnouncementContent,
        overlayItemProps: OverlayItemProps
    ) => ComponentChild;
}

export interface AnnouncementManagerOptions {
    overlayManager: OverlayManager;
}

const ResourceToken: string = "AnnouncementManager-v1";
const DefaultDuration: number = 60 * 1000;
const MinDuration: number = 5 * 1000;

/**
 * Announcement manager manages the display (add / remove) of a single announcement in the player.
 */
export class AnnouncementManager {
    static fromPlayer(
        playerContribServices: PlayerContribServices,
        creator: () => AnnouncementManager
    ) {
        return playerContribServices.register(ResourceToken, 1, creator);
    }

    private _options: AnnouncementManagerOptions;
    private _overlayItem: OverlayItem | null = null;
    private _timerSubscription: any | undefined = undefined;

    constructor(private options: AnnouncementManagerOptions) {
        this._options = options;
    }

    add(props: AnnouncementOptions) {
        if (this._overlayItem) {
            this.remove();
        }
        this._overlayItem = this._options.overlayManager.add({
            label: "announcement",
            mode: OverlayUIModes.Immediate,
            position: OverlayPositions.VisibleArea,
            renderContent: this._createRenderAnnouncement(props, {
                onClose: this._handleCloseEvent.bind(this)
            })
        });
        if (props.autoClose) {
            this._startDurationTimer(props.duration);
        }
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

    private _createRenderAnnouncement(
        { content, renderContent }: AnnouncementOptions,
        { onClose }: AnnouncementContainerProps
    ) {
        function _renderContent(overlayItemProps: OverlayItemProps) {
            return (
                <AnnouncementContainer onClose={onClose}>
                    {renderContent ? (
                        renderContent(content, overlayItemProps)
                    ) : (
                        <Announcement content={content} />
                    )}
                </AnnouncementContainer>
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
}
