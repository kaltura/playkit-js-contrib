const {h, Component} = KalturaPlayer.ui.preact;

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
