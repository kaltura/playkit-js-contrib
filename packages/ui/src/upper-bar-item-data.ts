import {UpperBarItemProps} from './upper-bar-item';
import {ComponentChild} from 'preact';

export interface UpperBarItemData {
  label: string;
  renderItem: (upperBarUIProps: UpperBarItemProps) => ComponentChild;
  onClick: () => void;
}
