import { PlayerContribServices, UUID } from "@playkit-js-contrib/common";
import { OverlayManager } from "./overlayManager";
import { OverlayItemProps, OverlayPositions, OverlayUIModes } from "./overlayItemData";
import { OverlayItem } from "./overlayItem";
import { ToastProps } from "./components/toast/toast";
import { ToastsContainer } from "./components/toasts-container/toastsContainer";
import { h } from "preact";

export interface ToastsManagerOptions {
    overlayManager: OverlayManager;
}

export enum ToastSeverity {
    Info = "Info",
    Success = "Success",
    Warn = "Warn",
    Error = "Error"
}

export interface ToastItemData {
    title: string;
    text: string;
    icon: any;
    severity: ToastSeverity;
    duration: number;
    onClick: () => void;
}

interface ManagedToasts {
    timerSubscription: any;
    duration: number;
    toastProps: ToastProps;
}

const ResourceToken: string = "ToastsManager-v1";

export class ToastsManager {
    static fromPlayer(playerContribServices: PlayerContribServices, creator: () => ToastsManager) {
        return playerContribServices.register(ResourceToken, 1, creator);
    }

    private _options: ToastsManagerOptions;
    private _toasts: ManagedToasts[] = [];
    private _overlayItem: OverlayItem | null = null;

    constructor(private options: ToastsManagerOptions) {
        this._options = options;
    }

    add(data: ToastItemData): void {
        const { duration, ...props } = data;
        if (!this._overlayItem) this._addToastsContainer();
        let managedToast = {
            toastProps: {
                ...props,
                id: UUID.uuidV1(),
                onClose: this._remove
            },
            duration: duration,
            timerSubscription: null
        };
        this._toasts.push(managedToast);
        this._updateToastsUI();
        this._startDurationTimer(managedToast);
    }

    reset(): void {
        this._toasts.forEach(managedToast => {
            this._remove(managedToast.toastProps.id);
        });
    }

    private _startDurationTimer(managedToast: ManagedToasts): void {
        managedToast.timerSubscription = setTimeout(() => {
            this._remove(managedToast.toastProps.id);
        }, managedToast.duration);
    }

    private _remove = (id: string): void => {
        let index = this._findToastIndexById(id);
        if (index === -1) return;

        clearTimeout(this._toasts[index].timerSubscription);
        this._toasts.splice(index, 1);
        this._updateToastsUI();
        if (this._toasts.length === 0) this._removeToastsContainer();
    };

    private _addToastsContainer(): void {
        this._overlayItem = this._options.overlayManager.add({
            label: "Toasts",
            mode: OverlayUIModes.Immediate,
            position: OverlayPositions.VisibleArea,
            renderContent: () => {
                return (
                    <ToastsContainer
                        toasts={this._toasts.map(toast => {
                            return toast.toastProps;
                        })}
                    />
                );
            }
        });
    }

    private _removeToastsContainer(): void {
        if (!this._overlayItem) return;

        this._options.overlayManager.remove(this._overlayItem);
        this._overlayItem = null;
    }

    private _updateToastsUI(): void {
        if (this._overlayItem) this._overlayItem.update();
    }

    private _findToastIndexById(id: string): number {
        let index = 0;
        while (index < this._toasts.length) {
            if (this._toasts[index].toastProps.id === id) {
                return index;
            }
            index++;
        }
        return -1;
    }
}
