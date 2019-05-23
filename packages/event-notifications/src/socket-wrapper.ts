import * as io from "socket.io-client";
import Socket = SocketIOClient.Socket;

export class SocketWrapper {
    public static CONNECTION_TIMEOUT: number = 10 * 60 * 1000;

    private socket: Socket | any;
    private key: string;
    private listenKeys: any = {};
    private callbackMap: any = {};
    private connected: boolean = false;
    private logger = this.getlogger("SocketWrapper");

    constructor(key: string) {
        this.key = key;
    }

    private getlogger(context: string) {
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
    }

    public connectAndRegister(url: string, eventName: string) {
        this.destroy();
        this.logger(`connect: Connecting to socket for ${url}`);
        this.socket = io.connect(url, {
            forceNew: true,
            timeout: SocketWrapper.CONNECTION_TIMEOUT
        });
        this.registerSocket(url, eventName);
    }

    private registerSocket(url: string, eventName: string) {
        this.logger("registerSocket: registering to socket", "info");

        this.socket.on("validated", () => {
            this.connected = true;

            for (let key in this.listenKeys) {
                this.logger(
                    `registerSocket: on Validated: emit 'listen' to url ${url} eventName ${eventName}`,
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

        this.socket.on("disconnect", () => {
            this.logger("on Disconnect: push server was disconnected", "info");
        });
        this.socket.on("reconnect", () => {
            this.logger("on Reconnect: push server was reconnected", "info");
        });

        this.socket.on("reconnect_error", (e: any) => {
            this.logger("on Reconnect_error: reconnection failed ", e, "info");
        });

        this.socket.on("connected", (queueKey: string, queueKeyHash: string) => {
            if (this.listenKeys[queueKeyHash]) {
                this.callbackMap[queueKey] = this.listenKeys[queueKeyHash];
                this.logger(
                    `on Connected: Listening to ${eventName} queueKey ${queueKey} and \n queueKeyHash ${queueKeyHash}`,
                    "info"
                );
            } else {
                this.logger(
                    `on Connected: Cannot listen to ${eventName} queueKey ${queueKey} \n queueKeyHash ${queueKeyHash} queueKeyHash not found`,
                    "info"
                );
            }
        });

        this.socket.on("message", (queueKey: string, msg: any) => {
            this.logger(
                `on Message: eventName ${eventName} queueKey ${queueKey} message is: `,
                ...(Array.isArray(msg) ? msg : [msg]),
                "info"
            );

            if (this.callbackMap[queueKey]) {
                this.callbackMap[queueKey].cb(msg);
            } else {
                this.logger(
                    `onMessage: Error couldn't find queueKey in map. queueKey ${queueKey} for eventName ${eventName}`,
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
        cb: Function
    ) {
        this.listenKeys[queueKeyHash] = {
            eventName: eventName,
            queueNameHash: queueNameHash,
            queueKeyHash: queueKeyHash,
            cb: cb
        };

        if (this.connected) {
            this.logger(
                `Listening to ${eventName} queueNameHash ${queueNameHash} queueKeyHash ${queueKeyHash}`
            );
            this.socket.emit("listen", queueNameHash, queueKeyHash);
        }
    }
}
