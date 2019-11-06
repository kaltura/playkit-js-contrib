import {FloatingItem} from './floating-item';
import {FloatingManager} from './floating-manager';
import {ObjectUtils, PlayerContribRegistry} from '@playkit-js-contrib/common';
import {
  FloatingItemProps,
  FloatingPositions,
  FloatingUIModes,
} from './floating-item-data';
import {ComponentChild, h} from 'preact';
import {Banner} from './components/banner';
import {BannerContainer} from './components/banner-container';
import {BannerContainerProps} from './components/banner-container/banner-container';
import {getPlayerSize} from './player-utils';
import BannerConfig = KalturaPlayerContribTypes.BannerConfig;

export interface BannerContent {
  text: string;
  title?: string;
  icon?: any;
}

export interface BannerOptions {
  content: BannerContent;
  autoClose?: boolean;
  duration?: number;
  renderContent?: (
    content: BannerContent,
    floatingItemProps: FloatingItemProps
  ) => ComponentChild;
}

export interface BannerManagerOptions {
  floatingManager: FloatingManager;
  corePlayer: KalturaPlayerTypes.Player;
}

export interface BannerState {
  visibilityMode: VisibilityMode;
}

export enum VisibilityMode {
  VISIBLE = 'VISIBLE',
  HIDDEN = 'HIDDEN',
}

const ResourceToken = 'BannerManager-v1';
const MinPlayerWidth = 480;
const DefaultDuration: number = 60 * 1000;
const MinDuration: number = 5 * 1000;

const DefaultBannerConfig: BannerConfig = {
  theme: {
    backgroundColor: 'rgba(0, 0, 0, .7)',
    blur: '16px',
  },
};

/**
 * banner manager manages the display (add / remove) of a single banner in the player.
 */
export class BannerManager {
  static fromPlayer(
    playerContribRegistry: PlayerContribRegistry,
    creator: () => BannerManager
  ) {
    return playerContribRegistry.register(ResourceToken, 1, creator);
  }

  private _options: BannerManagerOptions;
  private _floatingItem: FloatingItem | null = null;
  private _timerSubscription: any | undefined = undefined;
  private _bannerConfig: BannerConfig;

  constructor(private options: BannerManagerOptions) {
    this._options = options;

    const playerConfig =
      options.corePlayer &&
      options.corePlayer.config &&
      options.corePlayer.config.contrib &&
      options.corePlayer.config.contrib.ui &&
      options.corePlayer.config.contrib.ui.kitchenSink
        ? options.corePlayer.config.contrib.ui.kitchenSink
        : {};
    this._bannerConfig = ObjectUtils.mergeDefaults<BannerConfig>(
      {},
      DefaultBannerConfig,
      playerConfig
    );
  }

  add(props: BannerOptions): BannerState {
    if (this._floatingItem) {
      this.remove();
    }
    this._floatingItem = this._options.floatingManager.add({
      label: 'Banner',
      mode: FloatingUIModes.Immediate,
      position: FloatingPositions.InteractiveArea,
      renderContent: this._createRenderBanner(props, {
        onClose: this._handleCloseEvent.bind(this),
        bannerConfig: this._bannerConfig,
      }),
    });
    if (props.autoClose) {
      this._startDurationTimer(props.duration);
    }
    return this._getState();
  }

  remove() {
    if (this._floatingItem) {
      if (this._timerSubscription) clearTimeout(this._timerSubscription);
      this._options.floatingManager.remove(this._floatingItem);
      this._floatingItem = null;
    }
  }

  reset() {
    this.remove();
  }

  private _createRenderBanner(
    {content, renderContent}: BannerOptions,
    {onClose, bannerConfig}: BannerContainerProps
  ) {
    function _renderContent(floatingItemProps: FloatingItemProps) {
      return (
        <BannerContainer onClose={onClose} bannerConfig={bannerConfig}>
          {renderContent ? (
            renderContent(content, floatingItemProps)
          ) : (
            <Banner content={content} />
          )}
        </BannerContainer>
      );
    }
    return _renderContent;
  }

  private _handleCloseEvent() {
    this.remove();
  }

  private _startDurationTimer(displayDuration: number = DefaultDuration) {
    this._timerSubscription = setTimeout(
      this.remove.bind(this),
      Math.max(MinDuration, displayDuration)
    );
  }

  private _getState(): BannerState {
    const playerSize = getPlayerSize(this._options.corePlayer);
    return {
      visibilityMode:
        !playerSize || playerSize.width < MinPlayerWidth
          ? VisibilityMode.HIDDEN
          : VisibilityMode.VISIBLE,
    };
  }
}
