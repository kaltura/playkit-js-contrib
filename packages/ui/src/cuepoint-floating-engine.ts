import {ScaleCalculation, scaleVideo} from './scale-video';
import {CuepointEngine} from '@playkit-js-contrib/common';
import {PlayerSize, VideoSize} from './common.types';
import {getContribLogger} from '@playkit-js-contrib/common';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

enum ChangeTypes {
  Show = 'show',
  Hide = 'hide',
}
type ChangeData<T extends FloatingCuepoint> = {
  time: number;
  type: ChangeTypes;
  cuePoint: T;
};

const reasonableSeekThreshold = 2000;

export interface Layout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FloatingCuepoint {
  id: string;
  startTime: number;
  endTime?: number;
  rawLayout: {
    relativeX: number;
    relativeY: number;
    relativeWidth: number;
    relativeHeight: number;
    stageWidth: number;
    stageHeight: number;
  };
  layout: Layout;
}

export type RawFloatingCuepoint = Omit<FloatingCuepoint, 'layout'>;

export interface FloatingCuepoint extends RawFloatingCuepoint {}

const logger = getContribLogger({
  module: 'contrib-ui',
  class: 'CuepointFloatingEngine',
});

export class CuepointFloatingEngine<
  TRaw extends RawFloatingCuepoint,
  T extends FloatingCuepoint
> extends CuepointEngine<T> {
  private playerSize: PlayerSize | null = null;
  private videoSize: VideoSize | null = null;

  constructor(cuepoints: TRaw[]) {
    super(cuepoints as any); // NOTICE: it is the responsability of this engine not to return cuepoint without layout
  }

  public updateLayout(
    playerSize: PlayerSize | null,
    videoSize: VideoSize | null
  ) {
    this.videoSize = videoSize;
    this.playerSize = playerSize;

    this.recalculateCuepointLayout();
    return this.getCurrentCuepointSnapshot();
  }

  private _calculateLayout(
    cuepoint: TRaw,
    scaleCalculation: ScaleCalculation
  ): Layout {
    const {rawLayout} = cuepoint;
    return {
      x: scaleCalculation.left + rawLayout.relativeX * scaleCalculation.width,
      y: scaleCalculation.top + rawLayout.relativeY * scaleCalculation.height,
      width: rawLayout.relativeWidth * scaleCalculation.width,
      height: rawLayout.relativeHeight * scaleCalculation.height,
    };
  }

  private recalculateCuepointLayout(): void {
    logger.debug('calculating cuepoint layout based on video/player sizes', {
      method: 'recalculateCuepointLayout',
    });

    if (!this.playerSize || !this.videoSize) {
      logger.warn('missing video/player sizes, hide all cuepoint', {
        method: 'recalculateCuepointLayout',
      });
      this.enabled = false;
      return;
    }

    const {width: playerWidth, height: playerHeight} = this.playerSize;
    const {width: videoWidth, height: videoHeight} = this.videoSize;
    const canCalcaulateLayout =
      playerWidth && playerHeight && videoWidth && videoHeight;

    if (!canCalcaulateLayout) {
      logger.warn('missing video/player sizes, hide all cuepoint', {
        method: 'recalculateCuepointLayout',
      });
      this.enabled = false;
      return;
    }

    const scaleCalculation = scaleVideo(
      videoWidth,
      videoHeight,
      playerWidth,
      playerHeight,
      true
    );

    logger.debug('recalculate cuepoint layout based on new sizes', {
      method: 'recalculateCuepointLayout',
      data: {
        scaleCalculation,
      },
    });

    (this.cuepoints || []).forEach(cuepoint => {
      cuepoint.layout = this._calculateLayout(
        cuepoint as any,
        scaleCalculation
      );
    });

    this.enabled = true;
  }
}
