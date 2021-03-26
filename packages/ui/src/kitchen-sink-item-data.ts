import {ComponentChild, JSX} from 'preact';
import {KitchenSinkAdapter} from './components/kitchen-sink-adapter';

export interface KitchenSinkContentRendererProps {
  onClose: () => void;
}

export enum KitchenSinkExpandModes {
  AlongSideTheVideo = 'alongside',
  Hidden = 'hidden',
  OverTheVideo = 'over',
}

export enum KitchenSinkPositions {
  Top = 'top',
  Left = 'left',
  Right = 'right',
  Bottom = 'bottom',
}

export interface KitchenSinkItemData {
  label: string;
  renderIcon: (isActive: boolean) => ComponentChild | JSX.Element;
  expandMode: KitchenSinkExpandModes;
  position: KitchenSinkPositions;
  fillContainer?: boolean;
  renderContent: (props: KitchenSinkContentRendererProps) => ComponentChild;
}
