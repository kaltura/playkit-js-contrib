import {ComponentChild, Ref} from 'preact';
import {PlayerSize, VideoSize} from './common.types';

export enum OverlayPositions {
  PlayerArea = 'PlayerArea',
}

export interface OverlayItemData {
  label: string;
  renderContent: (overlayItemProps: OverlayItemProps) => ComponentChild;
  className?: string;
  position: OverlayPositions;
}

export interface OverlayItemProps {}
