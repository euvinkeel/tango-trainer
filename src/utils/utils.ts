import * as constants from "./constants";
import {
	BoardState,
	TileIconType,
	TileState,
	ConstraintType,
	Constraint,
	Coordinate,
} from "../types/types";
import { ensureBoardIsSolvable, getAllViolations } from "./rules";

export const exampleHardGame = "<TANGO:eyJ0aWxlcyI6W3siaWNvblR5cGUiOjAsImxvY2tlZCI6ZmFsc2UsImVycm9yIjpmYWxzZX0seyJpY29uVHlwZSI6MCwibG9ja2VkIjpmYWxzZSwiZXJyb3IiOmZhbHNlfSx7Imljb25UeXBlIjowLCJsb2NrZWQiOmZhbHNlLCJlcnJvciI6ZmFsc2V9LHsiaWNvblR5cGUiOjAsImxvY2tlZCI6ZmFsc2UsImVycm9yIjpmYWxzZX0seyJpY29uVHlwZSI6MCwibG9ja2VkIjpmYWxzZSwiZXJyb3IiOmZhbHNlfSx7Imljb25UeXBlIjowLCJsb2NrZWQiOmZhbHNlLCJlcnJvciI6ZmFsc2V9LHsiaWNvblR5cGUiOjIsImxvY2tlZCI6dHJ1ZSwiZXJyb3IiOmZhbHNlfSx7Imljb25UeXBlIjowLCJsb2NrZWQiOmZhbHNlLCJlcnJvciI6ZmFsc2V9LHsiaWNvblR5cGUiOjAsImxvY2tlZCI6ZmFsc2UsImVycm9yIjpmYWxzZX0seyJpY29uVHlwZSI6MCwibG9ja2VkIjpmYWxzZSwiZXJyb3IiOmZhbHNlfSx7Imljb25UeXBlIjowLCJsb2NrZWQiOmZhbHNlLCJlcnJvciI6ZmFsc2V9LHsiaWNvblR5cGUiOjAsImxvY2tlZCI6ZmFsc2UsImVycm9yIjpmYWxzZX0seyJpY29uVHlwZSI6MiwibG9ja2VkIjp0cnVlLCJlcnJvciI6ZmFsc2V9LHsiaWNvblR5cGUiOjEsImxvY2tlZCI6dHJ1ZSwiZXJyb3IiOmZhbHNlfSx7Imljb25UeXBlIjowLCJsb2NrZWQiOmZhbHNlLCJlcnJvciI6ZmFsc2V9LHsiaWNvblR5cGUiOjIsImxvY2tlZCI6dHJ1ZSwiZXJyb3IiOmZhbHNlfSx7Imljb25UeXBlIjowLCJsb2NrZWQiOmZhbHNlLCJlcnJvciI6ZmFsc2V9LHsiaWNvblR5cGUiOjAsImxvY2tlZCI6ZmFsc2UsImVycm9yIjpmYWxzZX0seyJpY29uVHlwZSI6MCwibG9ja2VkIjpmYWxzZSwiZXJyb3IiOmZhbHNlfSx7Imljb25UeXBlIjowLCJsb2NrZWQiOmZhbHNlLCJlcnJvciI6ZmFsc2V9LHsiaWNvblR5cGUiOjAsImxvY2tlZCI6ZmFsc2UsImVycm9yIjpmYWxzZX0seyJpY29uVHlwZSI6MSwibG9ja2VkIjp0cnVlLCJlcnJvciI6ZmFsc2V9LHsiaWNvblR5cGUiOjAsImxvY2tlZCI6ZmFsc2UsImVycm9yIjpmYWxzZX0seyJpY29uVHlwZSI6MCwibG9ja2VkIjpmYWxzZSwiZXJyb3IiOmZhbHNlfSx7Imljb25UeXBlIjowLCJsb2NrZWQiOmZhbHNlLCJlcnJvciI6ZmFsc2V9LHsiaWNvblR5cGUiOjAsImxvY2tlZCI6ZmFsc2UsImVycm9yIjpmYWxzZX0seyJpY29uVHlwZSI6MCwibG9ja2VkIjpmYWxzZSwiZXJyb3IiOmZhbHNlfSx7Imljb25UeXBlIjowLCJsb2NrZWQiOmZhbHNlLCJlcnJvciI6ZmFsc2V9LHsiaWNvblR5cGUiOjAsImxvY2tlZCI6ZmFsc2UsImVycm9yIjpmYWxzZX0seyJpY29uVHlwZSI6MCwibG9ja2VkIjpmYWxzZSwiZXJyb3IiOmZhbHNlfSx7Imljb25UeXBlIjowLCJsb2NrZWQiOmZhbHNlLCJlcnJvciI6ZmFsc2V9LHsiaWNvblR5cGUiOjAsImxvY2tlZCI6ZmFsc2UsImVycm9yIjpmYWxzZX0seyJpY29uVHlwZSI6MCwibG9ja2VkIjpmYWxzZSwiZXJyb3IiOmZhbHNlfSx7Imljb25UeXBlIjoyLCJsb2NrZWQiOnRydWUsImVycm9yIjpmYWxzZX0seyJpY29uVHlwZSI6MCwibG9ja2VkIjpmYWxzZSwiZXJyb3IiOmZhbHNlfSx7Imljb25UeXBlIjowLCJsb2NrZWQiOmZhbHNlLCJlcnJvciI6ZmFsc2V9XSwiY29uc3RyYWludHMiOlt7ImNvbnN0cmFpbnRUeXBlIjoxLCJjb29yZGluYXRlMSI6eyJyb3ciOjUsImNvbHVtbiI6MH0sImNvb3JkaW5hdGUyIjp7InJvdyI6NSwiY29sdW1uIjoxfX0seyJjb25zdHJhaW50VHlwZSI6MSwiY29vcmRpbmF0ZTEiOnsicm93IjoyLCJjb2x1bW4iOjV9LCJjb29yZGluYXRlMiI6eyJyb3ciOjMsImNvbHVtbiI6NX19LHsiY29uc3RyYWludFR5cGUiOjEsImNvb3JkaW5hdGUxIjp7InJvdyI6NCwiY29sdW1uIjo1fSwiY29vcmRpbmF0ZTIiOnsicm93Ijo0LCJjb2x1bW4iOjR9fSx7ImNvbnN0cmFpbnRUeXBlIjowLCJjb29yZGluYXRlMSI6eyJyb3ciOjQsImNvbHVtbiI6MX0sImNvb3JkaW5hdGUyIjp7InJvdyI6MywiY29sdW1uIjoxfX0seyJjb25zdHJhaW50VHlwZSI6MSwiY29vcmRpbmF0ZTEiOnsicm93IjowLCJjb2x1bW4iOjF9LCJjb29yZGluYXRlMiI6eyJyb3ciOjAsImNvbHVtbiI6Mn19XSwicm93cyI6NiwiY29sdW1ucyI6Nn0=>"
export const exampleNonTrivialGame = "<TANGO:eyJ0aWxlcyI6W3siaWNvblR5cGUiOjAsImxvY2tlZCI6ZmFsc2UsImVycm9yIjpmYWxzZX0seyJpY29uVHlwZSI6MCwibG9ja2VkIjpmYWxzZSwiZXJyb3IiOmZhbHNlfSx7Imljb25UeXBlIjowLCJsb2NrZWQiOmZhbHNlLCJlcnJvciI6ZmFsc2V9LHsiaWNvblR5cGUiOjAsImxvY2tlZCI6ZmFsc2UsImVycm9yIjpmYWxzZX0seyJpY29uVHlwZSI6MiwibG9ja2VkIjp0cnVlLCJlcnJvciI6ZmFsc2V9LHsiaWNvblR5cGUiOjAsImxvY2tlZCI6ZmFsc2UsImVycm9yIjpmYWxzZX0seyJpY29uVHlwZSI6MiwibG9ja2VkIjp0cnVlLCJlcnJvciI6ZmFsc2V9LHsiaWNvblR5cGUiOjAsImxvY2tlZCI6ZmFsc2UsImVycm9yIjpmYWxzZX0seyJpY29uVHlwZSI6MCwibG9ja2VkIjpmYWxzZSwiZXJyb3IiOmZhbHNlfSx7Imljb25UeXBlIjowLCJsb2NrZWQiOmZhbHNlLCJlcnJvciI6ZmFsc2V9LHsiaWNvblR5cGUiOjAsImxvY2tlZCI6ZmFsc2UsImVycm9yIjpmYWxzZX0seyJpY29uVHlwZSI6MCwibG9ja2VkIjpmYWxzZSwiZXJyb3IiOmZhbHNlfSx7Imljb25UeXBlIjoyLCJsb2NrZWQiOnRydWUsImVycm9yIjpmYWxzZX0seyJpY29uVHlwZSI6MSwibG9ja2VkIjp0cnVlLCJlcnJvciI6ZmFsc2V9LHsiaWNvblR5cGUiOjAsImxvY2tlZCI6ZmFsc2UsImVycm9yIjpmYWxzZX0seyJpY29uVHlwZSI6MiwibG9ja2VkIjp0cnVlLCJlcnJvciI6ZmFsc2V9LHsiaWNvblR5cGUiOjAsImxvY2tlZCI6ZmFsc2UsImVycm9yIjpmYWxzZX0seyJpY29uVHlwZSI6MCwibG9ja2VkIjpmYWxzZSwiZXJyb3IiOmZhbHNlfSx7Imljb25UeXBlIjowLCJsb2NrZWQiOmZhbHNlLCJlcnJvciI6ZmFsc2V9LHsiaWNvblR5cGUiOjAsImxvY2tlZCI6ZmFsc2UsImVycm9yIjpmYWxzZX0seyJpY29uVHlwZSI6MCwibG9ja2VkIjpmYWxzZSwiZXJyb3IiOmZhbHNlfSx7Imljb25UeXBlIjoxLCJsb2NrZWQiOnRydWUsImVycm9yIjpmYWxzZX0seyJpY29uVHlwZSI6MCwibG9ja2VkIjpmYWxzZSwiZXJyb3IiOmZhbHNlfSx7Imljb25UeXBlIjowLCJsb2NrZWQiOmZhbHNlLCJlcnJvciI6ZmFsc2V9LHsiaWNvblR5cGUiOjAsImxvY2tlZCI6ZmFsc2UsImVycm9yIjpmYWxzZX0seyJpY29uVHlwZSI6MCwibG9ja2VkIjpmYWxzZSwiZXJyb3IiOmZhbHNlfSx7Imljb25UeXBlIjowLCJsb2NrZWQiOmZhbHNlLCJlcnJvciI6ZmFsc2V9LHsiaWNvblR5cGUiOjAsImxvY2tlZCI6ZmFsc2UsImVycm9yIjpmYWxzZX0seyJpY29uVHlwZSI6MCwibG9ja2VkIjpmYWxzZSwiZXJyb3IiOmZhbHNlfSx7Imljb25UeXBlIjowLCJsb2NrZWQiOmZhbHNlLCJlcnJvciI6ZmFsc2V9LHsiaWNvblR5cGUiOjAsImxvY2tlZCI6ZmFsc2UsImVycm9yIjpmYWxzZX0seyJpY29uVHlwZSI6MCwibG9ja2VkIjpmYWxzZSwiZXJyb3IiOmZhbHNlfSx7Imljb25UeXBlIjowLCJsb2NrZWQiOmZhbHNlLCJlcnJvciI6ZmFsc2V9LHsiaWNvblR5cGUiOjIsImxvY2tlZCI6dHJ1ZSwiZXJyb3IiOmZhbHNlfSx7Imljb25UeXBlIjowLCJsb2NrZWQiOmZhbHNlLCJlcnJvciI6ZmFsc2V9LHsiaWNvblR5cGUiOjAsImxvY2tlZCI6ZmFsc2UsImVycm9yIjpmYWxzZX1dLCJjb25zdHJhaW50cyI6W3siY29uc3RyYWludFR5cGUiOjEsImNvb3JkaW5hdGUxIjp7InJvdyI6NSwiY29sdW1uIjowfSwiY29vcmRpbmF0ZTIiOnsicm93Ijo1LCJjb2x1bW4iOjF9fSx7ImNvbnN0cmFpbnRUeXBlIjoxLCJjb29yZGluYXRlMSI6eyJyb3ciOjIsImNvbHVtbiI6NX0sImNvb3JkaW5hdGUyIjp7InJvdyI6MywiY29sdW1uIjo1fX0seyJjb25zdHJhaW50VHlwZSI6MSwiY29vcmRpbmF0ZTEiOnsicm93Ijo0LCJjb2x1bW4iOjV9LCJjb29yZGluYXRlMiI6eyJyb3ciOjQsImNvbHVtbiI6NH19LHsiY29uc3RyYWludFR5cGUiOjAsImNvb3JkaW5hdGUxIjp7InJvdyI6NCwiY29sdW1uIjoxfSwiY29vcmRpbmF0ZTIiOnsicm93IjozLCJjb2x1bW4iOjF9fSx7ImNvbnN0cmFpbnRUeXBlIjoxLCJjb29yZGluYXRlMSI6eyJyb3ciOjAsImNvbHVtbiI6MX0sImNvb3JkaW5hdGUyIjp7InJvdyI6MCwiY29sdW1uIjoyfX1dLCJyb3dzIjo2LCJjb2x1bW5zIjo2fQ==>"

