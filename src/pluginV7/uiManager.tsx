import { h, render, cloneElement } from 'preact';


export class UIManager {
	private _root: any;
	private _player: any;
	private _rootParent: any;
	private _rootRef: any;
	private _renderRoot: () => any;

	constructor(private plugin: any, renderProp: any) {
		this._renderRoot = renderProp;
		this._player = plugin.player;
		this._addBindings();
	}

	private _addBindings() {
		this.plugin.eventManager.listen(this._player, this._player.Event.MEDIA_LOADED, this._createRoot);
	}

	public get root(): any {
		return this._rootRef;
	}

	private _createRoot = () : void => {
		if (this._root) {
			return;
		}

		// TODO check if it changes after media change
		const playerViewId = this._player.config.targetId;
		const playerParentElement = document.querySelector(`div#${playerViewId} div#player-gui`);

		if (!playerParentElement) {
			return;
		}

		this._rootParent = document.createElement('div');
		this._rootParent.setAttribute("id", "hotspots-overlay");
		playerParentElement.append(this._rootParent);

		const Root = cloneElement(this._renderRoot(),
			{
				ref:(ref: any) => (this._rootRef = ref)
			});


		this._root = render(
			Root,
		this._rootParent
	);
	}
}
