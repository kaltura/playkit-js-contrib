import { ContribConfig, ContribConfigSources, CorePlugin } from "./core-plugin";
import { UIManager } from "@playkit-js-contrib/ui";
import { EnvironmentManager } from "./environmentManager";

export interface ContribPlugin {
    setCorePlugin(corePlugin: CorePlugin): void;
}

export interface OnRegisterUI {
    onRegisterUI(uiManager: UIManager): void;
}

export function hasOnRegisterUI(plugin: any): plugin is OnRegisterUI {
    return "onRegisterUI" in plugin;
}

export interface SetCorePlugin<T extends CorePlugin = CorePlugin> {
    setCorePlugin(corePlugin: T): void;
}

export function hasSetCorePlugin(plugin: any): plugin is SetCorePlugin<any> {
    return "setCorePlugin" in plugin;
}

export interface UseContribServices {
    setContribServices(playerServices: EnvironmentManager): void;
}

export function hasUseContribServices(plugin: any): plugin is UseContribServices {
    return "setContribServices" in plugin;
}

export interface OnPluginSetup {
    onPluginSetup(config: ContribConfig): void;
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

export type OnMediaLoadConfig = { sources: ContribConfigSources };

export interface OnMediaLoad {
    onMediaLoad(config: OnMediaLoadConfig): void;
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
