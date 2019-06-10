declare module "*.scss" {
    const content: { [className: string]: string };
    export = content;
}

declare var KalturaPlayer: any;
declare var playkit: any;

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