export const chooseRandom = <T>(arr: T[]): T =>
	arr[Math.floor(Math.random() * arr.length)];
export const chooseRandomWithDist = <T>(
	arr: T[],
	probabilityDist: number[]
): T => {
	const total = probabilityDist.reduce((a, b) => a + b, 0);
	const rand = Math.random() * total;
	let sum = 0;
	for (let i = 0; i < arr.length; i++) {
		sum += probabilityDist[i];
		if (rand < sum) {
			return arr[i];
		}
	}
	return arr[arr.length - 1];
};
export const chance = (probability: number): boolean =>
	Math.random() < probability;
export const getRandInt = (min: number, max: number): number =>
	Math.floor(Math.random() * (max - min + 1)) + min;
export const range = (start: number, end: number) =>
	Array.from({ length: end - start }, (_, i) => start + i);

export const shuffle = <T>(arr: T[]): T[] => {
	const shuffled = [...arr];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
};

export const createBoardString = (boardState: BoardState): string => {
	const jsonString = JSON.stringify(boardState);
	const base64String = btoa(jsonString);
	return `<TANGO:${base64String}>`;
};

export const deserBoardString = (tangoString: string): BoardState => {
	if (!tangoString.startsWith("<TANGO:")) {
		throw new Error("Invalid encoded board state string.");
	}
	const base64String = tangoString.substring(7).split(">")[0];

	try {
		// Decode from Base64
		const jsonString = atob(base64String);

		// Parse JSON into a plain object
		const parsedData = JSON.parse(jsonString);
		return {
			tiles: parsedData.tiles.map((tile: { iconType: TileIconType; locked: boolean; error: boolean }) => ({
				iconType: tile.iconType,
				locked: tile.locked,
				error: tile.error,
			})),
			constraints: parsedData.constraints.map((constraint: Constraint) => ({
				constraintType: constraint.constraintType,
				coordinate1: {
					row: constraint.coordinate1.row,
					column: constraint.coordinate1.column,
				},
				coordinate2: {
					row: constraint.coordinate2.row,
					column: constraint.coordinate2.column,
				},
			})),
			rows: parsedData.rows,
			columns: parsedData.columns,
		};
	} catch {
		throw new Error(`Failed to deserialize board state`);
	}
};

