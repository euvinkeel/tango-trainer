import { Rule, BoardState, TileIconType, ConstraintType, RuleViolation } from "../types/types";
import { getRows, getColumns, getTileIconCounts, getRowCoordinates, getColumnCoordinates, coordinateToIndex, range, indexToCoordinate } from "./utils";

export const getAllViolations = (boardState: BoardState): RuleViolation[] => ruleset.flatMap(rule => rule.getViolations(boardState));

export const isWinState = (boardState: BoardState): boolean => {
	if (boardState.tiles.some((tile) => tile.iconType === TileIconType.EMPTY)) {
		return false;
	}
	return getAllViolations(boardState).length === 0;
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

// export const heuristics: Heuristic[] = [
// 	{
// 		description: "Place opposites next to two equal cells."
// 	},
// 	{
// 		description: "Place opposites next to two equal-constrained cells."
// 	},
// 	{
// 		// checks for 	O _ _ _ _ O pattern,
// 		// 			the _ _ _ * O O pattern,
// 		description: "Rows or columns must prevent possibilities of 3 consecutive equal cells."
// 	},
// 	{
// 		description: "If there are three of the same signs in a row or column, every other cell must be the opposite sign."
// 	},
// 	{
// 		description: "If there is a blank space between two cells of the same sign, the middle blank space must be the opposite sign."
// 	},
// 	{
// 		// checks for 	O _ * _x_ * pattern, which must become O O * _x_ * because of the opposite sign
// 		// checks for 	O * _ _x_ * pattern, which must become O * O _x_ * because of the opposite sign
// 		// checks for 	_ * _ _x_ * pattern, which must become O * O _x_ * because of the opposite sign
// 		// this is because the opposing sign gaurantees adding one to each sign's count, and if one sign already has two counts,
// 		// all blanks that are not having the opposing relation are solved for.
// 		description: "If there's two of the same signs and an unfilled opposite relation, the remaining spaces must be the opposite signs of the two existing signs."
// 	},

// 	// commonality: you check the rows and columns, or smaller local adjacent cells.
// 	// adjacent cell checks are easy enough.
// 	// for rows and column analysis, we must use constraints that are *WITHIN* that very row/column. (constraints connecting two different rows/columns don't help)
// 	// Within that row or column, * at least one square * will have only one possibility lest the entire row/column becomes invalid.
// 	// So we must generate all possible fill-ins of all blank spaces within a row/column, and check their validities.
// 	// If for ALL VALID generations of a row/column fill-ins, there is a space that is -- across all of them -- the same sign, we have our answer there
	
// ]

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