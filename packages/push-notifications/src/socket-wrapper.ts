import * as io from "socket.io-client";
import Socket = SocketIOClient.Socket;
import { getContribLogger } from "@playkit-js-contrib/common";

export interface ListenKeysObject {
    eventName: string;
    queueNameHash: string;
    queueKeyHash: string;
    onMessage: Function;
    onDisconnect?: Function;
    onReconnect?: Function;
}

const logger = getContribLogger('pushNotification');

export class SocketWrapper {
    public static CONNECTION_TIMEOUT: number = 10 * 60 * 1000;

    private _socket: Socket | any;
    private _key: string;
    private _listenKeys: Record<string, ListenKeysObject> = {};
    private _messageKeyToQueueKeyMap: Record<string, string> = {};
    private _connected: boolean = false;

    constructor({ key, url }: { key: string; url: string }) {
        this._key = key;

        logger.log(`c'tor: Connecting to socket for ${url}`);
        this._registerSocket(url);
    }

    public destroy() {
        if (this._socket) {
            this._socket.disconnect();
            this._socket = null;
        }

        this._listenKeys = {};
        this._messageKeyToQueueKeyMap = {};
        this._connected = false;
    }

    private _registerSocket(url: string) {
        logger.log("RegisterSocket: io connection to socket");

        this._socket = io.connect(url, {
            forceNew: true,
            timeout: SocketWrapper.CONNECTION_TIMEOUT
        });

        this._socket.on("validated", () => {
            this._connected = true;

            for (let key in this._listenKeys) {
                logger.log(
                    `registerSocket: on Validated: Emit listen' to url ${url}`,
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
                logger.log(
                    `on Connected: Listening to queueKey ${messageKey} and \n queueKeyHash ${queueKey}`
                );
            } else {
                logger.error(
                    `on Connected: Cannot listen to queueKey ${messageKey} \n queueKeyHash ${queueKey} queueKeyHash not found`,
                    "info"
                );
            }
        });

        this._socket.on("message", (messageKey: string, msg: any) => {
            logger.log(
                `on Message: queueKey ${messageKey} message is: `,
                ...(Array.isArray(msg) ? msg : [msg])
            );

            if (
                this._messageKeyToQueueKeyMap[messageKey] &&
                this._listenKeys[this._messageKeyToQueueKeyMap[messageKey]]
            ) {
                this._listenKeys[this._messageKeyToQueueKeyMap[messageKey]].onMessage(msg);
            } else {
                logger.error(
                    `onMessage: Error couldn't find queueKey in map. queueKey ${messageKey} `
                );
            }
        });

        this._socket.on("disconnect", (e: any) => {
            logger.log("on Disconnect: push server was disconnected");
            for (let key in this._listenKeys) {
                let onDisconnect = this._listenKeys[key].onDisconnect;
                if (onDisconnect) onDisconnect(e);
            }
        });

        this._socket.on("reconnect", (e: any) => {
            logger.log("on Reconnect: push server was reconnected");
            for (let key in this._listenKeys) {
                let onReconnect = this._listenKeys[key].onReconnect;
                if (onReconnect) onReconnect(e);
            }
        });

        this._socket.on("reconnect_error", (e: any) => {
            logger.log("on Reconnect_error: reconnection failed ", e);
        });

        this._socket.on("errorMsg", (msg: any) => {
            logger.error("on ErrorMsg", msg);
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
            logger.log(
                `Listening to ${eventName} queueNameHash ${queueNameHash} queueKeyHash ${queueKeyHash}`
            );
            this._socket.emit("listen", queueNameHash, queueKeyHash);
        }
    }
}
