export type Handler = (event?: any) => void;
export type WildcardHandler = (type?: string, event?: any) => void;

export class EventManager {
    private _eventListeners: Record<string, Handler[]> = {};
    private _wildcardEventListeners: WildcardHandler[] = [];

    on(type: string, handler: Handler): void;
    on(type: "*", handler: WildcardHandler): void;
    on(type: string, handler: any): void {
        if (type === "*") {
            this._wildcardEventListeners.push(handler);
            return;
        }

        (this._eventListeners[type] || (this._eventListeners[type] = [])).push(handler);
    }

    off(type: string, handler: Handler): void;
    off(type: "*", handler: WildcardHandler): void;
    off(type: string, handler: any): void {
        if (type === "*") {
            this._wildcardEventListeners.splice(
                this._wildcardEventListeners.indexOf(handler) >>> 0,
                1
            );
            return;
        }

        const eventListeners = this._eventListeners[type];

        if (!eventListeners) {
            return;
        }

        eventListeners.splice(eventListeners.indexOf(handler) >>> 0, 1);
    }

    emit(type: string, event?: any): void {
        (this._eventListeners[type] || []).slice().map(handler => {
            handler(event);
        });
        this._wildcardEventListeners.slice().map(handler => {
            handler(type, event);
        });
    }
}
