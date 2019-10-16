interface FakeEvent {}
type CoreEventListener = (event: FakeEvent) => boolean | void;

interface CorePlayer {
    pause(): void;
    play(): void;
    addEventListener(type: string, listener: CoreEventListener): void;
    removeEventListener: (type: string, listener: CoreEventListener) => void;
    Event: Record<string, string>;
    currentTime: number;
    config: {
        session: {
            ks: string;
            partnerId: number;
            userId: string;
        };
        provider: {
            env: {
                serviceUrl: string;
            };
        };
        sources?: {
            id: string;
            type: string;
        };
    };
}