export const clearAllEditableIndices = (boardState: BoardState): BoardState => {
	return {
		tiles: boardState.tiles.map((tile) => ({ ...tile, iconType: tile.locked ? tile.iconType : TileIconType.EMPTY })),
		constraints: boardState.constraints,
		rows: boardState.rows,
		columns: boardState.columns
	};
}

export const generateAllValidSolutions = (
	boardState: BoardState,
	maxSolutions: number = 10
): TileIconType[][] => {
	const solutions: TileIconType[][] = [];
	const board = structuredClone(boardState);

	const backtrack = (index: number) => {
		if (solutions.length >= maxSolutions) {
			return;
		}

		if (getAllViolations(board).length > 0) {
			return;
		}

		if (index >= board.tiles.length) {
			solutions.push(board.tiles.map((tile) => tile.iconType));
			return;
		}

		if (
			board.tiles[index].locked ||
			board.tiles[index].iconType !== TileIconType.EMPTY
		) {
			backtrack(index + 1);
			return;
		}

		const iconorder = shuffle([TileIconType.MOON, TileIconType.SUN]);
		for (const icon of iconorder) {
			board.tiles[index].iconType = icon;
			backtrack(index + 1);
		}
		board.tiles[index].iconType = TileIconType.EMPTY;
		return;
	};

	backtrack(0);
	return solutions;
};

