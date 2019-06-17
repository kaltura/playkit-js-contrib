import {
    APIResponse,
    ClientApi,
    isAPIErrorResponse,
    RegisterRequestParams,
    RegisterRequestResponse
} from "./client-api";
import { SocketWrapper } from "./socket-wrapper";
import { PlayerAPI, log } from "@playkit-js-contrib/common";

export interface EventParams extends Record<string, any> {
    entryId: string;
    userId?: string;
}

export interface PrepareRegisterRequest {
    eventName: string;
    eventParams?: EventParams;
    onMessage: Function;
    onDisconnect: Function;
    onReconnect: Function;
}

export interface PushNotificationsOptions {
    ks: string;
    serviceUrl: string;
    clientTag: string;
    playerAPI: PlayerAPI;
}

export interface APINotificationResponse extends APIResponse {
    url: string;
    queueName: string;
    queueKey: string;
}

export function isAPINotificationResponse(
    response: APIResponse
): response is APINotificationResponse {
    return response.objectType === "KalturaPushNotificationData";
}

export class PushNotifications {
    private static instancePool: any = {}; // Todo by @Eran_Sakal register singleton per player (and remove this line)

    private _socketPool: any = {};
    private _clientApi: any;
    private _logger = this._getLogger("PushNotifications");

    // Todo: should use plugin instance
    static getInstance(options: PushNotificationsOptions): PushNotifications {
        const domainUrl = PushNotifications._getDomainFromUrl(options.serviceUrl);

        if (!PushNotifications.instancePool[domainUrl]) {
            const newInstance = new PushNotifications(options);
            PushNotifications.instancePool[domainUrl] = newInstance;
        }

        return PushNotifications.instancePool[domainUrl];
    }

    constructor(options: PushNotificationsOptions) {
        this._clientApi = new ClientApi(options);
        this._onPlayerReset(options);
    }

    private _onPlayerReset(options: PushNotificationsOptions) {
        options.playerAPI.eventManager.listen(
            options.playerAPI.kalturaPlayer,
            options.playerAPI.kalturaPlayer.Event.PLAYER_RESET,
            () => {
                this.reset();
            }
        );
    }

    private _getLogger(context: string) {
        return (level: "debug" | "log" | "warn" | "error", message: string, ...args: any[]) => {
            log(level, context, message, ...args);
        };
    }

    public reset() {
        for (let socketKey in this._socketPool) {
            this._socketPool[socketKey].destroy();
        }

        this._socketPool = {};
    }

    public registerNotifications(prepareRegisterRequests: PrepareRegisterRequest[]): Promise<void> {
        let apiRequests: RegisterRequestParams[] = prepareRegisterRequests.map(
            (eventConfig: PrepareRegisterRequest) => {
                return this._prepareRegisterRequest(eventConfig);
            }
        );

        return this._clientApi
            .doMultiRegisterRequest(apiRequests)
            .then((results: RegisterRequestResponse[]) => {
                let promiseArray = results.map((result, index) => {
                    return this._processResult(prepareRegisterRequests[index], result);
                });

                return Promise.all(promiseArray).then(() => {
                    return;
                });
            });
    }

    private _prepareRegisterRequest(
        eventRequestConfig: PrepareRegisterRequest
    ): RegisterRequestParams {
        let request: RegisterRequestParams = {
            service: "eventnotification_eventnotificationtemplate",
            action: "register",
            notificationTemplateSystemName: eventRequestConfig.eventName,
            pushNotificationParams: {
                objectType: "KalturaPushNotificationParams",
                userParams: {}
            }
        };

        let index = 0;
        for (let paramsKey in eventRequestConfig.eventParams) {
            request.pushNotificationParams.userParams[`item${index}`] = {
                objectType: "KalturaPushNotificationParams",
                key: paramsKey,
                value: {
                    objectType: "KalturaStringValue",
                    value: eventRequestConfig.eventParams[paramsKey]
                },
                sQueueKeyParam: 1
            };
            index++;
        }

        return request;
    }

    private _processResult(
        registerRequest: PrepareRegisterRequest,
        result: APIResponse
    ): Promise<void> {
        if (isAPIErrorResponse(result)) {
            this._logger(
                "error",
                `processResult: Error fetching registration info from service ${
                    registerRequest.eventName
                }, message:${result.message} (${result.code})`
            );
            return Promise.reject(new Error(result.message));
        }

        if (!isAPINotificationResponse(result)) {
            return Promise.reject(new Error("invalid response structure"));
        }

        //cache sockets by host name
        let socketKey = PushNotifications._getDomainFromUrl(result.url);
        let socketWrapper = this._socketPool[socketKey];
        if (!socketWrapper) {
            socketWrapper = new SocketWrapper({ key: socketKey, url: result.url });
            this._socketPool[socketKey] = socketWrapper;
        }

        socketWrapper.prepareForListening(
            registerRequest.eventName,
            result.queueName,
            result.queueKey,
            registerRequest.onMessage,
            registerRequest.onDisconnect,
            registerRequest.onReconnect
        );

        return Promise.resolve();
    }

    private static _getDomainFromUrl(url: string) {
        return url.replace(/^(.*\/\/[^\/?#]*).*$/, "$1");
    }
}
