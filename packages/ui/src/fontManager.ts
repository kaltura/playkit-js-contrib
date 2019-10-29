import axios from "axios";
import { getContribLogger, ObjectUtils } from "@playkit-js-contrib/common";
import ContribFonts = KalturaPlayerTypes.PlayerConfig.ContribFonts;
import TestingFontOptions = KalturaPlayerTypes.PlayerConfig.TestingFontOptions;

const logger = getContribLogger({
    module: "ui",
    class: "FontManager"
});

const FontKeyPrefix: string = "contrib-plugins-font-";

const DefaultTestingOptions: TestingFontOptions = {
    text: "abcdefghiiiiiiiiijklmnopqrstuvwwwwwwwwwwxyz0123456789",
    size: 72,
    fontName: "monospace"
};

// shared property for indicating current loaded fontFamily to support multiple contrib managers in a single page
// ( multiple players instances )
let currentFontFamily: string = "";

export class FontManager {
    private static _instance: FontManager;

    private constructor() {}

    public static getInstance(): FontManager {
        if (!FontManager._instance) {
            FontManager._instance = new FontManager();
        }
        return FontManager._instance;
    }

    public loadFont(data: ContribFonts): void {
        // a previous request for loading a font was already made
        if (this._isFontLoaded(data.fontFamily)) return;
        try {
            // override player font style
            this._overrideCorePlayerFontStyles(data.fontFamily);
            // making sure no additional calls for loading font will be accepted
            currentFontFamily = data.fontFamily;
            // check if download data exists
            if (!data.downloadData) return;
            if (data.downloadData.name && data.downloadData.url) {
                this._handleFontDownloadProcess(data);
            } else {
                //download data object is incomplete
                logger.warn(
                    "ContribFonts downloadData object should contain both name and url properties.",
                    {
                        method: "loadFont"
                    }
                );
            }
        } catch (err) {
            logger.warn(
                `Failed to load font and override core player style with ${data.fontFamily}`,
                {
                    method: "loadFont",
                    data: {
                        error: err
                    }
                }
            );
        }
    }

    private _overrideCorePlayerFontStyles(fontFamily: string): void {
        const fontCss = `.kaltura-player-container {
                font-family: inherit;
            }         
            .playkit-player {
                font-family: ${fontFamily};
            }
            .playkit-player .playkit-player-gui  {
                font-family: ${fontFamily};
            }
            button, textarea {
                font-family: inherit;
            }`;
        const lastHeadChild = (document.head || document.getElementsByTagName("head")[0])
            .lastElementChild;
        const style = document.createElement("style");
        //adding as last child
        lastHeadChild.parentNode.insertBefore(style, lastHeadChild.nextSibling);
        style.appendChild(document.createTextNode(fontCss));
        logger.info(`Overridden Core player font-family style with: ${fontFamily}`, {
            method: "_overrideCorePlayerFontStyles"
        });
    }

    private _handleFontDownloadProcess(data: ContribFonts): void {
        const configTestingOptions = data.testingFont ? data.testingFont : {};
        const fontTestingOptions = ObjectUtils.mergeDeep(
            DefaultTestingOptions,
            configTestingOptions
        ) as TestingFontOptions;
        // font exists in the system, no need to load / download it
        if (this._checkFontExistence(data.downloadData.name, fontTestingOptions)) {
            logger.info(`Font ${data.downloadData.name} already exists, no need to reload it`, {
                method: "loadFont"
            });
            return;
        }
        // download and inject font
        this._downloadAndCacheFont(data.downloadData.name, data.downloadData.url).then(fontData => {
            if (fontData) {
                this._injectFontRawStyle(data.downloadData.name, fontData);
            }
        });
    }

