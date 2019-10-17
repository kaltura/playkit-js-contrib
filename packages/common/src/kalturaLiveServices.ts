import { UUID } from "./uuid";

export class KalturaLiveServices {
    public static getAnonymousUserId(): string {
        if (typeof Storage === "undefined") {
            // No web storage Support, just generate and return a anonymous user id
            return KalturaLiveServices._generateAnonymousUserId();
        }

        // Web storage is supported
        let anonymousUserId;
        anonymousUserId = localStorage.getItem("anonymousUserId");

        if (!anonymousUserId) {
            anonymousUserId = KalturaLiveServices._generateAnonymousUserId();
            localStorage.setItem("anonymousUserId", anonymousUserId);
        }

        return anonymousUserId;
    }

    private static _generateAnonymousUserId() {
        return `##-${UUID.uuidV1()}-##`;
    }
}
