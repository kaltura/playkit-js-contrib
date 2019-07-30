import * as io from "socket.io-client";
import Socket = SocketIOClient.Socket;
import { getContribLogger } from "@playkit-js-contrib/common";
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

const logger = getContribLogger({
    module: "contrib-push-notifications",
    class: "SocketWrapper"
});

export class SocketWrapper {
    public static CONNECTION_TIMEOUT: number = 10 * 60 * 1000;

    private _socket: Socket | any;
    private _key: string | null;
    private _listenKeys: Record<string, ListenKeysObject> = {};
    private _messageKeyToQueueKeyMap: Record<string, string> = {};
    private _connected: boolean = false;

    constructor(socketWrapperParams: SocketWrapperParams) {
        this._key = socketWrapperParams.key;

        logger.info(`Connecting to socket`, {
            method: "constructor",
            data: {
                url: socketWrapperParams.url
            }
        });
        this._connectAndListenToSocket(socketWrapperParams);
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
        logger.info("connect to socket", {
            method: `_connectAndListenToSocket`,
            data: {
                url: socketWrapperParams.url
            }
        });

        this._socket = io.connect(socketWrapperParams.url, {
            forceNew: true,
            timeout: SocketWrapper.CONNECTION_TIMEOUT
        });

        this._socket.on("validated", () => {
            this._connected = true;

            for (let key in this._listenKeys) {
                logger.info("Emit listen to url", {
                    method: `_registerSocket('validated')`,
                    data: {
                        url: socketWrapperParams.url,
                        keyObject: this._listenKeys[key]
                    }
                });

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
                logger.info("Listening to queue", {
                    method: `_registerSocket('connected')`,
                    data: {
                        messageKey,
                        queueKey
                    }
                });
            } else {
                logger.error("Cannot listen to queue, queueKeyHash not recognized", {
                    method: `_registerSocket('connected')`,
                    data: {
                        messageKey,
                        queueKey
                    }
                });
            }
        });

        this._socket.on("message", (messageKey: string, msg: any) => {
            logger.debug("Cannot listen to queue, queueKeyHash not recognized", {
                method: `_registerSocket('message')`,
                data: {
                    messageKey,
                    msg
                }
            });

            if (
                this._messageKeyToQueueKeyMap[messageKey] &&
                this._listenKeys[this._messageKeyToQueueKeyMap[messageKey]]
            ) {
                this._listenKeys[this._messageKeyToQueueKeyMap[messageKey]].onMessage(msg);
            } else {
                logger.error(`couldn't find queueKey in map`, {
                    method: `_registerSocket('message')`,
                    data: {
                        messageKey
                    }
                });
            }
        });

        this._socket.on("disconnect", (e: any) => {
            logger.info("push server was disconnected", {
                method: `_registerSocket('disconnect')`
            });
            if (!Utils.isEmptyObject(this._listenKeys)) {
                const onSocketDisconnect = socketWrapperParams.onSocketDisconnect;
                if (onSocketDisconnect) onSocketDisconnect(e);
            }
        });

        this._socket.on("reconnect", (e: any) => {
            logger.info("push server was reconnected", {
                method: `_registerSocket('reconnect')`
            });
            if (!Utils.isEmptyObject(this._listenKeys)) {
                const onSocketReconnect = socketWrapperParams.onSocketReconnect;
                if (onSocketReconnect) onSocketReconnect(e);
            }
        });

        this._socket.on("reconnect_error", (e: any) => {
            logger.error("reconnection error", {
                method: `_registerSocket('reconnect_error')`,
                data: {
                    error: e
                }
            });
        });

        this._socket.on("errorMsg", (msg: any) => {
            logger.error("error message recieved", {
                method: `_registerSocket('errorMsg')`,
                data: {
                    msg
                }
            });
            logger.error("on ErrorMsg", msg);
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
            logger.info("Listening to ${eventName}", {
                method: `prepareForListening`,
                data: {
                    queueNameHash,
                    queueKeyHash
                }
            });
            this._socket.emit("listen", queueNameHash, queueKeyHash);
        }
    }
}
