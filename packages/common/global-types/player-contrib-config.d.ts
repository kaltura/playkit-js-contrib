declare namespace KalturaPlayerContribTypes {
  export interface ContribConfig {
    contrib?: {
      ui?: {
        kitchenSink: Partial<KitchenSinkConfig>;
        fonts: Partial<ContribFonts>;
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
}
