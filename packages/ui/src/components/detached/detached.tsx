const {preact, Portal} = KalturaPlayer.ui;
const {h, Component} = preact;

export interface DetachedProps {
  children: any;
  targetId: string;
}

export class Detached extends Component<DetachedProps> {
  render() {
    const {children, targetId} = this.props;
    return h(KalturaPlayer.ui.Portal, {into: targetId}, children);
  }
}
