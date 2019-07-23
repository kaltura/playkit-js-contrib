import { ILogger, ILogLevel } from './js-logger.types';

function isJSLogger(logger: any): logger is  JSLogger {
	return logger && 'setLevel' in logger;
}

export interface ContribLogger {
	debug(message: string, context: MessageOptions, ): void;
	info(message: string, context: MessageOptions): void;
	trace(message: string, context: MessageOptions): void;
	warn(message: string, context: MessageOptions): void;
	error(message: string, context: MessageOptions): void;
}


declare global {
	interface Window {
		KalturaPlayer?: {
			ui?: {
				Utils?: {
					getLogger: (name: string) => ContribLogger
				}
			}
		};
	}
}

function getPlayerLogger(options: { kalturaPlayer?: any, loggerName?: string}): JSLogger | null {
	const {kalturaPlayer, loggerName} = options;

	const getLoggerFn = kalturaPlayer ? kalturaPlayer.getLogger
		: (window.KalturaPlayer && window.KalturaPlayer.ui && window.KalturaPlayer.ui.Utils) ? window.KalturaPlayer.ui.Utils.getLogger : null;

	if (!getLoggerFn) {
		return null;
	}
	const logger = getLoggerFn(loggerName);

	if (!isJSLogger(logger)) {
		return null;
	}

	return logger;
}

export class NoopLogger implements ContribLogger {
	debug(message: string, context: MessageOptions): void {}
	info(message: string, context: MessageOptions): void {}
	trace(message: string, context: MessageOptions): void {}
	warn(message: string, context: MessageOptions): void {}
	error(message: string, context: MessageOptions): void {}
}

const globalLogger = getPlayerLogger({});
const defaultNoopLogger = new NoopLogger();

interface JSLogger extends ILogger {}
type LoggerMethods = "debug" | "trace" | "warn" | "error" | "info";

export class ProxyLogger implements ContribLogger {
	constructor(private _logger: JSLogger, private _defaultOptions: LoggerOptions) {
	}

	private _log (loggerMethod: LoggerMethods, level: ILogLevel, message: string, messageContext: MessageOptions): void {
		if (!this._logger.enabledFor(level))
		{
			return;
		}

		const className = messageContext.class || this._defaultOptions.class || '_';
		const module = this._defaultOptions.module || '';
		const method = messageContext.method ? `.${messageContext.method}()` : '';
		const context = this._defaultOptions.context ? `'${this._defaultOptions.context}'` : '';

		const formattedMessage = `[${module}::${className}(${context})${method}] ${message}`;

		if (messageContext.data) {
			(this._logger as any)[loggerMethod](formattedMessage, messageContext.data);
		} else {
			(this._logger as any)[loggerMethod](formattedMessage);

		}
	}

	debug(message: string, context: MessageOptions): void {
		if (!globalLogger) {
			return;
		}
		this._log('debug', globalLogger.DEBUG, message, context);
	}
	info(message: string, context: MessageOptions): void {
		if (!globalLogger) {
			return;
		}
		this._log('info', globalLogger.INFO, message, context);
	}
	trace(message: string, context: MessageOptions): void {
		if (!globalLogger) {
			return;
		}
		this._log('trace', globalLogger.TRACE, message, context);
	}
	warn(message: string, context: MessageOptions): void {
		if (!globalLogger) {
			return;
		}
		this._log('warn', globalLogger.WARN, message, context);
	}
	error(message: string, context: MessageOptions): void {
		if (!globalLogger) {
			return;
		}
		this._log('error', globalLogger.ERROR, message, context);
	}
}

export interface LoggerOptions {
	class?: string,
	module?: string,
	context?: string
}

export interface MessageOptions {
	class?: string,
	method?: string,
	data?: Record<string, any>
}


export function getContribLogger(options: {kalturaPlayer?: any} & LoggerOptions = {}): ContribLogger {
	const {kalturaPlayer} = options;

	const loggerName = `${kalturaPlayer ? kalturaPlayer._playerId : 'global'}_contrib`;
	const logger = getPlayerLogger({ kalturaPlayer, loggerName});

	if (!logger) {
		return defaultNoopLogger;
	}

	return new ProxyLogger(logger, options);
}


export function enableLogIfNeeded() {
	try {
		if (document.URL.indexOf("debugKalturaPlayer") !== -1) {
			const logger = getPlayerLogger({});

			if (!logger) {
				return;
			}

			logger.setLevel(logger.TRACE);
		}
	} catch (e) {
		// do nothing
	}
}
