import * as io from "socket.io-client";
import Socket = SocketIOClient.Socket;
import { log } from "@playkit-js-contrib/common";

export interface ListenKeysObject {
    eventName: string;
    queueNameHash: string;
    queueKeyHash: string;
    onMessage: Function;
    onDisconnect?: Function;
    onReconnect?: Function;
}

export class SocketWrapper {
    public static CONNECTION_TIMEOUT: number = 10 * 60 * 1000;

    private _socket: Socket | any;
    private _key: string;
    private _listenKeys: Record<string, ListenKeysObject> = {};
    private _callbackMap: Record<string, ListenKeysObject> = {};
    private _connected: boolean = false;
    private _logger = this._getLogger("SocketWrapper");

    constructor({ key, url }: { key: string; url: string }) {
        this._key = key;

        this._logger("log", `connect: Connecting to socket for ${url}`);
        this._registerSocket(url);
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
        this._callbackMap = {};
        this._connected = false;
    }

    private _registerSocket(url: string) {
        this._logger("log", "registerSocket: registering to socket");

        this._socket = io.connect(url, {
            forceNew: true,
            timeout: SocketWrapper.CONNECTION_TIMEOUT
        });

        this._socket.on("validated", () => {
            this._connected = true;

            for (let key in this._listenKeys) {
                this._logger(
                    "log",
                    `registerSocket: on Validated: emit 'listen' to url ${url}`,
                    this._listenKeys[key]
                );
                this._socket.emit(
                    "listen",
                    this._listenKeys[key].queueNameHash,
                    this._listenKeys[key].queueKeyHash
                );
            }
        });

        this._socket.on("disconnect", (e: any) => {
            this._logger("log", "on Disconnect: push server was disconnected");
            for (let key in this._listenKeys) {
                let onDisconnect = this._listenKeys[key].onDisconnect;
                if (onDisconnect) onDisconnect(e);
            }
        });

        this._socket.on("reconnect", (e: any) => {
            this._logger("log", "on Reconnect: push server was reconnected");
            for (let key in this._listenKeys) {
                let onReconnect = this._listenKeys[key].onReconnect;
                if (onReconnect) onReconnect(e);
            }
        });

        this._socket.on("reconnect_error", (e: any) => {
            this._logger("log", "on Reconnect_error: reconnection failed ", e);
        });

        this._socket.on("connected", (queueKey: string, queueKeyHash: string) => {
            if (this._listenKeys[queueKeyHash]) {
                this._callbackMap[queueKey] = this._listenKeys[queueKeyHash];
                this._logger(
                    "log",
                    `on Connected: Listening to queueKey ${queueKey} and \n queueKeyHash ${queueKeyHash}`
                );
            } else {
                this._logger(
                    "error",
                    `on Connected: Cannot listen to queueKey ${queueKey} \n queueKeyHash ${queueKeyHash} queueKeyHash not found`,
                    "info"
                );
            }
        });

        this._socket.on("message", (queueKey: string, msg: any) => {
            this._logger(
                "log",
                `on Message: queueKey ${queueKey} message is: `,
                ...(Array.isArray(msg) ? msg : [msg])
            );

            if (this._callbackMap[queueKey]) {
                this._callbackMap[queueKey].onMessage(msg);
            } else {
                this._logger(
                    "error",
                    `onMessage: Error couldn't find queueKey in map. queueKey ${queueKey} `
                );
            }
        });

        this._socket.on("errorMsg", (msg: any) => {
            this._logger("error", "on ErrorMsg", msg);
        });
    }

    public prepareForListening(
        eventName: string,
        queueNameHash: string,
        queueKeyHash: string,
        onMessage: Function,
        onDisconnect: Function,
        onReconnect: Function
    ) {
        this._listenKeys[queueKeyHash] = {
            eventName: eventName,
            queueNameHash: queueNameHash,
            queueKeyHash: queueKeyHash,
            onMessage: onMessage,
            onDisconnect: onDisconnect,
            onReconnect: onReconnect
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
