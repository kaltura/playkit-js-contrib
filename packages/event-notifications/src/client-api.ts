import axios, { AxiosRequestConfig } from "axios";
import { EventNotificationsOptions } from "./event-notifications";

export interface APIResponse {
    objectType: string;
}

export interface APIErrorResponse extends APIResponse {
    code: string;
    message: string;
}

export interface ClientApiOptions {
    ks: string;
    serviceUrl: string;
    clientTag: string;
}

export function isAPIErrorResopnse(response: APIResponse): response is APIErrorResponse {
    debugger; // todo
    return response.objectType === "TODO_TODO";
}

export function isAPIResponse(response: any): response is APIResponse {
    return "objectType" in response;
}

export class ClientApi {
    private baseParams: any;
    private serviceUrl: string;

    constructor(options: ClientApiOptions) {
        this.serviceUrl = options.serviceUrl;

        this.baseParams = {
            apiVersion: "3.1",
            expiry: "86400",
            ignoreNull: 1,
            clientTag: options.clientTag,
            ks: options.ks,
            kalsig: "" // Todo: MD5 hash code for the params object.
        };
    }

    public doMultiRegistrationRequest(apiRequests: any): Promise<APIResponse[]> {
        let data = this.preparePostMultiData(apiRequests);
        let options: AxiosRequestConfig = {
            headers: {
                "Content-Type": "application/json",
                responseType: "application/x-www-form-urlencoded"
            }
        };

        return axios
            .post<{ objects: unknown[] }>(`${this.serviceUrl}?service=multirequest`, data, options)
            .then(res => {
                return res.data.objects as APIResponse[];
            });
    }

    private preparePostMultiData(apiRequests: any) {
        let data: any = {};

        let multiRequestIndex = 1;

        // Add base parameters
        for (let paramKey in this.baseParams) {
            if (typeof data[paramKey] === "undefined") {
                data[paramKey] = this.baseParams[paramKey];
            }
        }

        // set format to JSON ( Access-Control-Allow-Origin:* )
        data["format"] = 1;
        data["action"] = "null";

        // enumerate the request (1:xxx, 2:xxx...)
        for (let i = 0; i < apiRequests.length; i++) {
            let requestInx = multiRequestIndex + i;

            // MultiRequest pre-process each param with inx:param
            for (let paramKey in apiRequests[i]) {
                // support multi dimension array request:
                if (typeof apiRequests[i][paramKey] == "object") {
                    for (let subParamKey in apiRequests[i][paramKey]) {
                        data[requestInx + ":" + paramKey + ":" + subParamKey] =
                            apiRequests[i][paramKey][subParamKey];
                    }
                } else {
                    data[requestInx + ":" + paramKey] = apiRequests[i][paramKey];
                }
            }
        }

        return data;
    }
}
