// TODO remove dependency on logger as it is relevant to v2 only
import { ScaleCalculation, scaleVideo } from "./scaleVideo";
import { CuepointEngine, log } from "@playkit-js-contrib/common";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

enum ChangeTypes {
    Show = "show",
    Hide = "hide"
}
export type PlayerSize = { width: number; height: number };
export type VideoSize = { width: number; height: number };
type ChangeData<T extends OverlayCuepoint> = {
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

export interface OverlayCuepoint {
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

export type RawOverlayCuepoint = Omit<OverlayCuepoint, "layout">;

export interface OverlayCuepoint extends RawOverlayCuepoint {}

export class CuepointOverlayEngine<
    TRaw extends RawOverlayCuepoint,
    T extends OverlayCuepoint
> extends CuepointEngine<T> {
    private playerSize: PlayerSize | null = null;
    private videoSize: VideoSize | null = null;

    constructor(cuepoints: TRaw[]) {
        super(cuepoints as any); // NOTICE: it is the responsability of this engine not to return cuepoint without layout
    }

    public updateLayout(playerSize: PlayerSize | null, videoSize: VideoSize | null) {
        this.videoSize = videoSize;
        this.playerSize = playerSize;

        this.recalculateCuepointLayout();
        return this.getCurrentCuepointSnapshot();
    }

    private _calculateLayout(cuepoint: TRaw, scaleCalculation: ScaleCalculation): Layout {
        const { rawLayout } = cuepoint;
        return {
            x: scaleCalculation.left + rawLayout.relativeX * scaleCalculation.width,
            y: scaleCalculation.top + rawLayout.relativeY * scaleCalculation.height,
            width: rawLayout.relativeWidth * scaleCalculation.width,
            height: rawLayout.relativeHeight * scaleCalculation.height
        };
    }

    private recalculateCuepointLayout(): void {
        log(
            "debug",
            "CuepointLayoutEngine::recalculateCuepointLayout",
            `calculating cuepoint layout based on video/player sizes`
        );

        if (!this.playerSize || !this.videoSize) {
            log(
                "debug",
                "CuepointLayoutEngine::recalculateCuepointLayout",
                `missing video/player sizes, hide all cuepoint`
            );
            this.enabled = false;
            return;
        }

        const { width: playerWidth, height: playerHeight } = this.playerSize;
        const { width: videoWidth, height: videoHeight } = this.videoSize;
        const canCalcaulateLayout = playerWidth && playerHeight && videoWidth && videoHeight;

        if (!canCalcaulateLayout) {
            log(
                "debug",
                "CuepointLayoutEngine::recalculateCuepointLayout",
                `missing video/player sizes, hide all cuepoint`
            );
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

        log(
            "debug",
            "CuepointLayoutEngine::recalculateCuepointLayout",
            `recalculate cuepoint layout based on new sizes`,
            scaleCalculation
        );

        (this.cuepoints || []).forEach(cuepoint => {
            cuepoint.layout = this._calculateLayout(cuepoint as any, scaleCalculation);
        });

        this.enabled = true;
    }
}
