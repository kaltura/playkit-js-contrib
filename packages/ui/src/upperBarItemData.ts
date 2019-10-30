import {UpperBarItemProps} from './upperBarItem';
import {ComponentChild} from 'preact';

export interface UpperBarItemData {
  label: string;
  renderItem: (upperBarUIProps: UpperBarItemProps) => ComponentChild;
  onClick: () => void;
}
