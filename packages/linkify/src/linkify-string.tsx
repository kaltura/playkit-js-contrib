// @ts-nocheck
import * as LinkifyIt from 'linkify-it';
import defaultComponentRenderer from './decorators/default-component-renderer';

export interface LinkifyStringProps {
  text: string;
  componentRenderer: (
    href: string,
    text: string,
    key: number
  ) =>
  ComponentChild;
}

export class LinkifyString extends Component<LinkifyStringProps> {
  static defaultProps = {
    componentRenderer: defaultComponentRenderer,
  };

  private _linkify: any = new LinkifyIt();

  private _parseString(inputString: string): Array<ComponentChild> | string {
    if ((inputString || '').trim().length === 0) {
      return '';
    }

    const matches: any = this._linkify.match(inputString);
    if (!matches) {
      return inputString;
    }

    const elements = [];
    let lastIndex = 0;
    matches.forEach((match: any, i: any) => {
      // Push preceding text if there is any
      if (match.index > lastIndex) {
        elements.push(inputString.substring(lastIndex, match.index));
      }

      const decoratedHref = match.url;
      const decoratedText = match.text;
      const decoratedComponent = this.props.componentRenderer(
        decoratedHref,
        decoratedText,
        i
      );
      elements.push(decoratedComponent);

      lastIndex = match.lastIndex;
    });

    // Push remaining text if there is any
    if (inputString.length > lastIndex) {
      elements.push(inputString.substring(lastIndex));
    }

    return elements.length === 1 ? elements[0] : elements;
  }

  render() {
    return <span>{this._parseString(this.props.text)}</span>;
  }
}
