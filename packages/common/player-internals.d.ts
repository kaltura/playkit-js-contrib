import * as ContribPreact from "preact";

// TODO sakal add documentation about relevant change in webpack
interface MessageOptions {
    class?: string;
    method?: string;
    data?: Record<string, any>;
}

declare interface Logger {
    debug(message: string, context: MessageOptions): void;
    info(message: string, context: MessageOptions): void;
    trace(message: string, context: MessageOptions): void;
    warn(message: string, context: MessageOptions): void;
    error(message: string, context: MessageOptions): void;
}

interface InjectedComponentProps {
    label: string;
    onCreate: (options: { context?: any; parent: HTMLElement }) => void;
    onDestroy: (options: { context?: any; parent: HTMLElement }) => void;
    fillContainer?: boolean;
}

declare global {
    const KalturaPlayer: {
        ui: {
            redux: {
                connect: (...args: any) => any;
            }; // TODO sakal consider if should add explicit type
            reducers: Record<string, { actions: Record<string, unknown>[] }>;
            preact: typeof ContribPreact;
            utils: {
                getLogger: (name: string) => Logger;
                bindActions(actions: Record<string, unknown>[]): (...args: any) => void;
            };
            components: {
                InjectedComponentProps: InjectedComponentProps;
                InjectedComponent: ContribPreact.ComponentFactory<InjectedComponentProps>;
            };
            EventTypes: any;
        };
        core: {
            registerPlugin(name: string, component: any): void;
            BasePlugin: {
                player: any;
                eventManager: any;
            };
        };
    };
}
//
// declare module "@playkit-js/playkit-js" {
// 	export function registerPlugin(name: string, component: any): void;
//
// 	export interface KalturaPlayer {
// 		core: {
// 			BasePlugin: {
// 				player: any;
// 				eventManager: any;
// 			};
// 		};
// 	}
// }