    private _checkFontExistence(fontName, testingOptions: TestingFontOptions): boolean {
        try {
            // creating an in-memory Canvas element
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            // the text whose final pixel size we want to measure
            const text = testingOptions.text;
            const fontSize = `${testingOptions.size}px`;
            // baseline font
            context.font = `${fontSize} ${testingOptions.fontName}`;
            // size of the baseline text
            const baselineSize = context.measureText(text).width;
            // specifying the font whose existence we want to check
            context.font = `${fontSize} ${fontName},${testingOptions.fontName}`;
            // checking the size of the font we want to check
            const newSize = context.measureText(text).width;
            // If the size of the two text instances is the same, the font does not exist
            // because it is being rendered using the same font
            return newSize !== baselineSize;
        } catch (err) {
            logger.warn(`Failed to determine if font ${fontName} exists in the system.`, {
                method: "_checkFontExistence",
                data: {
                    error: err
                }
            });
            return false;
        }
    }

    private _downloadAndCacheFont(fontName: string, url: string): Promise<string | null> {
        // try to load cached font data from localStorage
        const cachedFontData = this._loadFontFromLocalStorage(fontName);
        if (cachedFontData && cachedFontData !== "") {
            return Promise.resolve(cachedFontData); //todo [sa] why do I get a TS error...
        }

        // download font and cache to localStorage
        return axios
            .get(url)
            .then((result: any) => {
                if (result.data && typeof result.data === "string" && result.data !== "") {
                    logger.info(`font ${fontName} was downloaded successfully`, {
                        method: "_downloadAndCacheFont"
                    });
                    this._saveFontToLocalStorage(`${fontName}`, result.data);
                    return result.data;
                }
                // got an unexpected result
                logger.warn(
                    `failed to downloaded font ${fontName} due to an unexpected font data`,
                    {
                        method: "_downloadAndCacheFont",
                        data: {
                            error: result.data ? result.data : "empty font data"
                        }
                    }
                );
                return null;
            })
            .catch(err => {
                logger.warn(`Failed to download font ${fontName}`, {
                    method: "_downloadFont",
                    data: {
                        error: err
                    }
                });
                return null;
            });
    }

    private _injectFontRawStyle(fontName: string, fontData: string): void {
        try {
            const style = document.createElement("style");
            style.innerHTML = fontData;
            (document.head || document.getElementsByTagName("head")[0]).appendChild(style);
            logger.info(`font "${fontName}" raw data style was injected`, {
                method: "_injectFontRawStyle"
            });
        } catch (err) {
            logger.warn(`Failed to inject font ${fontName} data to core player style.`, {
                method: "_injectFontRawStyle",
                data: {
                    error: err
                }
            });
        }
    }

    private _loadFontFromLocalStorage(fontName: string): string | null {
        try {
            return localStorage.getItem(`${FontKeyPrefix}${fontName}`);
        } catch (err) {
            logger.warn(
                `Failed to load font "${fontName}" data, key: ${FontKeyPrefix}${fontName} from localStorage`,
                {
                    method: "_loadFontFromLocalStorage",
                    data: {
                        error: err
                    }
                }
            );
            return null;
        }
    }

    private _saveFontToLocalStorage(fontName: string, fontValue: string): void {
        try {
            localStorage.setItem(`${FontKeyPrefix}${fontName}`, fontValue);
            logger.info(`font "${fontName}" was cached into localStorage`, {
                method: "_saveFontToLocalStorage"
            });
        } catch (err) {
            logger.warn(`Failed to cache font "${fontName}" into localStorage`, {
                method: "_saveFontToLocalStorage",
                data: {
                    error: err
                }
            });
        }
    }

    private _isFontLoaded(fontFamily: string): boolean {
        if (currentFontFamily === "") return false;
        if (currentFontFamily === fontFamily) {
            logger.info(`${fontFamily} was already loaded and set.`, {
                method: "_isFontLoaded"
            });
        } else {
            logger.warn(
                `This request for loading font will be ignored since
                 an earlier call for loading ${fontFamily} was made.`,
                {
                    method: "_isFontLoaded"
                }
            );
        }
        return true;
    }
}
