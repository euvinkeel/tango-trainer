import { Rule, BoardState, TileIconType, ConstraintType, RuleViolation, Coordinate } from "../types/types";
import { getRows, getColumns, getTileIconCounts, getRowCoordinates, getColumnCoordinates, coordinateToIndex, range, indexToCoordinate, getBoardStateAsString, chooseRandom, createBoardString } from "./utils";

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
export const isIndexEditable = (boardState: BoardState, index: number): boolean => boardState.tiles[index].locked === false && boardState.tiles[index].iconType === TileIconType.EMPTY;
export const isCoordinateEditable = (boardState: BoardState, coordinate: Coordinate): boolean => isIndexEditable(boardState, coordinateToIndex(boardState, coordinate));

export const testIfCoordinateIsDeducible = (boardState: BoardState, coordinate: Coordinate): [boolean, TileIconType?] => {

	let debugmode;
	debugmode = false;
	debugmode = false;
	if (coordinate.row == 5 && coordinate.column == 5) {
		console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\ndebug mode for this coordinate:");
		console.log(getBoardStateAsString(boardState, coordinate));
		debugmode = true;
	}

	// Assume our current setup in boardState.
	// make immutable to be safe...
	const newBoardState = structuredClone(boardState);

	// Fill in the square, see if we can randomly generate its row & column's blank tiles without violating rules.
	const index = coordinateToIndex(newBoardState, coordinate);

	const hasValidRow = (coordIdx: number, coordsToExplore: Coordinate[]): boolean => {
		if (getAllViolations(newBoardState).length > 0) {
			return false;
		}
		if (coordIdx >= coordsToExplore.length) {
			return true;
		}
		const currCoord = coordsToExplore[coordIdx];
		const actualIndex = coordinateToIndex(newBoardState, currCoord);
		if (isIndexEditable(newBoardState, actualIndex)) {
			newBoardState.tiles[actualIndex].iconType = TileIconType.SUN;
			const sunpath = hasValidRow(coordIdx + 1, coordsToExplore);
			if (sunpath) {
				newBoardState.tiles[actualIndex].iconType = TileIconType.EMPTY;
				return sunpath;
			}
			newBoardState.tiles[actualIndex].iconType = TileIconType.MOON;
			const moonpath = hasValidRow(coordIdx + 1, coordsToExplore);
			if (moonpath) {
				newBoardState.tiles[actualIndex].iconType = TileIconType.EMPTY;
				return moonpath;
			}
			newBoardState.tiles[actualIndex].iconType = TileIconType.EMPTY;
			return false;
		} else {
			return hasValidRow(coordIdx + 1, coordsToExplore);
		}
	}
	// bug: must explroe all remaining BLANK tiles not just going linearly
	const hasValidCol = (coordIdx: number, coordsToExplore: Coordinate[]): boolean => {
		if (debugmode) {
			console.log("HVC current state:", coordIdx, coordsToExplore[coordIdx]);
			console.log(getBoardStateAsString(newBoardState, coordsToExplore[coordIdx]));
		}
		if (getAllViolations(newBoardState).length > 0) {
			return false;
		}
		if (coordIdx >= coordsToExplore.length) {
			return true;
		}
		const currCoord = coordsToExplore[coordIdx];
		const actualIndex = coordinateToIndex(newBoardState, currCoord);
		if (isIndexEditable(newBoardState, actualIndex)) {
			newBoardState.tiles[actualIndex].iconType = TileIconType.SUN;
			const sunpath = hasValidCol(coordIdx + 1, coordsToExplore);
			if (sunpath) {
				newBoardState.tiles[actualIndex].iconType = TileIconType.EMPTY;
				return sunpath;
			}
			newBoardState.tiles[actualIndex].iconType = TileIconType.MOON;
			const moonpath = hasValidCol(coordIdx + 1, coordsToExplore);
			if (moonpath) {
				newBoardState.tiles[actualIndex].iconType = TileIconType.EMPTY;
				return moonpath;
			}
			newBoardState.tiles[actualIndex].iconType = TileIconType.EMPTY;
			return false;
		} else {
			return hasValidCol(coordIdx + 1, coordsToExplore);
		}
	}


	// At this coordinate,
	// to explore the ROW before hasValidRow is called,
	// preapre a traversal list of all *columns* (coordinate format)
	// check that coordinate
	const getCoordsToExploreInColumn = (column: number): Coordinate[] => {
		const coordsToExploreInColumn: Coordinate[] = [];
		for (let i = 0; i < newBoardState.rows; i++) {
			const checkCoordinate = { row: i, column: column };
			if (isCoordinateEditable(newBoardState, checkCoordinate)) {
				coordsToExploreInColumn.push(checkCoordinate);
			}
		}
		return coordsToExploreInColumn;
	}
	const getCoordsToExploreInRow = (row: number): Coordinate[] => {
		const coordsToExploreInRow: Coordinate[] = [];
		for (let i = 0; i < newBoardState.columns; i++) {
			const checkCoordinate = { row: row, column: i };
			if (isCoordinateEditable(newBoardState, checkCoordinate)) {
				coordsToExploreInRow.push(checkCoordinate);
			}
		}
		return coordsToExploreInRow;
	}

	if (debugmode) {
		console.log("TIME FOR SUN CHECK we are about to check ", coordinate);
		console.log(getBoardStateAsString(newBoardState));
		console.log(getBoardStateAsString(newBoardState, coordinate));
		console.log("calling hasValidCol")
	}
	newBoardState.tiles[index].iconType = TileIconType.SUN;
	const sunIsPossible = hasValidRow(0, getCoordsToExploreInRow(coordinate.row)) && hasValidCol(0, getCoordsToExploreInColumn(coordinate.column));

	if (debugmode) {
		if (sunIsPossible) {
			console.log("we have determined a SUN IS possible")
		} else {
			console.log("we have determined a SUN IS NOT possible")
		}
	}
	newBoardState.tiles[index].iconType = TileIconType.MOON;
	if (debugmode) {
		console.log("okay we'll place a moon here", coordinate);
		console.log(getBoardStateAsString(newBoardState, coordinate));
		console.log(getBoardStateAsString(newBoardState));
		console.log("let's see if we can fit a moon on this column!!!! hopefully NOT!!!!!!");
	}
	const moonIsPossible = hasValidRow(0, getCoordsToExploreInRow(coordinate.row)) && hasValidCol(0, getCoordsToExploreInColumn(coordinate.column));

	if (debugmode) {
		if (moonIsPossible) {
			console.log("we have determined a MOON IS possible")
		} else {
			console.log("we have determined a MOON IS NOT possible")
		}
	}
	if (debugmode && sunIsPossible) console.log("SUN")
	if (debugmode && moonIsPossible) console.log("MOON")

	if ((sunIsPossible && moonIsPossible) || !(sunIsPossible || moonIsPossible) ) {
		return [false];
	}
	if (sunIsPossible) {
		return [true, TileIconType.SUN];
	}
	if (moonIsPossible) {
		return [true, TileIconType.MOON];
	}
	return [false];
}

