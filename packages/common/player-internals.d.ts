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

interface FakeEvent {}

type EventListener = (event: FakeEvent) => boolean | void;

declare global {
    interface KalturaPlayerInstance {
        addEventListener: (type: string, listener: EventListener) => void;
        removeEventListener: (type: string, listener: EventListener) => void;
        Event: Record<string, string>;
        currentTime: number;
    }

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
            components: {};
            EventType: any;
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
