export class PlayerContribServices {
    private _cache: Record<string, { apiVersion: number; instance: any }> = {};

    static get(player: any): PlayerContribServices {
        player.__contrib__ = player.__contrib__ || {};
        player.__contrib__.services = player.__contrib__.services || new PlayerContribServices();
        return player.__contrib__.services;
    }

    public get(token: string): any {
        const result = this._cache[token];

        if (!result) {
            throw new Error(`cannot find resource with token ${token}`);
        }

        return result;
    }

    public register<T>(token: string, apiVersion: number, creator: () => T): T {
        let requestedResource = this._cache[token];

        if (!requestedResource || requestedResource.apiVersion < apiVersion) {
            requestedResource = this._cache[token] = { apiVersion, instance: creator() };
        }

        return requestedResource.instance;
    }
}
