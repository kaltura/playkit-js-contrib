// @ts-nocheck
import {PlayerContribRegistry} from '@playkit-js-contrib/common';
import {
  FloatingManager,
  UpperBarManager,
  KitchenSinkManager,
  PresetManager,
  BannerManager,
  ToastManager,
  FontManager,
  OverlayManager,
} from '@playkit-js-contrib/ui';
import {enableLogIfNeeded} from '@playkit-js-contrib/common';

export interface ContribServicesOptions {
  kalturaPlayer: KalturaPlayerTypes.Player;
}

function getPlayerContribRegistry(
  kalturaPlayer: KalturaPlayerTypes.Player
): PlayerContribRegistry {
  return PlayerContribRegistry.get(kalturaPlayer);
}

// TODO SAKAL find more suitable location
enableLogIfNeeded();

export class ContribServices {
  static get(options: ContribServicesOptions): ContribServices {
    const playerContribRegistry = getPlayerContribRegistry(
      options.kalturaPlayer
    );
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
    const kalturaPlayer = this._options.kalturaPlayer;

    const presetManager = new PresetManager({
      kalturaPlayer,
    });

    const fontManager = new FontManager({
      kalturaPlayer,
    });

    const upperBarManager = new UpperBarManager({
      kalturaPlayer,
      presetManager: presetManager,
    });

    const floatingManager = new FloatingManager({
      kalturaPlayer,
      presetManager,
    });

    const overlayManager = new OverlayManager({
      presetManager,
      kalturaPlayer,
    });

    const bannerManager = new BannerManager({
      kalturaPlayer,
      floatingManager,
    });

    const toastManager = new ToastManager({
      floatingManager,
    });

    const kitchenSinkManager = new KitchenSinkManager({
      kalturaPlayer,
      presetManager,
      upperBarManager,
    });

    fontManager.loadFont();

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

  public getPlayerKS(): string | null {
    const {session} = this._options.kalturaPlayer.config;
    return session && session.ks ? session.ks : null;
  }
}
