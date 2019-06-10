import { APIErrorResponse, APIResponse, ClientApi, isAPIErrorResopnse } from "./client-api";
import { SocketWrapper } from "./socket-wrapper";
import { RegisterRequestConfig, StringKeyValue } from "./event-notifications";

export interface RegisterRequestConfig {
    eventName: string;
    eventParams?: any;
    onMessage: Function;
}

export type StringKeyValue<T> = { [key: string]: T };

export interface EventNotificationsOptions {
    ks: string;
    serviceUrl: string;
    clientTag: string;
}

export interface APINotificationResponse extends APIResponse {
    url: string;
    queueName: string;
    queueKey: string;
}

export function isAPINotificationResponse(
    response: APIResponse
): response is APINotificationResponse {
    return response.objectType === "EventNotification"; // todo is it?
}

export class EventNotification {
    private static instancePool: any = {};

    private socketPool: any = {};
    private clientApi: any;
    private logger = this.getlogger("EventNotification");

    static getInstance(parmas: EventNotificationsOptions): EventNotification {
        const domainUrl = EventNotification.getDomainFromUrl(parmas.serviceUrl);

        if (!EventNotification.instancePool[domainUrl]) {
            const newInstance = new EventNotification(parmas);
            EventNotification.instancePool[domainUrl] = newInstance;
        }

        return EventNotification.instancePool[domainUrl];
    }

    constructor(options: EventNotificationsOptions) {
        this.clientApi = new ClientApi(options);
    }

    private getlogger(context: string) {
        // TODO use logger from common
        return (message: string, ...args: any[]) => {
            console.log(`>>>> [${context}] ${message}`, ...args);
        };
    }

    public init() {
        // Remove any old bindings:
        this.destroy();
    }

    private destroy() {
        for (let socketKey in this.socketPool) {
            this.socketPool[socketKey].destroy();
        }

        this.socketPool = {};
    }

    public registerNotifications(registerRequestConfigs: RegisterRequestConfig[]): Promise<void> {
        let apiRequests: StringKeyValue<string | number>[] = registerRequestConfigs.map(
            (eventConfig: RegisterRequestConfig) => {
                return this.prepareRegisterRequest(eventConfig);
            }
        );

        return this.clientApi
            .doMultiRegistrationRequest(apiRequests)
            .then((results: APIResponse[]) => {
                let promiseArray = results.map((result, index) => {
                    return this.processResult(registerRequestConfigs[index], result);
                });

                return Promise.all(promiseArray).then(() => {
                    return undefined;
                });
            });
    }

    private prepareRegisterRequest(eventRequestConfig: RegisterRequestConfig) {
        let request: StringKeyValue<string | number> = {
            service: "eventnotification_eventnotificationtemplate",
            action: "register",
            notificationTemplateSystemName: eventRequestConfig.eventName,
            "pushNotificationParams:objectType": "KalturaPushNotificationParams"
        };

        let index = 0;
        for (let eventPrmKey in eventRequestConfig.eventParams) {
            request[`pushNotificationParams:userParams:item${index}:objectType`] =
                "KalturaPushNotificationParams";
            request[`pushNotificationParams:userParams:item${index}:key`] = eventPrmKey;
            request[`pushNotificationParams:userParams:item${index}:value:objectType`] =
                "KalturaStringValue";
            request[`pushNotificationParams:userParams:item${index}:value:value`] =
                eventRequestConfig.eventParams[eventPrmKey];
            request[`pushNotificationParams:userParams:item${index}:isQueueKeyParam`] = 1;
            index++;
        }

        return request;
    }

    private processResult(
        registerRequest: RegisterRequestConfig,
        result: APIResponse
    ): Promise<void> {
        if (isAPIErrorResopnse(result)) {
            this.logger(
                `processResult: Error registering to ${registerRequest.eventName}, message:${
                    result.message
                } (${result.code})`
            );
            return Promise.reject(new Error(result.message));
        }

        if (!isAPINotificationResponse(result)) {
            return Promise.reject(new Error("invalid response structure"));
        }

        //cache sockets by host name
        let socketKey = EventNotification.getDomainFromUrl(result.url);
        let socketWrapper = this.socketPool[socketKey];
        if (!socketWrapper) {
            socketWrapper = new SocketWrapper({ key: socketKey, url: result.url });
            this.socketPool[socketKey] = socketWrapper;
        }

        socketWrapper.prepareForListening(
            registerRequest.eventName,
            result.queueName,
            result.queueKey,
            (obj: any) => {
                this.logger(
                    `processResult: received event for ${registerRequest.eventName} queueKey is ${
                        result.queueKey
                    }`
                );
                registerRequest.onMessage(obj);
            }
        );

        return Promise.resolve();
    }

    private static getDomainFromUrl(url: string) {
        return url.replace(/^(.*\/\/[^\/?#]*).*$/, "$1");
    }
}
