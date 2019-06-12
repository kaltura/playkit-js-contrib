import * as io from "socket.io-client";
import Socket = SocketIOClient.Socket;

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

    private socket: Socket | any;
    private key: string;
    private listenKeys: Record<string, ListenKeysObject> = {};
    private callbackMap: Record<string, ListenKeysObject> = {};
    private connected: boolean = false;
    private logger = this._getLogger("SocketWrapper");

    constructor({ key, url }: { key: string; url: string }) {
        this.key = key;

        this.logger(`connect: Connecting to socket for ${url}`);
        this._registerSocket(url);
    }

    private _getLogger(context: string) {
        // TODO use logger from common
        return (message: string, ...args: any[]) => {
            console.log(`>>>> [${context}] ${message}`, ...args);
        };
    }

    private destroy() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }

        this.listenKeys = {};
        this.callbackMap = {};
        this.connected = false;
    }

    private _registerSocket(url: string) {
        this.logger("registerSocket: registering to socket", "info");

        this.socket = io.connect(url, {
            forceNew: true,
            timeout: SocketWrapper.CONNECTION_TIMEOUT
        });

        this.socket.on("validated", () => {
            this.connected = true;

            for (let key in this.listenKeys) {
                this.logger(
                    `registerSocket: on Validated: emit 'listen' to url ${url}`,
                    this.listenKeys[key],
                    "info"
                );
                this.socket.emit(
                    "listen",
                    this.listenKeys[key].queueNameHash,
                    this.listenKeys[key].queueKeyHash
                );
            }
        });

        this.socket.on("disconnect", (e: any) => {
            this.logger("on Disconnect: push server was disconnected", "info");
            for (let key in this.listenKeys) {
                let onDisconnect = this.listenKeys[key].onDisconnect;
                if (onDisconnect) onDisconnect(e);
            }
        });

        this.socket.on("reconnect", (e: any) => {
            this.logger("on Reconnect: push server was reconnected", "info");
            for (let key in this.listenKeys) {
                let onReconnect = this.listenKeys[key].onReconnect;
                if (onReconnect) onReconnect(e);
            }
        });

        this.socket.on("reconnect_error", (e: any) => {
            this.logger("on Reconnect_error: reconnection failed ", e, "info");
        });

        this.socket.on("connected", (queueKey: string, queueKeyHash: string) => {
            if (this.listenKeys[queueKeyHash]) {
                this.callbackMap[queueKey] = this.listenKeys[queueKeyHash];
                this.logger(
                    `on Connected: Listening to queueKey ${queueKey} and \n queueKeyHash ${queueKeyHash}`,
                    "info"
                );
            } else {
                this.logger(
                    `on Connected: Cannot listen to queueKey ${queueKey} \n queueKeyHash ${queueKeyHash} queueKeyHash not found`,
                    "info"
                );
            }
        });

        this.socket.on("message", (queueKey: string, msg: any) => {
            this.logger(
                `on Message: queueKey ${queueKey} message is: `,
                ...(Array.isArray(msg) ? msg : [msg]),
                "info"
            );

            if (this.callbackMap[queueKey]) {
                this.callbackMap[queueKey].onMessage(msg);
            } else {
                this.logger(
                    `onMessage: Error couldn't find queueKey in map. queueKey ${queueKey} `,
                    "error"
                );
            }
        });

        this.socket.on("errorMsg", (msg: any) => {
            this.logger("on ErrorMsg", msg);
        });
    }

    prepareForListening(
        eventName: string,
        queueNameHash: string,
        queueKeyHash: string,
        onMessage: Function,
        onDisconnect: Function,
        onReconnect: Function
    ) {
        this.listenKeys[queueKeyHash] = {
            eventName: eventName,
            queueNameHash: queueNameHash,
            queueKeyHash: queueKeyHash,
            onMessage: onMessage,
            onDisconnect: onDisconnect,
            onReconnect: onReconnect
        };

        if (this.connected) {
            this.logger(
                `Listening to ${eventName} queueNameHash ${queueNameHash} queueKeyHash ${queueKeyHash}`
            );
            this.socket.emit("listen", queueNameHash, queueKeyHash);
        }
    }
}
