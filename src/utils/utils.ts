import * as constants from "./constants";
import { Rule, BoardState, TileIconType, TileState, ConstraintType, Constraint, Coordinate, RuleViolation } from "../types/types";

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

export const generateRandomBoardState = (
	rows: number = constants.DEFAULT_BOARD_HEIGHT,
	columns: number = constants.DEFAULT_BOARD_WIDTH
): BoardState => {
	const tiles = Array(rows * columns)
		.fill({})
		.map(generateRandomTileState);
	const takenCoordinates = new Set<string>();
	// const constraints = Array(getRandInt(1, Math.min(rows, columns)))
	const constraints = Array(4)
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

export const updateBoardTileStateErrors = (boardState: BoardState): BoardState => {
	const violations = getAllViolations(boardState);
	const errorCoordinates = violations.flatMap(violation => violation.highlightCoordinates);
	const newTiles = boardState.tiles.map((tile, index) => {
		const coord = indexToCoordinate(boardState, index);
		const isError = errorCoordinates.some(errorCoord => errorCoord.row === coord.row && errorCoord.column === coord.column);
		return { ...tile, error: isError };
	});
	return { ...boardState, tiles: newTiles };
}

export const isVerticalConstraint = (constraint: Constraint) => constraint.coordinate1.column === constraint.coordinate2.column;
export const getAllViolations = (boardState: BoardState): RuleViolation[] => ruleset.flatMap(rule => rule.getViolations(boardState));

export const ruleset: Rule[] = [
	{
		description: "Every row and column must have equal amounts of suns and moons.",
		getViolations: (boardState: BoardState): RuleViolation[] => {
			const violations: RuleViolation[] = [];
			getRows(boardState).forEach((row, rowIndex) => {
				const { [TileIconType.EMPTY]: emptycount, [TileIconType.SUN]: suncount, [TileIconType.MOON]: mooncount } = getTileIconCounts(row);
				if (suncount > (row.length / 2)) {
					violations.push({
						highlightCoordinates: getRowCoordinates(boardState, rowIndex),
						reason: `Row ${rowIndex} has too many suns.`
					});
					return;
				}
				if (mooncount > (row.length / 2)) {
					violations.push({
						highlightCoordinates: getRowCoordinates(boardState, rowIndex),
						reason: `Row ${rowIndex} has too many moons.`
					});
					return;
				}
				if (emptycount > 0) {
					return;
				}
				if (suncount !== mooncount) {
					violations.push({
						highlightCoordinates: getRowCoordinates(boardState, rowIndex),
						reason: `Row ${rowIndex} does not have equal amounts of suns and moons.`
					});
					return;
				}
			});
			getColumns(boardState).forEach((column, columnIndex) => {
				const { [TileIconType.EMPTY]: emptycount, [TileIconType.SUN]: suncount, [TileIconType.MOON]: mooncount } = getTileIconCounts(column);
				if (suncount > (column.length / 2)) {
					violations.push({
						highlightCoordinates: getColumnCoordinates(boardState, columnIndex),
						reason: `Column ${columnIndex} has too many suns.`
					});
					return;
				}
				if (mooncount > (column.length / 2)) {
					violations.push({
						highlightCoordinates: getColumnCoordinates(boardState, columnIndex),
						reason: `Column ${columnIndex} has too many moons.`
					});
					return;
				}
				if (emptycount > 0) {
					return;
				}
				if (suncount !== mooncount) {
					violations.push({
						highlightCoordinates: getColumnCoordinates(boardState, columnIndex),
						reason: `Column ${columnIndex} does not have equal amounts of suns and moons.`
					});
				}
			});
			return violations;
		}
	},
	{
		description: "No three consecutive equivalent tiles in rows or columns.",
		getViolations: (boardState: BoardState): RuleViolation[] => {
			const violations: RuleViolation[] = [];
			
			// Check rows
			getRows(boardState).forEach((row, rowIndex) => {
				range(0, row.length - 2).forEach(i => {
					if (row[i].iconType !== TileIconType.EMPTY && row[i].iconType === row[i + 1].iconType && row[i + 1].iconType === row[i + 2].iconType) {
						violations.push({
							highlightCoordinates: getRowCoordinates(boardState, rowIndex),
							reason: `Row ${rowIndex} has 3 consecutive ${row[i].iconType} tiles.`
						});
					}
				});
			});

			// Check columns
			getColumns(boardState).forEach((column, columnIndex) => {
				range(0, column.length - 2).forEach(i => {
					if (column[i].iconType !== TileIconType.EMPTY && column[i].iconType === column[i + 1].iconType && column[i + 1].iconType === column[i + 2].iconType) {
						violations.push({
							highlightCoordinates: getColumnCoordinates(boardState, columnIndex),
							reason: `Column ${columnIndex} has 3 consecutive ${column[i].iconType} tiles.`
						});
					}
				});
			});

			return violations;
		}
	},
	{
		description: "Two tiles with an X between them must be opposites.",
		getViolations: (boardState: BoardState): RuleViolation[] => {
			const violations: RuleViolation[] = [];
			boardState.constraints.forEach((constraint) => {
				if (constraint.constraintType == ConstraintType.OPPOSITE) {
					const tileType1 = boardState.tiles[coordinateToIndex(boardState, constraint.coordinate1)]
					const tileType2 = boardState.tiles[coordinateToIndex(boardState, constraint.coordinate2)]
					if (tileType1.iconType !== TileIconType.EMPTY && tileType2.iconType !== TileIconType.EMPTY && tileType1.iconType === tileType2.iconType) {
						violations.push({
							highlightCoordinates: [constraint.coordinate1, constraint.coordinate2],
							reason: `Tiles at ${constraint.coordinate1} and ${constraint.coordinate2} must be opposite.`
						});
					}
				}
			})
			return violations
		}
	},
	{
		description: "Two tiles with an = between them must be the same.",
		getViolations: (boardState: BoardState): RuleViolation[] => {
			const violations: RuleViolation[] = [];
			boardState.constraints.forEach((constraint) => {
				if (constraint.constraintType == ConstraintType.EQUAL) {
					const tileType1 = boardState.tiles[coordinateToIndex(boardState, constraint.coordinate1)]
					const tileType2 = boardState.tiles[coordinateToIndex(boardState, constraint.coordinate2)]
					if (tileType1.iconType !== TileIconType.EMPTY && tileType2.iconType !== TileIconType.EMPTY && tileType1.iconType !== tileType2.iconType) {
						violations.push({
							highlightCoordinates: [constraint.coordinate1, constraint.coordinate2],
							reason: `Tiles at ${constraint.coordinate1} and ${constraint.coordinate2} must be the same.`
						});
					}
				}
			})
			return violations
		}
	},
];

export const isWinState = (boardState: BoardState): boolean => {
	if (boardState.tiles.some((tile) => tile.iconType === TileIconType.EMPTY)) {
		return false;
	}
	return getAllViolations(boardState).length === 0;
}