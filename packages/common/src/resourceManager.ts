export interface ResourceItemToken {
    name: string;
    version: string;
}

export class ResourceManager {
    private _cache: Record<string, any> = {};

    static get(player: any) {
        if (!player) {
            return;
        }

        player.__ovp__ = player.__ovp__ || {};
        player.__ovp__.resourceManager = player.__ovp__.resourceManager || new ResourceManager();
        return player.__ovp__.resourceManager;
    }

    public getResource<T>(item: ResourceItemToken, creator: () => T): T {
        const parsedName = `${item.name}_${item.version}`;

        if (!this._cache[parsedName]) {
            this._cache[parsedName] = creator();
        }

        return this._cache[parsedName];
    }
}
