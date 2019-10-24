import axios from "axios";
import { getContribLogger } from "@playkit-js-contrib/common";
import PlayerConfig = KalturaPlayerTypes.PlayerConfig;

const logger = getContribLogger({
    module: "ui",
    class: "FontManager"
});

const FontKeyPrefix: string = "contrib-plugins-font-";

export class FontManager {
    private static _instance: FontManager;

    private _loadedFontName: string;

    private constructor() {}

    public static getInstance(): FontManager {
        if (!FontManager._instance) {
            FontManager._instance = new FontManager();
        }
        return FontManager._instance;
    }

    public loadFont(data: PlayerConfig.Fonts): void {
        // if download data exists
        if (data.downloadData && data.downloadData.name && data.downloadData.url) {
            // font was already loaded and it's style was already injected
            if (data.downloadData.name === this._loadedFontName) {
                logger.info(`Font ${data.downloadData.name} was already loaded in page`, {
                    method: "loadFont"
                });
                return;
            }
            // font exists in the system, no need to load / download it
            if (this._checkFontExistence(data.downloadData.name)) {
                logger.info(`Font ${data.downloadData.name} already exists`, {
                    method: "loadFont"
                });
                this._overrideCorePlayerFontStyles(data.fontFamily);
                return;
            }
            // font data was cached to localStorage
            const cachedFontValue = this._loadFontFromLocalStorage(
                `${FontKeyPrefix}${data.downloadData.name}`
            );
            if (cachedFontValue && cachedFontValue !== "") {
                this._injectFontRawStyle(cachedFontValue);
                this._overrideCorePlayerFontStyles(data.fontFamily);
                this._loadedFontName = data.downloadData.name;
                return;
            }
            // font needs to be downloaded
            this._downloadAndCacheFont(data.downloadData.url, data.downloadData.name)
                .then(fontData => {
                    if (fontData) {
                        this._injectFontRawStyle(fontData);
                        this._overrideCorePlayerFontStyles(data.fontFamily);
                        this._loadedFontName = data.downloadData.name;
                    }
                    //todo [sa] should we override core player font style even if we don't have the font ???
                })
                .catch(err => {
                    logger.error(`Failed to download font`, {
                        method: "loadFont -> _downloadFont",
                        data: {
                            error: err
                        }
                    });
                    //todo [sa] should we override core player font style even if we don't have the font ???
                });
        } else {
            // no download data exists, only override core player font style
            this._overrideCorePlayerFontStyles(data.fontFamily);
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
    }

    private _checkFontExistence(fontName): boolean {
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
    }

    private _downloadAndCacheFont(url: string, fontName: string): Promise<string | null> {
        return axios.get(url).then((result: any) => {
            if (result.data && typeof result.data === "string") {
                logger.info(`font ${fontName} was downloaded successfully`, {
                    method: "_downloadAndCacheFont"
                });
                this._saveFontToLocalStorage(`${FontKeyPrefix}${fontName}`, result.data);
                return result.data;
            } else {
                logger.error(`failed to downloaded font ${fontName}`, {
                    method: "_downloadAndCacheFont"
                });
                return null;
            }
        });
    }

    private _injectFontRawStyle(fontValue: string): void {
        const style = document.createElement("style");
        style.innerHTML = fontValue;
        (document.head || document.getElementsByTagName("head")[0]).appendChild(style);
        logger.info(`font raw style was injected`, {
            method: "_injectFontRawStyle"
        });
    }

    private _loadFontFromLocalStorage(fontKey: string): string | null {
        try {
            return localStorage.getItem(fontKey);
        } catch (err) {
            logger.error(`Error loading font from localStorage`, {
                method: "_loadFontFromLocalStorage",
                data: {
                    error: err
                }
            });
            return null;
        }
    }

    private _saveFontToLocalStorage(fontKey: string, fontValue: string): void {
        try {
            localStorage.setItem(fontKey, fontValue);
            logger.info(`font cached into localStorage`, {
                method: "_saveFontToLocalStorage"
            });
        } catch (err) {
            logger.error(`Failed to cache font into localStorage`, {
                method: "_saveFontToLocalStorage",
                data: {
                    error: err
                }
            });
        }
    }
}
