import { ComponentChild, h } from "preact";
import { ContribLogger, getContribLogger, Handler } from "@playkit-js-contrib/common";
import { KitchenSinkItemData } from "./kitchenSinkItemData";
import { ManagedComponent } from "./components/managed-component";
import { EventTypes, ItemActiveStateChangeEvent, ItemActiveStates } from "./kitchenSinkManager";
import { KitchenSink } from "./components/kitchen-sink";

export interface KitchenSinkItemOptions {
    data: KitchenSinkItemData;
    isActive: (item: KitchenSinkItem) => boolean;
    activate: (item: KitchenSinkItem) => void;
    deactivate: (item: KitchenSinkItem) => void;
    onActivationStateChange: (
        type: EventTypes,
        handler: Handler<ItemActiveStateChangeEvent>
    ) => void;
    unregisterActivationStateChange: (
        type: EventTypes,
        handler: Handler<ItemActiveStateChangeEvent>
    ) => void;
}

export interface KitchenSinkItemRenderProps {
    onClose: () => void;
}

export class KitchenSinkItem {
    private _options: KitchenSinkItemOptions;
    private _componentRef: ManagedComponent | null = null;
    private _logger: ContribLogger;
    private _destroyed: boolean = false;

    constructor(options: KitchenSinkItemOptions) {
        this._options = options;
        this._logger = getContribLogger({
            module: "contrib-ui",
            class: "KitchenSinkItem",
            context: options && options.data && options.data.label
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

        this._options.onActivationStateChange(
            EventTypes.ItemActiveStateChangeEvent,
            this._activationStateChange
        );
    }

    get data() {
        if (this._destroyed) {
            this._logger.warn(`cannot perform requested call, item was marked as destroyed`, {});
            return;
        }
        return this._options.data;
    }

    get displayName() {
        if (this._destroyed) {
            this._logger.warn(`cannot perform requested call, item was marked as destroyed`, {});
            return;
        }
        return this._options.data.label;
    }

    public update() {
        if (this._destroyed) {
            this._logger.warn(`cannot perform requested call, item was marked as destroyed`, {});
            return;
        }
        if (!this._componentRef) {
            return;
        }

        this._componentRef.update();
    }

    public isActive(): boolean {
        if (this._destroyed) {
            this._logger.warn(`cannot perform requested call, item was marked as destroyed`, {});
            return;
        }
        return this._options.isActive(this);
    }

    public activate(): void {
        if (this._destroyed) {
            this._logger.warn(`cannot perform requested call, item was marked as destroyed`, {});
            return;
        }
        this._options.activate(this);
    }

    private _activationStateChange = ({ item }: ItemActiveStateChangeEvent) => {
        // handle only if relevant to this item
        if (this === item) {
            this.update();
        }
    };

    public deactivate(): void {
        if (this._destroyed) {
            this._logger.warn(`cannot perform requested call, item was marked as destroyed`, {});
            return;
        }
        this._options.deactivate(this);
    }

    public destroy(): void {
        if (this._destroyed) {
            this._logger.warn(`cannot perform requested call, item was marked as destroyed`, {});
            return;
        }
        this._options.unregisterActivationStateChange(
            EventTypes.ItemActiveStateChangeEvent,
            this._activationStateChange
        );
        this.update();
        this._componentRef = null;
        this._options = null;
        this._destroyed = true;
    }

    public renderContentChild = (props: KitchenSinkItemRenderProps): ComponentChild => {
        if (this._destroyed) {
            this._logger.warn(`cannot perform requested call, item was marked as destroyed`, {});
            return;
        }

        const { renderContent, label } = this._options.data;

        return (
            <ManagedComponent
                label={label}
                fillContainer={false} //todo [sa] is it OK ?????
                renderChildren={() => (
                    <KitchenSink children={renderContent(props)} isActive={this.isActive()} />
                )}
                isShown={() => !this._destroyed}
                ref={ref => (this._componentRef = ref)}
            />
        );
    };
}
