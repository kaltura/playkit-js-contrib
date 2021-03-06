import {PlayerSize, VideoSize} from './common.types';

export function getPlayerSize(
  kalturaPlayer: KalturaPlayerTypes.Player
): PlayerSize {
  return kalturaPlayer ? kalturaPlayer.dimensions : {width: 0, height: 0};
}

export function getVideoSize(
  kalturaPlayer: KalturaPlayerTypes.Player
): VideoSize {
  if (!kalturaPlayer) {
    return {width: 0, height: 0};
  }

  const videoTrack = kalturaPlayer.getActiveTracks().video;

  if (!videoTrack) {
    return {width: 0, height: 0};
  }

  return {
    width: videoTrack.width,
    height: videoTrack.height,
  };
}
