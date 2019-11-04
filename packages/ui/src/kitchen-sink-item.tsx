import {ComponentChild, h} from 'preact';
import {
  ContribLogger,
  getContribLogger,
  EventsManager,
} from '@playkit-js-contrib/common';
import {KitchenSinkItemData} from './kitchen-sink-item-data';
import {ManagedComponent} from './components/managed-component';
import {
  EventTypes,
  ItemActiveStateChangeEvent,
  KitchenSinkEvents,
} from './kitchen-sink-manager';
import {KitchenSink} from './components/kitchen-sink';

export interface KitchenSinkItemOptions {
  data: KitchenSinkItemData;
  isActive: (item: KitchenSinkItem) => boolean;
  activate: (item: KitchenSinkItem) => void;
  deactivate: (item: KitchenSinkItem) => void;
  eventManager: EventsManager<KitchenSinkEvents>;
}

export interface KitchenSinkItemRenderProps {
  onClose: () => void;
}

export class KitchenSinkItem {
  private _options: KitchenSinkItemOptions;
  private _componentRef: ManagedComponent | null = null;
  private _logger: ContribLogger;
  private _destroyed = false;

  constructor(options: KitchenSinkItemOptions) {
    this._options = options;
    this._logger = getContribLogger({
      module: 'contrib-ui',
      class: 'KitchenSinkItem',
      context: options && options.data && options.data.label,
    });
    this._logger.debug('executed', {
      method: 'constructor',
      data: {
        options,
      },
    });

    this._logger.info(`created item ${options.data.label}`, {
      method: 'constructor',
    });

    this._options.eventManager.on(
      EventTypes.ItemActiveStateChangeEvent,
      this._activationStateChange
    );
  }

  get data() {
    if (this._isDestroyed()) {
      return;
    }
    return this._options.data;
  }

  get displayName() {
    if (this._isDestroyed()) {
      return;
    }
    return this._options.data.label;
  }

  public update() {
    if (this._isDestroyed()) {
      return;
    }

    if (!this._componentRef) {
      return;
    }

    this._componentRef.update();
  }

  public isActive(): boolean {
    if (this._isDestroyed()) {
      return;
    }

    return this._options.isActive(this);
  }

  public activate(): void {
    if (this._isDestroyed()) {
      return;
    }

    this._options.activate(this);
  }

  private _activationStateChange = ({item}: ItemActiveStateChangeEvent) => {
    // handle only if relevant to this item
    if (this === item) {
      this.update();
    }
  };

  public deactivate(): void {
    if (this._isDestroyed()) {
      return;
    }

    this._options.deactivate(this);
  }

  public _destroy(): void {
    if (this._isDestroyed()) {
      return;
    }

    this._options.eventManager.off(
      EventTypes.ItemActiveStateChangeEvent,
      this._activationStateChange
    );
    this.update();
    this._componentRef = null;
    this._options = null;
    this._destroyed = true;
  }

  public renderContentChild = (
    props: KitchenSinkItemRenderProps
  ): ComponentChild => {
    if (this._isDestroyed()) {
      return;
    }

    const {renderContent, label} = this._options.data;

    return (
      <ManagedComponent
        label={label}
        fillContainer={false}
        renderChildren={() => (
          <KitchenSink
            children={renderContent(props)}
            isActive={this.isActive()}
          />
        )}
        isShown={() => !this._destroyed}
        ref={ref => (this._componentRef = ref)}
      />
    );
  };

  private _isDestroyed(): boolean {
    if (this._destroyed) {
      this._logger.warn(
        `can't perform requested call, item was marked as destroyed`,
        {}
      );
      return true;
    }
    return false;
  }
}
