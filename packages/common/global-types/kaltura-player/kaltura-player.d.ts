import * as ContribPreact from "preact";

declare global {
    const KalturaPlayer: {
        ui: {
            redux: {
                connect: (...args: any) => any;
            };
            reducers: Record<string, { actions: Record<string, unknown>[] }>;
            preact: typeof ContribPreact;
            utils: {
                getLogger: (name: string) => CoreLogger;
                bindActions(actions: Record<string, unknown>[]): (...args: any) => void;
            };
            components: {};
            EventType: any;
        };
        core: {
            registerPlugin(name: string, component: any): void;
            BasePlugin: {
                new (...args: any[]): CoreBasePlugin;
            };
            utils: {
                Object: {
                    mergeDeep(target: Record<string, any>, ...sources: Record<string, any>[]);
                };
            };
        };
    };
}
