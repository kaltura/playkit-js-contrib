import axios from "axios";
import { getContribLogger } from "@playkit-js-contrib/common";
import Fonts = KalturaPlayerTypes.PlayerConfig.Fonts;

const logger = getContribLogger({
    module: "ui",
    class: "FontManager"
});

const FontKeyPrefix: string = "contrib-plugins-font-";

export class FontManager {
    private static _instance: FontManager;

    private _loadedFontData: Fonts;

    private constructor() {}

    public static getInstance(): FontManager {
        if (!FontManager._instance) {
            FontManager._instance = new FontManager();
        }
        return FontManager._instance;
    }

    public loadFont(data: Fonts): void {
        // a previous request for loading a font was already made
        if (this._fontLoaded(data)) return;
        // making sure no additional calls for loading font will be accepted
        this._loadedFontData = data; //todo [sa] should we save the data only on successful flow ???
        // override player font style
        this._overrideCorePlayerFontStyles(data.fontFamily);
        // if download data exists
        if (data.downloadData && data.downloadData.name && data.downloadData.url) {
            // font exists in the system, no need to load / download it
            if (this._checkFontExistence(data.downloadData.name)) {
                logger.info(`Font ${data.downloadData.name} already exists, no need to reload it`, {
                    method: "loadFont"
                });
                return;
            }
            // download and inject font
            try {
                this._downloadAndCacheFont(data.downloadData.url, data.downloadData.name).then(
                    fontData => {
                        if (fontData) {
                            this._injectFontRawStyle(data.downloadData.name, fontData);
                        }
                    }
                );
            } catch (err) {
                logger.warn(
                    `Failed to load and inject font ${data.downloadData.name}
                 from ${data.downloadData.url} to core player style.`,
                    {
                        method: "loadFont",
                        data: {
                            error: err
                        }
                    }
                );
            }
        }
    }

    private _overrideCorePlayerFontStyles(fontFamily: string): void {
        try {
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
        } catch (err) {
            logger.warn(`Failed to override core player font with ${fontFamily}`, {
                method: "_overrideCorePlayerFontStyles",
                data: {
                    error: err
                }
            });
        }
    }

    private _checkFontExistence(fontName): boolean {
        try {
            // creating an in-memory Canvas element
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            // the text whose final pixel size we want to measure
            const text = "abcdefghiiiiiiiiijklmnopqrstuvwwwwwwwwwwxyz0123456789";
            // baseline font
            context.font = `72px monospace`;
            // size of the baseline text
            const baselineSize = context.measureText(text).width;
            // specifying the font whose existence we want to check
            context.font = `72px ${fontName},monospace`;
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

    private _downloadAndCacheFont(url: string, fontName: string): Promise<string | null> {
        // try to load cached font data from localStorage
        const cachedFontData = this._loadFontFromLocalStorage(fontName);
        if (cachedFontData && cachedFontData !== "") {
            return Promise.resolve(cachedFontData);
        }

        // download font and cache to localStorage
        return axios
            .get(url)
            .then((result: any) => {
                if (result.data && typeof result.data === "string" && result.data !== "") {
                    logger.info(`font ${fontName} was downloaded successfully`, {
                        method: "_downloadAndCacheFont"
                    });
                    this._saveFontToLocalStorage(`${FontKeyPrefix}${fontName}`, result.data);
                    return result.data;
                } else {
                    logger.warn(
                        `failed to downloaded font ${fontName} due to unexpected font data`,
                        {
                            method: "_downloadAndCacheFont",
                            data: {
                                error: result.data ? result.data : "empty font data"
                            }
                        }
                    );
                    return null;
                }
            })
            .catch(err => {
                logger.warn(`Failed to download font ${fontName}`, {
                    method: "loadFont -> _downloadFont",
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
            logger.warn(`Faile to inject font ${fontName} data to core plyaer style.`, {
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

    private _fontLoaded(data: Fonts): boolean {
        if (this._loadedFontData) {
            if (this._loadedFontData.fontFamily === data.fontFamily) {
                logger.info(`${data.fontFamily} was already loaded and set.`, {});
            } else {
                logger.warn(
                    `This request for loading font will be ignored since
                 an earlier call for loading ${this._loadedFontData.fontFamily} was made.`,
                    {}
                );
            }
            return true;
        }
        return false;
    }
}
