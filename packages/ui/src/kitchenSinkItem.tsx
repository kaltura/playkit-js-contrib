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
    private _isActive: boolean = false;

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
        return this._options.data;
    }

    get displayName() {
        return this._options.data.label;
    }

    public update() {
        if (!this._componentRef) {
            return;
        }

        this._componentRef.update();
    }

    public isActive(): boolean {
        return this._options.isActive(this);
    }

    public activate(): void {
        this._options.activate(this);
    }

    private _activationStateChange = ({ state, item }: ItemActiveStateChangeEvent) => {
        // handle only if relevant to this item
        if (this === item) {
            this._isActive = state === ItemActiveStates.Active;
            this.update();
        }
    };

    public deactivate(): void {
        this._options.deactivate(this);
    }

    public renderContentChild = (props: KitchenSinkItemRenderProps): ComponentChild => {
        const { renderContent, label, fitToContainer } = this._options.data;

        return (
            <ManagedComponent
                label={label}
                fitToContainer={false}
                renderChildren={() => (
                    <KitchenSink children={renderContent(props)} isActive={this._isActive} />
                )}
                isShown={() => true}
                ref={ref => (this._componentRef = ref)}
            />
        );
    };
}
