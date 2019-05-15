import { OverlayItem } from "./overlayItem";
import { OverlayItemSettings } from "./overlayItemSettings";

export interface OverlayManagerOptions {
    eventManager: any;
    kalturaPlayer: any;
}

export class OverlayManager {
    private _engines: OverlayItem<any>[] = [];

    constructor(private _options: OverlayManagerOptions) {}

    /**
     * initialize new overlay ui item
     * @param item
     */
    add<T>(item: OverlayItemSettings<T>): OverlayItem<T> {
        const engineOptions = {
            ...this._options,
            item
        };
        const engine = new OverlayItem<any>(engineOptions);
        this._engines.push(engine);
        return engine;
    }

    /**
     * remove all ui manager items
     */
    reset(): void {
        this._engines.forEach(item => {
            try {
                item.destroy();
            } catch (e) {
                // TODO log error
                console.warn(e);
            }
        });

        this._engines = [];
    }
}
