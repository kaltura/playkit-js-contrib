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

  const videoElement = kalturaPlayer.getVideoElement();

  if (!videoElement) {
    return {width: 0, height: 0};
  }

  return {
    width: videoElement.videoWidth,
    height: videoElement.videoHeight,
  };
}
