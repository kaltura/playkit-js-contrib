export interface RegisterRequestConfig {
    eventName: string;
    eventParams?: any;
    onMessage: Function;
}

export type StringKeyValue<T> = { [key: string]: T };
