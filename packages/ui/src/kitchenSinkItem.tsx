import { h, ComponentChild, Ref } from "preact";
import { getContribLogger } from "@playkit-js-contrib/common";
import {
    KitchenSinkExpandModes,
    KitchenSinkItemData,
    KitchenSinkPositions
} from "./kitchenSinkItemData";
import { ManagedComponent } from "./components/managed-component";
import { ContribLogger } from "@playkit-js-contrib/common";
import { KitchenSinkAdapter } from "./components/kitchen-sink-adapter";

export interface KitchenSinkItemOptions {
    data: KitchenSinkItemData;
    isExpanded: (position: KitchenSinkPositions) => boolean;
    expand: (position: KitchenSinkPositions, expandMode: KitchenSinkExpandModes) => void;
}

export interface KitchenSinkItemRenderProps {
    onClose: () => void;
}

export class KitchenSinkItem {
    private _options: KitchenSinkItemOptions;
    private _componentRef: ManagedComponent | null = null;
    private _logger: ContribLogger;

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
        return this._options.isExpanded(this._options.data.position);
    }

    public activate(): void {
        this._options.expand(this._options.data.position, this._options.data.expandMode);
    }

    public renderContentChild = (props: KitchenSinkItemRenderProps): ComponentChild => {
        const { renderContent, label, fillContainer } = this._options.data;

        return (
            <ManagedComponent
                label={label}
                fillContainer={typeof fillContainer === "boolean" ? fillContainer : true}
                renderChildren={() => renderContent(props)}
                isShown={() => true}
                ref={ref => (this._componentRef = ref)}
            />
        );
    };
}
