import axios, { AxiosRequestConfig } from "axios";

export class ClientApi {
    private baseParams: any;
    private serviceUrl: string;

    constructor(params: any) {
        this.baseParams = {
            apiVersion: "3.1",
            expiry: "86400",
            ignoreNull: 1,
            clientTag: "kwidget:v7.0.0", // todo: get it from player version
            ks: params.ks,
            kalsig: "" // todo: convert params before the send to url escapeed params and MD5 hash it.
        };

        this.serviceUrl = params.serviceUrl;
    }

    static getInstance(params: any): ClientApi {
        return new ClientApi(params);
    }

    public doMultiRegistrationRequest(apiRequests: any) {
        let data = this.preparePostMultiData(apiRequests);
        let options: AxiosRequestConfig = {
            headers: { "Content-Type": "application/json" }
        };

        return axios.post(`${this.serviceUrl}?service=multirequest`, data, options).then(res => {
            return res.data;
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
