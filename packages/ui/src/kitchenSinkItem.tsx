import { h, ComponentChild, Ref } from "preact";
import { log } from "@playkit-js-contrib/common";
import { KitchenSinkItemData } from "./kitchenSinkItemData";
import { ManagedComponent } from "./components/managed-component";

export interface KitchenSinkItemOptions {
    data: KitchenSinkItemData;
}

export interface KitchenSinkItemRenderProps {
    onClose: () => void;
}

export class KitchenSinkItem {
    private _options: KitchenSinkItemOptions;
    private _componentRef: ManagedComponent | null = null;
    constructor(options: KitchenSinkItemOptions) {
        this._options = options;
        log("debug", `contrib-ui::KitchenSinkItem:ctor()`, "executed", { options });
    }

    get displayName() {
        return this._options.data.name;
    }

    public update() {
        if (!this._componentRef) {
            return;
        }

        this._componentRef.update();
    }

    public render = (props: KitchenSinkItemRenderProps): ComponentChild => {
        const {
            contentRenderer } = this._options.data;
        return (
            <ManagedComponent label={'kitchen sink'} renderChildren={() => contentRenderer(props)} shown={true} ref={ref => (this._componentRef = ref)}>
            </ManagedComponent>
        );
    };
}