export const generateRandomTileState = (): TileState => {
	return {
		iconType: chooseRandomWithDist(
			[TileIconType.EMPTY, TileIconType.SUN, TileIconType.MOON],
			[7, 1, 1]
		),
		locked: chance(0.2),
		error: false,
	};
};

export const generateRandomConstraint = (
	rows: number,
	columns: number
): Constraint => {
	if (rows < 2 || columns < 2) {
		throw new Error("Board must have at least 2 rows");
	}

	const row1 = getRandInt(0, rows - 1);
	const column1 = getRandInt(0, columns - 1);
	for (const [dr, dc] of shuffle([
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
	])) {
		const row2 = row1 + dr;
		const column2 = column1 + dc;
		if (row2 >= 0 && row2 < rows && column2 >= 0 && column2 < columns) {
			return {
				constraintType: chooseRandom([
					ConstraintType.OPPOSITE,
					ConstraintType.EQUAL,
				]),
				coordinate1: {
					row: row1,
					column: column1,
				},
				coordinate2: {
					row: row2,
					column: column2,
				},
			};
		}
	}

	throw new Error("Failed to generate constraint");
};

export const getIconTypeAsEmoji = (iconType: TileIconType) =>
	iconType === TileIconType.EMPTY
		? "⬜"
		: iconType === TileIconType.SUN
		? "☀️"
		: "🔵";
