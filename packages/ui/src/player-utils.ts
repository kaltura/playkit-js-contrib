import {PlayerSize, VideoSize} from './common.types';

export function getPlayerSize(corePlayer: any): PlayerSize {
  return corePlayer ? corePlayer.dimensions : {width: 0, height: 0};
}

export function getVideoSize(corePlayer: any): VideoSize {
  if (!corePlayer) {
    return {width: 0, height: 0};
  }

  const videoTrack = corePlayer.getActiveTracks().video;

  if (!videoTrack) {
    return {width: 0, height: 0};
  }

  return {
    width: videoTrack.width,
    height: videoTrack.height,
  };
}
