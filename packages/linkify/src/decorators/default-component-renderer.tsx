import {ComponentChild} from 'preact';
const {h} = KalturaPlayer.ui.preact;

export default (href: string, text: string, key: number): ComponentChild => {
  return (
    <a href={href} key={key} target={'_blank'} rel={'noopener noreferrer'}>
      {text}
    </a>
  );
};
