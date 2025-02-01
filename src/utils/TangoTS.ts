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

	private _winCallbacks: ((timeElapsed: number) => void)[] = [];
	private _changeCallbacks: ((
		oldBoardState: BoardState,
		newBoardState: BoardState,
		completeReplace?: boolean,
	) => void)[] = [];

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
			throw new Error("Cannot change locked tile");
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

	public addWinCallback(callback: (timeElapsed: number) => void): () => void {
		this._winCallbacks.push(callback);
		return () => {
			this._winCallbacks.splice(
				this._winCallbacks.indexOf(callback),
				1
			)
		};
	}

	public addChangeCallback(
		callback: (
			oldBoardState: BoardState,
			newBoardState: BoardState,
			completeReplace?: boolean
		) => void
	): () => void {
		this._changeCallbacks.push(callback);
		return () => {
			this._changeCallbacks.splice(
				this._changeCallbacks.indexOf(callback),
				1
			)
		};
	}

	private _winCallback(timeElapsed: number): void {
		this._winCallbacks.forEach((callback) => callback(timeElapsed));
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

		this._changeCallbacks.forEach((callback) =>
			callback(oldBoardState, newBoardState, completeReplace)
		);
	}

	// /*
	// * To be called when the game is won
	// */
	// public setWinCallback(callback: (timeElapsed: number) => void): void {
	// 	if (typeof callback !== 'function') {
	// 		throw new Error('Invalid win callback. It must be a function.');
	// 	}
	// 	this._winCallback = callback;
	// }

	// /*
	// * To be called anytime the board changes; includes board initialization and regeneration
	// */
	// public setChangeCallback(callback: (oldBoardState: BoardState, newBoardState: BoardState, completeReplace?: boolean) => void): void {
	// 	if (typeof callback !== 'function') {
	// 		throw new Error('Invalid change callback. It must be a function.');
	// 	}
	// 	this._changeCallback = callback;
	// }
}
