import {FloatingItem} from './floating-item';
import {FloatingManager} from './floating-manager';
import {ObjectUtils} from '@playkit-js-contrib/common';
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
import {getContribConfig} from './contrib-utils';

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
  kalturaPlayer: KalturaPlayerTypes.Player;
}

export interface BannerState {
  visibilityMode: VisibilityMode;
}

export enum VisibilityMode {
  VISIBLE = 'VISIBLE',
  HIDDEN = 'HIDDEN',
}

const MinPlayerWidth = 480;
const DefaultDuration: number = 60 * 1000;
const MinDuration: number = 5 * 1000;

const defaultBannerConfig: BannerConfig = {
  theme: {
    backgroundColor: 'rgba(0, 0, 0, .7)',
    blur: '10px',
  },
};

/**
 * banner manager manages the display (add / remove) of a single banner in the player.
 */
export class BannerManager {
  private _options: BannerManagerOptions;
  private _floatingItem: FloatingItem | null = null;
  private _timerSubscription: any | undefined = undefined;
  private _bannerConfig: BannerConfig;

  constructor(private options: BannerManagerOptions) {
    this._options = options;

    this._bannerConfig = getContribConfig(
      this._options.kalturaPlayer,
      'ui.banner',
      defaultBannerConfig
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
        theme: this._bannerConfig.theme,
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
    {onClose, theme}: BannerContainerProps
  ) {
    function _renderContent(floatingItemProps: FloatingItemProps) {
      return (
        <BannerContainer onClose={onClose} theme={theme}>
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
    const playerSize = getPlayerSize(this._options.kalturaPlayer);
    return {
      visibilityMode:
        !playerSize || playerSize.width < MinPlayerWidth
          ? VisibilityMode.HIDDEN
          : VisibilityMode.VISIBLE,
    };
  }
}
