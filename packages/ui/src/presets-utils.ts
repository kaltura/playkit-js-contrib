import PlayerConfig = KalturaPlayerTypes.PlayerConfig;
import {getContribLogger, ObjectUtils} from '@playkit-js-contrib/common';
import ContribPresetAreasMapping = KalturaPlayerContribTypes.ContribPresetAreasMapping;

export interface GroupPresetAreasOptions {
  presetAreasMapping: KalturaPlayerContribTypes.ContribPresetAreasMapping;
  acceptableTypes: string[];
}

const logger = getContribLogger({
  module: 'contrib-ui',
  class: 'PresetsUtils',
});

export class PresetsUtils {
  public static groupPresetAreasByType(
    options: GroupPresetAreasOptions
  ): ContribPresetAreasMapping {
    const {presetAreasMapping, acceptableTypes} = options;

    const result = {};
    acceptableTypes.forEach(presetType => (result[presetType] = {}));
    Object.keys(presetAreasMapping).forEach(presetName => {
      Object.keys(presetAreasMapping[presetName]).forEach(presetType => {
        if (acceptableTypes.indexOf(presetType) === -1) {
          logger.warn(
            `Unknown preset area type '${presetType}' provided, ignoring specific type mapping. Acceptable values are '${acceptableTypes.join(
              ', '
            )}`,
            {}
          );
        } else {
          result[presetType][presetName] =
            presetAreasMapping[presetName][presetType];
        }
      });
    });
    return result;
  }
}
