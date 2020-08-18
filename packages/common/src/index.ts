/// <reference path="./global.d.ts" />
import 'core-js/features/promise';
import 'core-js/features/object/assign';
import 'core-js/features/object/keys';

Number.isNaN =
  Number.isNaN ||
  function (value) {
    return value !== null && (value != value || +value != value);
  };

export * from './cuepoint-engine';
export * from './player-contrib-registry';
export * from './kaltura-live-services';
export * from './events-manager';
export * from './contrib-logger';
export * from './uuid';
export * from './debouce';
export * from './object-utils';
export * from './kaltura-player-utils';
export * from './array-utils';
