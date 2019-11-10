/// <reference lib="es2015.promise" />
/// <reference path="./es2015/object.d.ts" />
/// <reference path="./player-contrib-config.d.ts" />
/// <reference path="./kaltura-player/player-config.d.ts" />
/// <reference path="./kaltura-player/base-plugin.d.ts" />
/// <reference path="./kaltura-player/base-middleware.d.ts" />
/// <reference path="./kaltura-player/engine-decorator.d.ts" />
/// <reference path="./kaltura-player/logger.d.ts" />
/// <reference path="./kaltura-player/player.d.ts" />
/// <reference path="./kaltura-player/kaltura-player.d.ts" />

export type DeepPartial<T> = T extends object
  ? {[K in keyof T]?: DeepPartial<T[K]>}
  : T;
