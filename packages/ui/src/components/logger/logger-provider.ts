// @flow
import {Component} from 'preact';
import { getContribLogger, NoopLogger, ContribLogger } from '@playkit-js-contrib/common';

interface LoggerProviderProps {
  kalturaPlayer: any,
  type?: string; // TODO sakal change to module
  context: string
}

export class LoggerProvider extends Component<LoggerProviderProps> {

  private _logger: ContribLogger = new NoopLogger();

  componentWillMount(): void {
      this._logger = getContribLogger({
	      module: this.props.type || 'plugins',
        kalturaPlayer: this.props.kalturaPlayer,
        context: this.props.context
      });
  }

  getChildContext() {
    return {
      logger: this._logger
    };
  }

  render(props: any) {
    return props.children[0];
  }
}
