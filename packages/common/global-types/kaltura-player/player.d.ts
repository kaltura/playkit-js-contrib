interface FakeEvent {}

type CoreEventListener = (event: FakeEvent) => boolean | void;

declare namespace KalturaPlayerTypes {
  export interface Player {
    pause(): void;
    play(): void;
    dispatchEvent(event: FakeEvent): boolean;
    addEventListener(type: string, listener: CoreEventListener): void;
    removeEventListener: (type: string, listener: CoreEventListener) => void;
    Event: Record<string, string>;
    currentTime: number;
    duration: number;
    config: KalturaPlayerTypes.PlayerConfig &
      KalturaPlayerContribTypes.ContribConfig;
  }
}
