import PlayerConfig = KalturaPlayerTypes.PlayerConfig;
import {ObjectUtils} from '@playkit-js-contrib/common';
import ContribPresetAreasMapping = KalturaPlayerContribTypes.ContribPresetAreasMapping;

export interface GroupPresetAreasOptions {
  managerName: string;
  config: PlayerConfig;
  defaults: ContribPresetAreasMapping;
  acceptableTypes: string[];
}

export class PresetsUtils {
  public static groupPresetAreasByType(
    options: GroupPresetAreasOptions
  ): ContribPresetAreasMapping {
    const {managerName, config, defaults, acceptableTypes} = options;
    const presetAreasMapping = PresetsUtils.getPresetAreasMapping(
      managerName,
      config,
      defaults
    );
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

  private static getPresetAreasMapping(
    managerName: string,
    config: KalturaPlayerTypes.PlayerConfig &
      KalturaPlayerContribTypes.ContribConfig,
    defaults: KalturaPlayerContribTypes.ContribPresetAreasMapping
  ): ContribPresetAreasMapping {
    const configMappings = ObjectUtils.get(
      config,
      `contrib.ui.${managerName}.presetAreasMapping`,
      defaults
    ) as Partial<KalturaPlayerContribTypes.ContribPresetAreasMapping>;
    return ObjectUtils.explicitFlatMerge<ContribPresetAreasMapping>(
      defaults,
      configMappings
    );
  }
}
