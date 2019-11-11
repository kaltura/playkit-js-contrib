import {PlayerContribRegistry} from '@playkit-js-contrib/common';
import {
  FloatingManager,
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
    return playerContribRegistry.register('ContribServices', () => {
      return new ContribServices(playerContribRegistry, options);
    });
  }

  private _toastManager: ToastManager;
  private _overlayManager: OverlayManager;
  private _bannerManager: BannerManager;
  private _floatingManager: FloatingManager;
  private _kitchenSinkManager: KitchenSinkManager;
  private _upperBarManager: UpperBarManager;
  private _presetManager: PresetManager;
  private _fontManager: FontManager;

  constructor(
    private _playerContribRegistry: PlayerContribRegistry,
    private _options: ContribServicesOptions
  ) {
    this._initialize();
  }

  private _initialize() {
    // TODO sakal use DI instead
    const corePlayer = this._options.corePlayer;
    const kalturaPlayerConfig = corePlayer.config;

    const presetManager = new PresetManager({
      corePlayer,
    });

    const fontManager = new FontManager({
      playerConfig: kalturaPlayerConfig,
    });

    const upperBarManager = new UpperBarManager({
      corePlayer,
      presetManager: presetManager,
    });

    const floatingManager = new FloatingManager({
      corePlayer,
      presetManager,
    });

    const overlayManager = new OverlayManager({
      presetManager,
      corePlayer,
    });

    const bannerManager = new BannerManager({
      corePlayer,
      floatingManager,
    });

    const toastManager = new ToastManager({
      floatingManager,
    });

    const kitchenSinkManager = new KitchenSinkManager({
      corePlayer,
      presetManager,
      upperBarManager,
    });

    this._toastManager = toastManager;
    this._overlayManager = overlayManager;
    this._bannerManager = bannerManager;
    this._floatingManager = floatingManager;
    this._kitchenSinkManager = kitchenSinkManager;
    this._upperBarManager = upperBarManager;
    this._presetManager = presetManager;
    this._fontManager = fontManager;
  }

  public get presetManager(): PresetManager {
    return this._presetManager;
  }

  public get upperBarManager(): UpperBarManager {
    return this._upperBarManager;
  }

  public get kitchenSinkManager(): KitchenSinkManager {
    return this._kitchenSinkManager;
  }

  public get floatingManager(): FloatingManager {
    return this._floatingManager;
  }

  public get overlayManager(): OverlayManager {
    return this._overlayManager;
  }

  public get bannerManager(): BannerManager {
    return this._bannerManager;
  }

  public get toastManager(): ToastManager {
    return this._toastManager;
  }

  public get fontManager(): FontManager {
    return this._fontManager;
  }

  reset(): void {
    // TODO sakal
  }
}