export const getBoardStateAsString = (
	boardState: BoardState,
	highlight?: Coordinate
) => {
	let out = "";
	for (let rowIndex = 0; rowIndex < boardState.rows; rowIndex++) {
		const row = getRows(boardState)[rowIndex];
		out +=
			row
				.map((tile, colIndex) => {
					if (
						highlight &&
						highlight.row === rowIndex &&
						highlight.column === colIndex
					) {
						return "🟥";
					}
					return getIconTypeAsEmoji(tile.iconType);
				})
				.join("") + "\n";
	}
	return out;
};

export const blankBoardState = {
	rows: 6,
	columns: 6,
	constraints: [],
	tiles: Array(6*6).map(() => ({iconType: TileIconType.EMPTY, locked: false, error: false})),
}

export const generateRandomValidBoardState = (
	rows: number = constants.DEFAULT_BOARD_HEIGHT,
	columns: number = constants.DEFAULT_BOARD_WIDTH,
	constraintAmount: number = 5
): BoardState => {
	console.log("Generating a random valid board state starting now");

	// let newBoardState = deserBoardString(exampleNonTrivialGame);
	const makeEasy = true;
	let newBoardState = generateRandomBoardState(
		rows,
		columns,
		constraintAmount
	);
	let solutions: TileIconType[][] = generateAllValidSolutions(newBoardState, 2);

	while (solutions.length !== 1) {
		// console.log("nope, throw that away");
		newBoardState = generateRandomBoardState(
			rows,
			columns,
			constraintAmount
		);
		solutions = generateAllValidSolutions(newBoardState, 2);
	}

	// console.log("YAY :D got one solution for board:");
	const solutionState = structuredClone(newBoardState);
	// console.log(getBoardStateAsString(solutionState));
	solutions[0].forEach((tileIcon, index) => {
		solutionState.tiles[index].iconType = tileIcon;
	});
	// console.log(getBoardStateAsString(solutionState));
	let finalBoardState = newBoardState;

	if (makeEasy) {
		// console.log("and let's make sure this is solvable:");
		finalBoardState = ensureBoardIsSolvable(newBoardState, solutionState);
	}

	console.log("done! final board is:");
	console.log(getBoardStateAsString(finalBoardState));
	console.log(createBoardString(finalBoardState));

	return finalBoardState;
};

