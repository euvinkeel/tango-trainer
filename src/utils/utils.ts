import * as constants from "./constants";
import { BoardState, TileIconType, TileState, ConstraintType, Constraint, Coordinate } from "../types/types";
import { getAllViolations } from "./rules";

export const chooseRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
export const chooseRandomWithDist = <T>(arr: T[], probabilityDist: number[]): T => {
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
}
export const chance = (probability: number): boolean => Math.random() < probability;
export const getRandInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
export const range = (start: number, end: number) => Array.from({ length: end - start }, (_, i) => start + i);

export const shuffle = <T>(arr: T[]): T[] => {
	const shuffled = [...arr];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

// export const generatePossible = (boardState: BoardState, maxSolutions: number = 10): TileIconType[][] => {

export const generateAllValidSolutions = (boardState: BoardState, maxSolutions: number = 10): TileIconType[][] => {
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
			return
		}

		if (board.tiles[index].locked || board.tiles[index].iconType !== TileIconType.EMPTY) {
			backtrack(index + 1); // just skip ts
			return
		}

		const iconorder = shuffle([TileIconType.MOON, TileIconType.SUN]);
		for (const icon of iconorder) {
			board.tiles[index].iconType = icon;
			backtrack(index + 1); // may or may not be a good square
		}
		board.tiles[index].iconType = TileIconType.EMPTY; // reset our square and back up
		return;
	}

	backtrack(0)
	return solutions;
}

// export const generateValidRowTileIcons = (columns: number): TileIconType[] => {
// 	const currRow: TileIconType[] = []
// 	const moonsLeft = columns // 2;
// 	const sunsLeft = columns // 2;


// 	for (let i = 0; i < columns; i++) {
// 		if (i < 2) {
// 			currRow.push(chooseRandom([TileIconType.SUN, TileIconType.MOON]))
// 		} else {
// 			// we have two icons before us.


// 			if (currRow[i - 1] == currRow[i - 2]) {
// 				// two icons before us are the same. we can only add the opposite icon.
// 				currRow.push(currRow[i - 1] == TileIconType.SUN ? TileIconType.MOON : TileIconType.SUN)
// 			} else {
// 				currRow.push(chooseRandom([TileIconType.SUN, TileIconType.MOON]))
// 			}
// 		}
// 	}
// 	return currRow
// }
// export const generateValidTileStates = (): TileState[] => {
// 	// Generate a list of valid tiles without constraints.
// }

export const generateRandomTileState = (): TileState => {
	return {
		iconType: chooseRandomWithDist(
			[TileIconType.EMPTY, TileIconType.SUN, TileIconType.MOON],
			[5, 1, 1],
		),
		locked: chance(0.2),
		error: false,
	};
}