export const getSolveableCoordinates = (boardState: BoardState): [Coordinate, TileIconType][] => {
	const solveableCoordinates: [Coordinate, TileIconType][] = [];

	for (let row = 0; row < boardState.rows; row++) {
		for (let col = 0; col < boardState.columns; col++) {
			const coordinate = { row: row, column: col };
			const index = coordinateToIndex(boardState, coordinate);
			if (isIndexEditable(boardState, index)) {
				const [isDeducible, iconType] = testIfCoordinateIsDeducible(boardState, coordinate);
				if (isDeducible && iconType) {
					solveableCoordinates.push([coordinate, iconType]);
				}
			}
		}
	}

	if (solveableCoordinates.length === 0) {
		console.log("No solveable coordinates found");
	} else {
		console.log("Solveable coordinates: ");
		for (const solveableCoordinate of solveableCoordinates) {
			console.log(`We can solve [${solveableCoordinate[0].row}][${solveableCoordinate[0].column}] = ${solveableCoordinate[1] === TileIconType.SUN ? "SUN" : "MOON"}`)
		}
	}

	return solveableCoordinates;
}

// edits an existing boardState to be human solvable
// should probably make an immutable version......... later
export const ensureBoardIsSolvable = (boardState: BoardState, solution: BoardState): BoardState => {

	// const solutions = generateAllValidSolutions(boardState, 1);
	// if (solutions.length === 0) {
	// 	console.error("Board is unsolvable oops this shouldn't happen");
	// 	throw "Board is unsolvable oops this shouldn't happen"
	// }
	// const solution = solutions[0];

	const tryToSolveTheBoard = (boardState: BoardState): boolean => {
		// solve it step by step.
		console.log("Solving the board...");
		const playingBoard = structuredClone(boardState);
		const playingBoardString = createBoardString(playingBoard);
		let fillInCoordinates = getSolveableCoordinates(playingBoard);
		while (fillInCoordinates.length > 0) {
			for (const [coordinate, iconType] of fillInCoordinates) {
				playingBoard.tiles[coordinateToIndex(playingBoard, coordinate)].iconType = iconType;
			}
			fillInCoordinates = getSolveableCoordinates(playingBoard);
		}
		if (playingBoard.tiles.filter(tile => tile.iconType === TileIconType.EMPTY).length > 0) {
			// We didn't solve it, we just have no more to fill :(
			console.log("this is too hard...");
			console.log(playingBoardString);
			return false;
		} else {
			// We solved it!
			console.log("Got it!");
			return true;
		}
	}

	let isEasilySolvable = tryToSolveTheBoard(boardState);
	while (!isEasilySolvable) {
		console.log("Attempting to make the board easier...");
		// Choose a random tile index that is blank, and fill in what the solution has.
		const blankTileIndices = boardState.tiles.filter((tile, index) => tile.iconType === TileIconType.EMPTY && isIndexEditable(boardState, index)).map((_, index) => index);
		const chosenIndex = chooseRandom(blankTileIndices);
		const solutionTileIconType = solution.tiles[chosenIndex].iconType;
		boardState.tiles[chosenIndex].iconType = solutionTileIconType;
		boardState.tiles[chosenIndex].locked = true;
		isEasilySolvable = tryToSolveTheBoard(boardState);
	}

	return boardState;
}

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