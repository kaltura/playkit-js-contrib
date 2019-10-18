import { UIManager } from "@playkit-js-contrib/ui";

export interface ContribPlugin {}

export interface OnRegisterUI {
    onRegisterUI(uiManager: UIManager): void;
}

export function hasOnRegisterUI(plugin: any): plugin is OnRegisterUI {
    return "onRegisterUI" in plugin;
}

export interface OnPluginSetup {
    onPluginSetup(): void;
}

export function hasOnPluginSetup(plugin: any): plugin is OnPluginSetup {
    return "onPluginSetup" in plugin;
}

export interface OnPluginDestroy {
    onPluginDestroy(): void;
}

export function hasOnPluginDestroy(plugin: any): plugin is OnPluginDestroy {
    return "OnPluginDestroy" in plugin;
}

export interface onActivePresetChanged {
    onActivePresetChanged(presetName: string): void;
}

export function hasOnActivePresetChanged(plugin: any): plugin is onActivePresetChanged {
    return "onActivePresetChanged" in plugin;
}

export interface OnMediaLoad {
    onMediaLoad(): void;
}

export function hasOnMediaLoad(plugin: any): plugin is OnMediaLoad {
    return "onMediaLoad" in plugin;
}

export interface OnMediaUnload {
    onMediaUnload(): void;
}

export function hasOnMediaUnload(plugin: any): plugin is OnMediaUnload {
    return "onMediaUnload" in plugin;
}
