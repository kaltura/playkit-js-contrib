/**
 * @module js-logger
 * @description Typescript description for js-logger
 */

export interface LogLevel extends Object {
  /**
   * The numerical representation of the level
   */
  value: number;
  /**
   * Human readable name of the log level
   */
  name: string;
}

interface LoggerContext extends Object {
  /**
   * The currrent log level
   */
  level: LogLevel;
  /**
   * The optional current logger name
   */
  name?: string;
}

/**
 * Defines custom formatter for the log message
 * @callback formatterCallback
 * @param  {any[]}    messages the given logger arguments
 * @param  {LoggerContext} context  the current logger context (level and name)
 */

interface LoggerOpts extends Object {
  /**
   * The log level, default is DEBUG
   */
  logLevel?: LogLevel;
  /**
   * Defines custom formatter for the log message
   * @param  {formatterCallback} callback the callback which handles the formatting
   */
  formatter?: (messages: any[], context: LoggerContext) => void;
}

/**
 * Defines custom handler for the log message
 * @callback setHandlerCallback
 * @param  {any[]}    messages the given logger arguments
 * @param  {LoggerContext} context  the current logger context (level and name)
 */

export interface Logger {
  DEBUG: LogLevel;
  TRACE: LogLevel;
  INFO: LogLevel;
  TIME: LogLevel;
  WARN: LogLevel;
  ERROR: LogLevel;
  OFF: LogLevel;

  debug(...x: any[]): void;
  info(...x: any[]): void;
  log(...x: any[]): void;
  warn(...x: any[]): void;
  error(...x: any[]): void;

  /**
   * Configure and example a Default implementation which writes to the
   * `window.console` (if present). The `options` hash can be used to configure
   * the default logLevel and provide a custom message formatter.
   */
  useDefaults(options?: LoggerOpts): void;

  /**
   * Sets the global logging filter level which applies to *all* previously
   * registered, and future Logger instances. (note that named loggers (retrieved
   * via `Logger.get`) can be configured independently if required).
   *
   * @param  {LogLevel} level the level to switch to
   */
  setLevel(level: LogLevel): void;
  /**
   * Gets the global logging filter level
   *
   * @return {LogLevel} the current logging level
   */
  getLevel(): LogLevel;
  /**
   * Set the global logging handler. The supplied function should
   * expect two arguments, the first being an arguments object with the
   * supplied log messages and the second being a context object which
   * contains a hash of stateful parameters which the logging function can consume.
   * @param  {setHandlerCallback} callback the callback which handles the logging
   */
  setHandler(
    logHandler: (messages: any[], context: LoggerContext) => void
  ): void;
  /**
   * Retrieve a ContextualLogger instance.  Note that named loggers automatically
   * inherit the global logger's level, default context and log handler.
   *
   * @param  {string}  name the logger name
   * @return {Logger}      the named logger
   */
  get(name: string): Logger;
  time(label: string): void;
  timeEnd(label: string): void;
  enabledFor(level: LogLevel): boolean;
  createDefaultHandler(
    options?: LoggerOpts
  ): (messages: any[], context: LoggerContext) => void;
}