export const generateRandomConstraint = (rows: number, columns: number): Constraint => {
	if (rows < 2 || columns < 2) {
		throw new Error("Board must have at least 2 rows");
	}

	const row1 = getRandInt(0, rows-1)
	const column1 = getRandInt(0, columns-1)
	for (const [dr, dc] of shuffle([[-1, 0], [1, 0], [0, -1], [0, 1]])) {
		const row2 = row1 + dr
		const column2 = column1 + dc
		if (row2 >= 0 && row2 < rows && column2 >= 0 && column2 < columns) {
			return {
				constraintType: chooseRandom([ConstraintType.OPPOSITE, ConstraintType.EQUAL]),
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
}

export const getIconTypeAsEmoji = (iconType: TileIconType) => iconType === TileIconType.EMPTY ? "⬜" : iconType === TileIconType.SUN ? "☀️" : "🔵";
export const getBoardStateAsString = (boardState: BoardState) => {
	let out = "";
	for (const row of getRows(boardState)) {
		out += row.map((tile) => getIconTypeAsEmoji(tile.iconType)).join("") + "\n";
	}
	return out;
}

export const generateRandomValidBoardState = (
	rows: number = constants.DEFAULT_BOARD_HEIGHT,
	columns: number = constants.DEFAULT_BOARD_WIDTH,
	constraintAmount: number = 5,
): BoardState => {
	console.log("Generating a random valid board state starting now");
	let newBoardState = generateRandomBoardState(rows, columns, constraintAmount);
	let solutions: TileIconType[][] = [];

	while (solutions.length !== 1)  {
		console.log("nope, throw that away");
		newBoardState = generateRandomBoardState(rows, columns, constraintAmount);
		solutions = generateAllValidSolutions(newBoardState, 2);
	}

	console.log("YAY :D got one solution for board:");
	const solutionState = structuredClone(newBoardState);
	console.log(getBoardStateAsString(solutionState));
	solutions[0].forEach((tileIcon, index) => {
		solutionState.tiles[index].iconType = tileIcon;
	})

	console.log(getBoardStateAsString(solutionState));

	return newBoardState
}

export const generateRandomBoardState = (
	rows: number = constants.DEFAULT_BOARD_HEIGHT,
	columns: number = constants.DEFAULT_BOARD_WIDTH,
	constraintAmount: number = 5,
): BoardState => {
	const tiles = Array(rows * columns)
		.fill({})
		.map(generateRandomTileState);
	tiles.forEach((tile) => {
		tile.locked = tile.iconType !== TileIconType.EMPTY;
	})
	const takenCoordinates = new Set<string>();
	const constraints = Array(constraintAmount)
		.fill({})
		.map(() => {
			let newConstraint = generateRandomConstraint(rows, columns)
			let pairKey = `${newConstraint.coordinate1.row},${newConstraint.coordinate1.column}-${newConstraint.coordinate2.row},${newConstraint.coordinate2.column}`
			while (takenCoordinates.has(pairKey)) {
				newConstraint = generateRandomConstraint(rows, columns)
				pairKey = `${newConstraint.coordinate1.row},${newConstraint.coordinate1.column}-${newConstraint.coordinate2.row},${newConstraint.coordinate2.column}`
			}
			takenCoordinates.add(pairKey);
			return newConstraint;
		});
	return { tiles, constraints, rows, columns };
}

export const isVerticalConstraint = (constraint: Constraint) => constraint.coordinate1.column === constraint.coordinate2.column;
export const coordinateToIndex = (boardState: BoardState, coord: Coordinate): number => (coord.row * boardState.columns) + coord.column
export const indexToCoordinate = (boardState: BoardState, index: number): Coordinate => ({ row: Math.floor(index / boardState.columns), column: index % boardState.columns })
export const getNextTileIcon = (currentTileIcon: TileIconType): TileIconType => (currentTileIcon === TileIconType.EMPTY) ? TileIconType.SUN : (currentTileIcon === TileIconType.SUN) ? TileIconType.MOON : TileIconType.EMPTY
export const getRow = (boardState: BoardState, rowIndex: number): TileState[] => range(0, boardState.columns).map(i => boardState.tiles[i + (boardState.columns * rowIndex)]);
export const getColumn = (boardState: BoardState, columnIndex: number): TileState[] => range(0, boardState.rows).map(i => boardState.tiles[columnIndex + (i * boardState.columns)]);
export const getRows = (boardState: BoardState): TileState[][] => range(0, boardState.rows).map(rowIndex => getRow(boardState, rowIndex));
export const getColumns = (boardState: BoardState): TileState[][] => range(0, boardState.columns).map(columnIndex => getColumn(boardState, columnIndex));
export const getRowCoordinates = (boardState: BoardState, rowIndex: number): Coordinate[] => range(0, boardState.columns).map(columnIndex => ({ row: rowIndex, column: columnIndex }));
export const getColumnCoordinates = (boardState: BoardState, columnIndex: number): Coordinate[] => range(0, boardState.rows).map(rowIndex => ({ row: rowIndex, column: columnIndex }));
export const getTileIconCounts = (tileStates: TileState[]): { [key in TileIconType]: number } => tileStates.reduce((counts, tileState) => {
	counts[tileState.iconType]++;
	return counts;
}, {
	[TileIconType.EMPTY]: 0,
	[TileIconType.SUN]: 0,
	[TileIconType.MOON]: 0,
})

/**
 * Returns a new board state based on an array of tile changes.
 * @param boardState - The current state of the board.
 * @param changes - An array of pairs, where each pair consists of a Coordinate and a new TileIconType.
 * @returns The updated BoardState.
 */
export const changeBoardTileIcons = (boardState: BoardState, changes: [Coordinate, TileIconType][]): BoardState => {
	const newTiles = boardState.tiles.map((tile, index) => {
		const change = changes.find(([coord]) => coordinateToIndex(boardState, coord) === index);
		return change ? { ...tile, iconType: change[1] } : tile;
	});
	return { ...boardState, tiles: newTiles };
}

export const changeBoardTileIconIndex = (boardState: BoardState, index: number, iconType: TileIconType): BoardState => {
	const newBoardState = { ...boardState, tiles: boardState.tiles.map((tile, i) => i === index ? { ...tile, iconType } : tile) };
	return newBoardState
}