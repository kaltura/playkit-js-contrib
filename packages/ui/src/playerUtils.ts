import { PlayerSize, VideoSize } from "./common.types";

export function getPlayerSize(kalturaPlayer: any): PlayerSize {
    return kalturaPlayer ? kalturaPlayer.dimensions : { width: 0, height: 0 };
}

export function getVideoSize(kalturaPlayer: any): VideoSize {
    if (!kalturaPlayer) {
        return { width: 0, height: 0 };
    }

    const videoTrack = kalturaPlayer.getActiveTracks().video;

    if (!videoTrack) {
        return { width: 0, height: 0 };
    }

    return {
        width: videoTrack.width,
        height: videoTrack.height
    };
}
