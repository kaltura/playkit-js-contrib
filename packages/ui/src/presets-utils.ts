import PlayerConfig = KalturaPlayerTypes.PlayerConfig;
import {ObjectUtils} from '@playkit-js-contrib/common';
import ContribPresetAreasMapping = KalturaPlayerContribTypes.ContribPresetAreasMapping;

export interface GroupPresetAreasOptions {
  presetAreasMapping: KalturaPlayerContribTypes.ContribPresetAreasMapping;
  acceptableTypes: string[];
}

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
          // todo [sa] add warning
        } else {
          result[presetType][presetName] =
            presetAreasMapping[presetName][presetType];
        }
      });
    });
    return result;
  }
}
