import { h, Component } from "preact";

export class PlayerCompat {
  constructor(private player: any) {}

  // addPortalElement(createElement: () => Component<any, any>) {
  // 	// TODO check if it changes after media change
  // 	const playerViewId = this.player.getView().id;
  // 	const playerParentElement = this.player.getView(); //document.getElementById(`div#${playerViewId}`);
  //
  // 	if (!playerParentElement) {
  // 		// TODO decide what to do if failed to find parent
  // 		return;
  // 	}
  // }
}
