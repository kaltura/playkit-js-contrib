import ContribPresetAreasMapping = KalturaPlayerTypes.PlayerConfig.ContribPresetAreasMapping;
import PlayerConfig = KalturaPlayerTypes.PlayerConfig;
import {ObjectUtils} from '@playkit-js-contrib/common';

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
    config: PlayerConfig,
    defaults: ContribPresetAreasMapping
  ): ContribPresetAreasMapping {
    const configMappings =
      config &&
      config.contrib &&
      config.contrib.ui &&
      config.contrib.ui.managers &&
      config.contrib.ui.managers[managerName] &&
      config.contrib.ui.managers[managerName].presetAreasMapping
        ? config.contrib.ui.managers[managerName].presetAreasMapping
        : {};
    return ObjectUtils.explicitFlatMerge<ContribPresetAreasMapping>(
      defaults,
      configMappings
    );
  }
}
