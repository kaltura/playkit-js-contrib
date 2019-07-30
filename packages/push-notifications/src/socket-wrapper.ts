import * as io from "socket.io-client";
import Socket = SocketIOClient.Socket;
import { log } from "@playkit-js-contrib/common";
import { Utils } from "./utils";

export interface ListenKeysObject {
    eventName: string;
    queueNameHash: string;
    queueKeyHash: string;
    onMessage: Function;
}

export interface SocketWrapperParams {
    key: string;
    url: string;
    onSocketDisconnect?: Function | undefined;
    onSocketReconnect?: Function | undefined;
}

export class SocketWrapper {
    public static CONNECTION_TIMEOUT: number = 10 * 60 * 1000;

    private _socket: Socket | any;
    private _key: string | null;
    private _listenKeys: Record<string, ListenKeysObject> = {};
    private _messageKeyToQueueKeyMap: Record<string, string> = {};
    private _connected: boolean = false;
    private _logger = this._getLogger("SocketWrapper");

    constructor(socketWrapperParams: SocketWrapperParams) {
        this._key = socketWrapperParams.key;

        this._logger("log", `c'tor: Connecting to socket for ${socketWrapperParams.url}`);
        this._connectAndListenToSocket(socketWrapperParams);
    }

    private _getLogger(context: string) {
        return (level: "debug" | "log" | "warn" | "error", message: string, ...args: any[]) => {
            log(level, context, message, ...args);
        };
    }

    public destroy() {
        if (this._socket) {
            this._socket.disconnect();
            this._socket = null;
        }

        this._listenKeys = {};
        this._messageKeyToQueueKeyMap = {};
        this._connected = false;
        this._key = null;
    }

    private _connectAndListenToSocket(socketWrapperParams: SocketWrapperParams) {
        this._logger("log", "connectAndListenToSocket: io connection to socket");

        this._socket = io.connect(socketWrapperParams.url, {
            forceNew: true,
            timeout: SocketWrapper.CONNECTION_TIMEOUT
        });

        this._socket.on("validated", () => {
            this._connected = true;

            for (let key in this._listenKeys) {
                this._logger(
                    "log",
                    `registerSocket: on Validated: Emit listen' to url ${socketWrapperParams.url}`,
                    this._listenKeys[key]
                );
                this._socket.emit(
                    "listen",
                    this._listenKeys[key].queueNameHash,
                    this._listenKeys[key].queueKeyHash
                );
            }
        });

        this._socket.on("connected", (messageKey: string, queueKey: string) => {
            if (this._listenKeys[queueKey]) {
                this._messageKeyToQueueKeyMap[messageKey] = queueKey;
                this._logger(
                    "log",
                    `on Connected: Listening to queueKey ${messageKey} and \n queueKeyHash ${queueKey}`
                );
            } else {
                this._logger(
                    "error",
                    `on Connected: Cannot listen to queueKey ${messageKey} \n queueKeyHash ${queueKey} queueKeyHash not found`,
                    "info"
                );
            }
        });

        this._socket.on("message", (messageKey: string, msg: any) => {
            this._logger(
                "log",
                `on Message: queueKey ${messageKey} message is: `,
                ...(Array.isArray(msg) ? msg : [msg])
            );

            if (
                this._messageKeyToQueueKeyMap[messageKey] &&
                this._listenKeys[this._messageKeyToQueueKeyMap[messageKey]]
            ) {
                this._listenKeys[this._messageKeyToQueueKeyMap[messageKey]].onMessage(msg);
            } else {
                this._logger(
                    "error",
                    `onMessage: Error couldn't find queueKey in map. queueKey ${messageKey} `
                );
            }
        });

        this._socket.on("disconnect", (e: any) => {
            this._logger("log", "on Disconnect: push server was disconnected");
            if (!Utils.isEmptyObject(this._listenKeys)) {
                const onSocketDisconnect = socketWrapperParams.onSocketDisconnect;
                if (onSocketDisconnect) onSocketDisconnect(e);
            }
        });

        this._socket.on("reconnect", (e: any) => {
            this._logger("log", "on Reconnect: push server was reconnected");
            if (!Utils.isEmptyObject(this._listenKeys)) {
                const onSocketReconnect = socketWrapperParams.onSocketReconnect;
                if (onSocketReconnect) onSocketReconnect(e);
            }
        });

        this._socket.on("reconnect_error", (e: any) => {
            this._logger("log", "on Reconnect_error: reconnection failed ", e);
        });

        this._socket.on("errorMsg", (msg: any) => {
            this._logger("error", "on ErrorMsg", msg);
        });
    }

    public prepareForListening(
        eventName: string,
        queueNameHash: string,
        queueKeyHash: string,
        onMessage: Function
    ) {
        this._listenKeys[queueKeyHash] = {
            eventName: eventName,
            queueNameHash: queueNameHash,
            queueKeyHash: queueKeyHash,
            onMessage: onMessage
        };

        if (this._connected) {
            this._logger(
                "log",
                `Listening to ${eventName} queueNameHash ${queueNameHash} queueKeyHash ${queueKeyHash}`
            );
            this._socket.emit("listen", queueNameHash, queueKeyHash);
        }
    }
}
