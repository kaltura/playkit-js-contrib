interface FakeEvent {}

type CoreEventListener = (event: FakeEvent) => boolean | void;

declare namespace KalturaPlayerTypes {
  export interface Player {
    dimensions: {width: number; height: number};
    getActiveTracks(): {video: {width: number; height: number}};
    pause(): void;
    seekToLiveEdge(): void;
    play(): void;
    isLive: () => boolean;
    isDvr: () => boolean;
    dispatchEvent(event: FakeEvent): boolean;
    addEventListener(type: string, listener: CoreEventListener): void;
    removeEventListener: (type: string, listener: CoreEventListener) => void;
    _detachMediaSource(): void;
    _attachMediaSource(): void;
    Event: Record<string, string>;
    currentTime: number;
    duration: number;
    ended: boolean;
    config: KalturaPlayerTypes.PlayerConfig &
      DeepPartial<KalturaPlayerContribTypes.ContribConfig>;
  }
}
