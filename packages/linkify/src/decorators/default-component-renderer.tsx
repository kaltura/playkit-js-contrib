const {h} = KalturaPlayer.ui.preact;

// @ts-ignore:
export default (href: string, text: string, key: number): ComponentChild => {
  return (
    <a href={href} key={key} target={'_blank'} rel={'noopener noreferrer'}>
      {text}
    </a>
  );
};
