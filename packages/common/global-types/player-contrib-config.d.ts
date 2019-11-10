/**
 * DEVELOPER NOTICE:
 * - This file includes the available contrib configuration the user can provide.
 * - As this is handled at runtime everything should be optional.
 * - In order to allow proper usage in the application we make sure everything is optional
 * in file `kaltura-player/player.d.ts` using `DeepPartial` on the concrete player
 * decleration.
 *
 * Coding Guidelines
 * ==================
 *
 * 1. You should set optional properties only to those that are optional by design like 'FontsConfig > downloadData`
 * 2. all interfaces should end with `Config` like `FontsConfig, `BannerConfig` etc...
 *
 */

declare namespace KalturaPlayerContribTypes {
  export interface ContribConfig {
    contrib: {
      ui: {
        kitchenSink: KitchenSinkConfig;
        fonts: Partial<FontsConfig>;
        floating: FloatingConfig;
        overlay: OverlayConfig;
        upperBar: UpperBarConfig;
        banner: BannerConfig;
      };
    };
  }

  interface ContribPresetAreasMapping {
    [key: string]: {
      [key: string]: string;
    };
  }

  export interface FloatingConfig {
    presetAreasMapping: ContribPresetAreasMapping;
  }

  export interface UpperBarConfig {
    presetAreasMapping: ContribPresetAreasMapping;
  }

  export interface OverlayConfig {
    presetAreasMapping: ContribPresetAreasMapping;
  }

  export interface FontsConfig {
    fontFamily: string;
    testingFont: TestingFontOptions;
    downloadData?: {
      name: string;
      url: string;
    };
  }

  export interface KitchenSinkConfig {
    theme: {
      backgroundColor: string;
      blur: string;
    };
    presetAreasMapping: ContribPresetAreasMapping;
  }

  export interface BannerConfig {
    theme: {
      backgroundColor: string;
      blur: string;
    };
  }

  export interface TestingFontOptions {
    text: string;
    size: number;
    fontName: string;
  }
}