export const generateRandomBoardState = (
	rows: number = constants.DEFAULT_BOARD_HEIGHT,
	columns: number = constants.DEFAULT_BOARD_WIDTH,
	constraintAmount: number = 5
): BoardState => {
	const tiles = Array(rows * columns)
		.fill({})
		.map(generateRandomTileState);
	tiles.forEach((tile) => {
		tile.locked = tile.iconType !== TileIconType.EMPTY;
	});
	const takenCoordinates = new Set<string>();
	const constraints = Array(constraintAmount)
		.fill({})
		.map(() => {
			let newConstraint = generateRandomConstraint(rows, columns);
			let pairKey = `${newConstraint.coordinate1.row},${newConstraint.coordinate1.column}-${newConstraint.coordinate2.row},${newConstraint.coordinate2.column}`;
			while (takenCoordinates.has(pairKey)) {
				newConstraint = generateRandomConstraint(rows, columns);
				pairKey = `${newConstraint.coordinate1.row},${newConstraint.coordinate1.column}-${newConstraint.coordinate2.row},${newConstraint.coordinate2.column}`;
			}
			takenCoordinates.add(pairKey);
			return newConstraint;
		});
	return { tiles, constraints, rows, columns };
};

export const isVerticalConstraint = (constraint: Constraint) =>
	constraint.coordinate1.column === constraint.coordinate2.column;
export const coordinateToIndex = (
	boardState: BoardState,
	coord: Coordinate
): number => coord.row * boardState.columns + coord.column;
export const indexToCoordinate = (
	boardState: BoardState,
	index: number
): Coordinate => ({
	row: Math.floor(index / boardState.columns),
	column: index % boardState.columns,
});
export const getNextTileIcon = (currentTileIcon: TileIconType): TileIconType =>
	currentTileIcon === TileIconType.EMPTY
		? TileIconType.SUN
		: currentTileIcon === TileIconType.SUN
		? TileIconType.MOON
		: TileIconType.EMPTY;
export const getRow = (boardState: BoardState, rowIndex: number): TileState[] =>
	range(0, boardState.columns).map(
		(i) => boardState.tiles[i + boardState.columns * rowIndex]
	);
export const getColumn = (
	boardState: BoardState,
	columnIndex: number
): TileState[] =>
	range(0, boardState.rows).map(
		(i) => boardState.tiles[columnIndex + i * boardState.columns]
	);
export const getRows = (boardState: BoardState): TileState[][] =>
	range(0, boardState.rows).map((rowIndex) => getRow(boardState, rowIndex));
export const getColumns = (boardState: BoardState): TileState[][] =>
	range(0, boardState.columns).map((columnIndex) =>
		getColumn(boardState, columnIndex)
	);
export const getRowCoordinates = (
	boardState: BoardState,
	rowIndex: number
): Coordinate[] =>
	range(0, boardState.columns).map((columnIndex) => ({
		row: rowIndex,
		column: columnIndex,
	}));
export const getColumnCoordinates = (
	boardState: BoardState,
	columnIndex: number
): Coordinate[] =>
	range(0, boardState.rows).map((rowIndex) => ({
		row: rowIndex,
		column: columnIndex,
	}));
export const getTileIconCounts = (
	tileStates: TileState[]
): { [key in TileIconType]: number } =>
	tileStates.reduce(
		(counts, tileState) => {
			counts[tileState.iconType]++;
			return counts;
		},
		{
			[TileIconType.EMPTY]: 0,
			[TileIconType.SUN]: 0,
			[TileIconType.MOON]: 0,
		}
	);

export const changeBoardTileIcons = (
	boardState: BoardState,
	changes: [Coordinate, TileIconType][]
): BoardState => {
	const newTiles = boardState.tiles.map((tile, index) => {
		const change = changes.find(
			([coord]) => coordinateToIndex(boardState, coord) === index
		);
		return change ? { ...tile, iconType: change[1] } : tile;
	});
	return { ...boardState, tiles: newTiles };
};

export const changeBoardTileIconIndex = (
	boardState: BoardState,
	index: number,
	iconType: TileIconType
): BoardState => {
	const newBoardState = {
		...boardState,
		tiles: boardState.tiles.map((tile, i) =>
			i === index ? { ...tile, iconType } : tile
		),
	};
	return newBoardState;
};
