import { h, ComponentChild, Ref } from "preact";
import { getContribLogger } from "@playkit-js-contrib/common";
import { KitchenSinkItemData } from "./kitchenSinkItemData";
import { ManagedComponent } from "./components/managed-component";
import { ContribLogger } from '@playkit-js-contrib/common';

export interface KitchenSinkItemOptions {
    data: KitchenSinkItemData;
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
            module: 'contrib-ui',
            class: 'KitchenSinkItem',
            context: options && options.data && options.data.label
        });
        this._logger.debug('executed', {
            method: 'constructor',
            data: {
                options
            }
        });

        this._logger.info(`created item ${options.data.label}`, {
            method: 'constructor'
        });
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

    public renderContentChild = (props: KitchenSinkItemRenderProps): ComponentChild => {
        const {
            renderContent, label } = this._options.data;
        return (
            <ManagedComponent label={label} renderChildren={() => renderContent(props)} isShown={() => true} ref={ref => (this._componentRef = ref)}>
            </ManagedComponent>
        );
    };
}
