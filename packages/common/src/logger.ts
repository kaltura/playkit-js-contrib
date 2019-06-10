// TODO should move logger to v2 as v7 has a dedicated logger

let isEnabled = false;
let logPrefix = "";
export function enableLog(prefix?: string) {
    logPrefix = prefix || "";
    isEnabled = true;
}
export function log(
    level: "debug" | "log" | "warn" | "error",
    context: string,
    message: string,
    ...optionalParams: any[]
) {
    if (isEnabled) {
        console[level](
            `[${logPrefix}] [${level}]${context ? ` [${context}]` : ""} : ${message}`,
            ...optionalParams
        );
    }
}

export function enableLogIfNeeded(prefix?: string) {
    try {
        if (document.URL.indexOf("debugKalturaPlayer") !== -1) {
            enableLog(prefix);
        }
    } catch (e) {
        // do nothing
    }
}
