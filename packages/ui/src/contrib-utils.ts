import {KalturaPlayerUtils} from '@playkit-js-contrib/common';

export function getContribConfig<T>(
  player: KalturaPlayerTypes.Player,
  path: string,
  baseConfig: T,
  options?: {explicitMerge: string[]}
): T {
  return KalturaPlayerUtils.getPlayerConfig(
    player,
    `contrib.${path}`,
    baseConfig,
    options
  );
}
