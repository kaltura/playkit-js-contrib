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

  private _loadMediaEntryIdWorkaround = '';
  protected _contribPlugin!: TContribPlugin;
  protected _contribServices!: ContribServices;

  constructor(...args: any[]) {
    super(...args);
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

  loadMedia(): void {
    this.eventManager.listenOnce(
      this.player,
      this.player.Event.MEDIA_LOADED,
      () => {
        if (this._loadMediaEntryIdWorkaround) {
          if (
            this._loadMediaEntryIdWorkaround !== this.player.config.sources.id
          ) {
            throw new Error(
              `Current contrib infrastructure does not allow load media of different entries. Expected entry id ${this._loadMediaEntryIdWorkaround}`
            );
          }

          return;
        }

        this._loadMediaEntryIdWorkaround = this.player.config.sources.id;

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
      }
    );
  }

  private _reset() {
    this._contribServices.reset();
    if (hasOnMediaUnload(this._contribPlugin)) {
      try {
        this._contribPlugin.onMediaUnload();
      } catch (e) {
        console.error(`failure during media unload`, {error: e.message});
      }
    }
  }

  public destroy() {
    this._reset();
    this.eventManager.destroy();

    if (hasOnPluginDestroy(this._contribPlugin)) {
      try {
        this._contribPlugin.onPluginDestroy();
      } catch (e) {
        console.error(`failure during plugin destroy`, {error: e.message});
      }
    }
  }

  public reset() {
    if (this._loadMediaEntryIdWorkaround) {
      return;
    }

    this._reset();
  }
}
