type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

declare var KalturaPlayer: any;

declare module "@playkit-js/playkit-js" {
    export function registerPlugin(name: string, component: any): void;

    export interface KalturaPlayer {
        core: {
            BasePlugin: {
                player: any;
                eventManager: any;
            };
        };
    }
}
