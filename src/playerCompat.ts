import { h, Component } from "preact";


export class PlayerCompat {
	constructor(private player: any) {

	}

	getServiceUrl(): string | null {
		try {
			// TODO find the proper api
			// @ts-ignore
			return __kalturaplayerdata.UIConf[Object.keys(__kalturaplayerdata.UIConf)[0]].provider.env.serviceUrl;
		} catch (e) {
			// do nothing
		}

		return null;
	}

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
