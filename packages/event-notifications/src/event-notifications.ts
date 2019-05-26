import { ClientApi } from "./client-api";
import { SocketWrapper } from "./socket-wrapper";
import { RegisterRequestConfig, StringKeyValue } from "./event-notifications";

export interface RegisterRequestConfig {
    eventName: string;
    eventParams?: any;
    onMessage: Function;
}

export type StringKeyValue<T> = { [key: string]: T };

export interface ConnectionParams {
    ks: string;
    serviceUrl: string;
}

export class EventNotification {
    private socketPool: any = {};
    private clientApi: any;
    private logger = this.getlogger("EventNotification");

    static getInstance(parmas: ConnectionParams): EventNotification {
        // TODO use dedicated manager per url
        return new EventNotification(parmas);
    }

    constructor(params: ConnectionParams) {
        this.clientApi = ClientApi.getInstance(params);
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

    public registerNotifications(registerRequestConfigs: RegisterRequestConfig[]) {
        let apiRequests: StringKeyValue<string | number>[] = registerRequestConfigs.map(
            (eventConfig: RegisterRequestConfig) => {
                return this.prepareRegisterRequest(eventConfig);
            }
        );

        return this.clientApi.doMultiRegistrationRequest(apiRequests).then((results: any) => {
            if (results["objectType"] === "KalturaAPIException") {
                return Promise.reject(results);
            }

            let promiseArray = results.map((result: any, index: number) => {
                return this.processResult(registerRequestConfigs[index], result);
            });

            return Promise.all(promiseArray);
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

    private processResult(registerRequest: RegisterRequestConfig, result: any) {
        if (result.objectType === "KalturaAPIException") {
            this.logger(
                `processResult: Error registering to ${registerRequest.eventName}, message:${
                    result.message
                } (${result.code})`
            );
            return Promise.resolve(result.message);
        } else {
            //cache sockets by host name
            let socketKey = result.url.replace(/^(.*\/\/[^\/?#]*).*$/, "$1");
            let socketWrapper = this.socketPool[socketKey];
            if (!socketWrapper) {
                socketWrapper = new SocketWrapper(socketKey);
                this.socketPool[socketKey] = socketWrapper;
                socketWrapper.connectAndRegister(result.url, registerRequest.eventName);
            }

            socketWrapper.prepareForListening(
                registerRequest.eventName,
                result.queueName,
                result.queueKey,
                (obj: any) => {
                    this.logger(
                        `processResult: received event for ${
                            registerRequest.eventName
                        } queueKey is ${result.queueKey}`
                    );
                    registerRequest.onMessage(obj);
                }
            );

            return Promise.resolve();
        }
    }
}
