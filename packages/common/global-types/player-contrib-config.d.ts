declare namespace KalturaPlayerContribTypes {
  export interface ContribConfig {
    contrib?: {
      ui?: {
        kitchenSink: Partial<KitchenSinkConfig>;
        fonts: Partial<ContribFonts>;
        [key: string]: PresetAreasConfig;
      };
    };
  }

  export interface ContribFonts {
    fontFamily: string;
    testingFont: TestingFontOptions;
    downloadData?: {
      name: string;
      url: string;
    };
  }

  export interface KitchenSinkConfig {
    theme: ContribTheme;
    presetAreasMapping?: ContribPresetAreasMapping;
  }

  export interface PresetAreasConfig {
    presetAreasMapping: ContribPresetAreasMapping;
  }

  export interface BannerConfig {
    theme: ContribTheme;
  }

  export interface ContribTheme {
    backgroundColor: string;
    blur: string;
  }

  export interface TestingFontOptions {
    text: string;
    size: number;
    fontName: string;
  }

  export interface ContribPresetAreasMapping {
    [key: string]: {
      [key: string]: string;
    };
  }
}
