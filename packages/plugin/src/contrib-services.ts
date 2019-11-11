import {PlayerContribRegistry} from '@playkit-js-contrib/common';
import {
  FloatingManager,
  UIManager,
  UpperBarManager,
  KitchenSinkManager,
  PresetManager,
  BannerManager,
  BannerManagerOptions,
  ToastManager,
  ToastManagerOptions,
  FontManager,
  FontManagerOptions,
  OverlayManager,
} from '@playkit-js-contrib/ui';
import {enableLogIfNeeded} from '@playkit-js-contrib/common';

export interface ContribServicesOptions {
  corePlayer: KalturaPlayerTypes.Player;
}

function getPlayerContribRegistry(corePlayer: any): PlayerContribRegistry {
  return PlayerContribRegistry.get(corePlayer);
}

// TODO SAKAL find more suitable location
enableLogIfNeeded();

export class ContribServices {
  static get(options: ContribServicesOptions): ContribServices {
    const playerContribRegistry = getPlayerContribRegistry(options.corePlayer);
    return playerContribRegistry.register('ContribServices-v1', 1, () => {
      return new ContribServices(playerContribRegistry, options);
    });
  }

  constructor(
    private _playerContribRegistry: PlayerContribRegistry,
    private _options: ContribServicesOptions
  ) {}

  private registerResources() {}

  public get playerContribRegistry(): PlayerContribRegistry {
    return PlayerContribRegistry.get(this._options.corePlayer);
  }

  public get uiManager(): UIManager {
    return UIManager.fromPlayer(
      this.playerContribRegistry,
      (): UIManager => {
        const options = {
          corePlayer: this._options.corePlayer,
          presetManager: this.presetManager,
          upperBarManager: this.upperBarManager,
          kitchenSinkManager: this.kitchenSinkManager,
          floatingManager: this.floatingManager,
          bannerManager: this.bannerManager,
          toastManager: this.toastManager,
          fontManager: this.fontManager,
        };

        return new UIManager(options);
      }
    );
  }

  public get presetManager(): PresetManager {
    return PresetManager.fromPlayer(this.playerContribRegistry, () => {
      const options = {
        corePlayer: this._options.corePlayer,
      };

      return new PresetManager(options);
    });
  }

  public get upperBarManager(): UpperBarManager {
    return UpperBarManager.fromPlayer(this.playerContribRegistry, () => {
      const options = {
        corePlayer: this._options.corePlayer,
        presetManager: this.presetManager,
      };

      return new UpperBarManager(options);
    });
  }

  public get kitchenSinkManager(): KitchenSinkManager {
    return KitchenSinkManager.fromPlayer(this.playerContribRegistry, () => {
      const options = {
        corePlayer: this._options.corePlayer,
        presetManager: this.presetManager,
        upperBarManager: this.upperBarManager,
      };

      return new KitchenSinkManager(options);
    });
  }

  public get floatingManager(): FloatingManager {
    return FloatingManager.fromPlayer(this.playerContribRegistry, () => {
      const options = {
        corePlayer: this._options.corePlayer,
        presetManager: this.presetManager,
      };

      return new FloatingManager(options);
    });
  }

  public get overlayManager(): OverlayManager {
    return OverlayManager.fromPlayer(this.playerContribRegistry, () => {
      const options = {
        presetManager: this.presetManager,
        corePlayer: this._options.corePlayer,
      };

      return new OverlayManager(options);
    });
  }

  public get bannerManager(): BannerManager {
    return BannerManager.fromPlayer(this.playerContribRegistry, () => {
      const options: BannerManagerOptions = {
        corePlayer: this._options.corePlayer,
        floatingManager: this.floatingManager,
      };

      return new BannerManager(options);
    });
  }

  public get toastManager(): ToastManager {
    return ToastManager.fromPlayer(this.playerContribRegistry, () => {
      const options: ToastManagerOptions = {
        floatingManager: this.floatingManager,
      };

      return new ToastManager(options);
    });
  }

  public get fontManager(): FontManager {
    return FontManager.fromPlayer(this.playerContribRegistry, () => {
      const options: FontManagerOptions = {
        playerConfig: this._options.corePlayer.config,
      };

      return new FontManager(options);
    });
  }

  public getPlayerKS(): string | null {
    const {session} = this._options.corePlayer.config;
    return session && session.ks ? session.ks : null;
  }
}
