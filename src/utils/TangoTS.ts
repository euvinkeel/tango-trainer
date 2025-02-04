import { BoardState, Coordinate, TileIconType } from "../types/types";
import { isWinState, updateBoardTileStateErrors } from "./rules";
import {
	blankBoardState,
	changeBoardTileIcons,
	clearAllEditableIndices,
	coordinateToIndex,
	generateRandomValidBoardState,
	getNextTileIcon,
	indexToCoordinate,
} from "./utils";

export interface TangoTSConfig {
	enableTimer?: boolean; // must cover the game before timer starts
	enableRegeneration?: boolean;
	enableReset?: boolean;
	startingBoardState?: BoardState;
}

export default class TangoTS {
	private _config: TangoTSConfig;

	// private _winCallback: (timeElapsed: number) => void = () => {};
	// private _changeCallback: (oldBoardState: BoardState, newBoardState: BoardState, completeReplace?: boolean) => void = () => {};
	private _boardState: BoardState = blankBoardState;

	private _winCallbacks: {
		[key: string]: (timeElapsed: number) => void;
	} = {};
	private _changeCallbacks: {
		[key: string]: (
			oldBoardState: BoardState,
			newBoardState: BoardState,
			completeReplace?: boolean
		) => void;
	} = {};
	private _isAWinState: boolean = false;
	private _isCovered: boolean = false;

	private _startTickMs: number = Date.now();

	constructor(config: TangoTSConfig) {
		this._config = { ...config }; // use spread operator to clone config object
		const oldBoardState = this._boardState;
		this._boardState =
			config.startingBoardState ?? generateRandomValidBoardState(6, 6);
		this._changeCallback(oldBoardState, this._boardState, true);
		if (config.enableTimer === true) {
			this._isCovered = true;
		} else {
			// immediately start
			this.startGameAndTimer();
		}
	}

	public get isCovered() {
		return this._isCovered;
	}

	public get isAWinState() {
		return this._isAWinState;
	}

	public get boardState() {
		return this._boardState;
	}

	public get config() {
		return this._config;
	}

	public startGameAndTimer() {
		this._startTickMs = Date.now();
		this._isCovered = false;
	}

	/*
	 * Immutably updates the board state (and highlights any violation cells that arise from the change)
	 */
	public changeTileAtCoordinate(
		coordinate: Coordinate,
		tileIconType?: TileIconType
	) {
		const index = coordinateToIndex(this._boardState, coordinate);
		return this.changeTileAtIndex(index, tileIconType);
	}

	public changeTileAtIndex(index: number, tileIconType?: TileIconType) {
		const coordinate = indexToCoordinate(this._boardState, index);
		const targetTile = this._boardState.tiles[index];
		if (targetTile.locked) {
			// throw new Error("Cannot change locked tile");
			return;
		}
		const oldBoardState = this._boardState;
		const newBoardState = changeBoardTileIcons(this._boardState, [
			[coordinate, tileIconType ?? getNextTileIcon(targetTile.iconType)],
		]);
		this._changeCallback(oldBoardState, newBoardState, false);
	}

	public regenerateBoard() {
		const oldBoardState = this._boardState;
		this._boardState = generateRandomValidBoardState(
			this._boardState.rows,
			this._boardState.columns
		);
		this._changeCallback(oldBoardState, this._boardState, true);
	}

	public resetBoard() {
		const oldBoardState = this._boardState;
		this._boardState = clearAllEditableIndices(this._boardState);
		this._changeCallback(oldBoardState, this._boardState, false);
	}

	public addWinCallback(
		key: string,
		callback: (timeElapsed: number) => void
	): () => void {
		this._winCallbacks[key] = callback;
		return () => {
			this.removeWinCallback(key);
		};
	}

	public removeWinCallback(key: string): void {
		delete this._winCallbacks[key];
	}

	public addChangeCallback(
		key: string,
		callback: (
			oldBoardState: BoardState,
			newBoardState: BoardState,
			completeReplace?: boolean
		) => void
	): () => void {
		// console.log(`Adding change callback for ${key}`);
		this._changeCallbacks[key] = callback;
		return () => {
			this.removeChangeCallback(key);
		};
	}

	public removeChangeCallback(key: string): void {
		// console.log(`Removing change callback for ${key}`);
		delete this._changeCallbacks[key];
	}

	private _winCallback(timeElapsed: number): void {
		for (const key in this._winCallbacks) {
			this._winCallbacks[key](timeElapsed);
		}
	}

	private _changeCallback(
		oldBoardState: BoardState,
		newBoardState: BoardState,
		completeReplace?: boolean
	): void {
		this._isAWinState = isWinState(newBoardState);
		newBoardState = updateBoardTileStateErrors(newBoardState);
		this._boardState = newBoardState;

		if (this._isAWinState) {
			const winTick = Date.now();
			const elapsedSeconds = (winTick - this._startTickMs) / 1000;
			this._winCallback(elapsedSeconds);
		}

		// console.log(`I have ${Object.keys(this._changeCallbacks).length} callbacks.`)

		for (const key in this._changeCallbacks) {
			this._changeCallbacks[key](oldBoardState, newBoardState, completeReplace);
		}
	}
}
