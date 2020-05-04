import {h, render} from 'preact';
import {getContribLogger} from '@playkit-js-contrib/common';
import {PresetItemData, RelativeToTypes} from './preset-item-data';
import {ManagedComponent} from './components/managed-component';
import {ContribLogger} from '@playkit-js-contrib/common';
import {InjectedComponent} from './components/injected-component/injected-component';
export interface PresetItemOptions {
  kalturaPlayer: KalturaPlayerTypes.Player;
  data: PresetItemData;
}

export interface PresetItemProps {}

export interface KalturaPlayerPresetComponent {
  label: string;
  presets: string[];
  container: string;
  get: () => () => ManagedComponent;
  afterComponent?: string;
  beforeComponent?: string;
  replaceComponent?: string;
}

export class PresetItem {
  private _options: PresetItemOptions;
  private _logger: ContribLogger;

  constructor(options: PresetItemOptions) {
    this._options = options;
    this._logger = getContribLogger({
      module: 'contrib-ui',
      class: 'PresetItem',
      context: options.data.label,
    });
    this._logger.debug('executed', {
      method: 'constructor',
      data: {
        options,
      },
    });
    this._logger.info(`created item ${options.data.label}`, {
      method: 'constructor',
    });
  }

  get playerConfig(): KalturaPlayerPresetComponent[] {
    const configs: KalturaPlayerPresetComponent[] = [];

    for (const presetType in this._options.data.presetAreas) {
      const presetContainer = this._options.data.presetAreas[presetType];
      const {relativeTo} = this._options.data;

      if (!presetContainer) {
        this._logger.warn(
          `Cannot register component to core player using the preset manager for preset ${presetType}. preset area name is missing. Ignoring this request.`,
          {
            method: 'playerConfig',
          }
        );
        continue;
      }

      const result: KalturaPlayerPresetComponent = {
        label: this._options.data.label,
        presets: [presetType],
        container: presetContainer,
        get: this._render,
      };

      if (relativeTo) {
        switch (relativeTo.type) {
          case RelativeToTypes.After:
            result['afterComponent'] = relativeTo.name;
            break;
          case RelativeToTypes.Before:
            result['beforeComponent'] = relativeTo.name;
            break;
          case RelativeToTypes.Replace:
            result['replaceComponent'] = relativeTo.name;
            break;
        }
      }

      configs.push(result);
    }

    return configs;
  }

  private _render = (): any => {
    if (this._options.data.isolateComponent) {
      const {
        data: {label, fillContainer},
      } = this._options;

      return (
        <InjectedComponent
          label={label}
          fillContainer={fillContainer || false}
          onCreate={this._onCreate}
          onDestroy={this._onDestroy}
        />
      );
    }

    return this._options.data.renderChild();
  };

  private _onDestroy = (options: {
    context?: any;
    parent: HTMLElement;
  }): void => {
    // TODO sakal handle destroy
    if (!options.parent) {
      this._logger.warn(`missing parent argument, aborting element removal`, {
        method: '_onDestroy',
      });
      return;
    }

    this._logger.info(`remove injected contrib preset component`, {
      method: '_onDestroy',
    });

    render(null, options.parent);
  };

  private _onCreate = (options: {context?: any; parent: HTMLElement}): void => {
    try {
      if (!options.parent) {
        this._logger.warn(
          `missing parent argument, aborting element creation`,
          {
            method: '_create',
          }
        );
        return;
      }
      const child = this._options.data.renderChild();

      if (!child) {
        this._logger.warn(
          `child renderer result is invalid, expected element got undefined|null`,
          {
            method: '_create',
          }
        );
        return;
      }

      this._logger.info(`inject contrib preset component`, {
        method: '_create',
      });
      render(child, options.parent);
    } catch (error) {
      this._logger.error(`failed to create injected component.`, {
        method: '_onCreate',
      });
    }
  };
}
