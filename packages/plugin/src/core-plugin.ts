import {ContribServices} from './contrib-services';
import {
  ContribPlugin,
  hasOnMediaLoad,
  hasOnMediaUnload,
  hasOnPluginDestroy,
  hasOnPluginSetup,
  hasOnRegisterPresetsComponents,
} from './contrib-plugin';

export class CorePlugin<
  TContribPlugin extends ContribPlugin = ContribPlugin
> extends KalturaPlayer.core.BasePlugin {
  static defaultConfig = {};
  static isValid(player: any) {
    return true;
  }

  protected _contribPlugin!: TContribPlugin;
  protected _contribServices!: ContribServices;

  constructor(...args: any[]) {
    super(...args);
    this.player.addEventListener(
      this.player.Event.MEDIA_LOADED,
      this.handleMediaLoaded
    );
  }

  setContribContext(context: {
    contribPlugin: TContribPlugin;
    contribServices: ContribServices;
  }) {
    this._contribPlugin = context.contribPlugin;
    this._contribServices = context.contribServices;
  }

  private _wasSetupExecuted = false;
  private _wasSetupFailed = false;

  getUIComponents(): any[] {
    if (hasOnRegisterPresetsComponents(this._contribPlugin)) {
      try {
        this._contribPlugin.onRegisterPresetsComponents(
          this._contribServices.presetManager
        );
      } catch (e) {
        console.error(`failed to register contrib presets components`, {
          error: e.message,
        });
      }
    }

    return this._contribServices.presetManager.registerComponents();
  }

  handleMediaLoaded = () => {
    if (!this._wasSetupExecuted) {
      if (hasOnPluginSetup(this._contribPlugin)) {
        try {
          this._contribPlugin.onPluginSetup();
        } catch (e) {
          this._wasSetupFailed = true;
          console.error(`failed to execute plugin setup, suspend plugin`, {
            error: e.message,
          });
        }
      }
      this._wasSetupExecuted = true;
    }

    if (this._wasSetupFailed) {
      return;
    }

    if (hasOnMediaLoad(this._contribPlugin)) {
      try {
        this._contribPlugin.onMediaLoad();
      } catch (e) {
        console.error(`failure during media load `, {error: e.message});
      }
    }
  };

  public destroy() {
    this.reset();
    this.player.removeEventListener(
      this.player.Event.MEDIA_LOADED,
      this.handleMediaLoaded
    );

    if (hasOnPluginDestroy(this._contribPlugin)) {
      try {
        this._contribPlugin.onPluginDestroy();
      } catch (e) {
        console.error(`failure during plugin destroy`, {error: e.message});
      }
    }
  }

  public reset() {
    if (hasOnMediaUnload(this._contribPlugin)) {
      try {
        this._contribPlugin.onMediaUnload();
      } catch (e) {
        console.error(`failure during media unload`, {error: e.message});
      }
    }
  }
}
