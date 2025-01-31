import { useState } from "react";
import { Tile } from "./Tile";
import { BoardState, ConstraintType } from "../types/types";
import { changeBoardTileIcons, clearAllEditableIndices, generateRandomValidBoardState, getNextTileIcon, indexToCoordinate } from "../utils/utils";
// import { changeBoardTileIcons, deserBoardString, getNextTileIcon, indexToCoordinate } from "../utils/utils";
import { getAllViolations, getSolveableCoordinates, isWinState, updateBoardTileStateErrors } from "../utils/rules";

const generateDarkColor = () => {
  const r = Math.floor(Math.random() * 156);
  const g = Math.floor(Math.random() * 156);
  const b = Math.floor(Math.random() * 156);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}


const Board = ({
	rows = 6,
	columns = 6,
}: {
	rows: number;
	columns: number;
}) => {

	const [boardState, setBoardState] = useState<BoardState>(() => 
		generateRandomValidBoardState(rows, columns)
	);

    // console.log("Generated:");
    // console.log(boardState);

	let boardColor = generateDarkColor();
	if (isWinState(boardState)) {
		console.log("WIN STATE!");
		boardColor = `rgb(255,255,255)`
	}

	// console.log("\n\n\n")
	// console.log("EVERY POSSIBLE SOLUTION EVER")
	// const everything = generateAllValidSolutions(boardState)
	// console.log(everything, everything.length);
	// console.log("DONE WITH ALL POSSIBLE SOLUTIONS EVER")

	console.log("\n\n\nDEBUG TIME")
	getSolveableCoordinates(boardState);
	console.log("\n\n")

	return (
		<>
			<div className="grid"
			style={{
				gridTemplateColumns: `repeat(${columns}, 60px)`,
				gridTemplateRows: `repeat(${rows}, 60px)`,
				backgroundColor: boardColor,
			}}>
				{boardState.tiles.map((tileState, i) => (
					<Tile key={i} startState={tileState} onClick={() => {
						if (tileState.locked) {
							return;
						}
						let newBoardState = changeBoardTileIcons(boardState, [ [ indexToCoordinate(boardState, i), getNextTileIcon(tileState.iconType) ] ])
						newBoardState = updateBoardTileStateErrors(newBoardState);
						setBoardState(newBoardState);
						for (const violation of getAllViolations(newBoardState)) {
							console.log(`!! ${violation.reason}`);
							console.log(violation.highlightCoordinates);
						}
					}} />
				))}
				{boardState.constraints.map((constraint, i) => {
					const pxcell = 64;
					const basex = -boardState.columns / 2 * pxcell;
					const basey = -boardState.rows / 2 * pxcell;
					let finalx = basex;
					let finaly = basey;

					const midrow = (constraint.coordinate1.row + constraint.coordinate2.row) / 2
					const midcol = (constraint.coordinate1.column + constraint.coordinate2.column) / 2
					finalx += midcol * pxcell + (pxcell / 2)
					finaly += midrow * pxcell + (pxcell / 2)
					
					if (constraint.constraintType === ConstraintType.EQUAL) {
						return (
							<div
								className="constraint text-xl text-center"
								key={i}
								style={{
									transform: `translateX(${finalx}px) translateY(${finaly}px)`,
								} as React.CSSProperties}
							>
								=
							</div>
						)
					} else if (constraint.constraintType === ConstraintType.OPPOSITE) {
						return (
							<div
								className="constraint text-xl text-center"
								key={i}
								style={{
									transform: `translateX(${finalx}px) translateY(${finaly}px)`,
								} as React.CSSProperties}
							>
								x
							</div>
						)
					} else {
						throw "Invalid constraint type"
					}
				})}
			</div>
			<button className="regen-button" onClick={() => {
				setBoardState(generateRandomValidBoardState(boardState.rows, boardState.columns))
			}}>
				Regenerate
			</button>
			<button className="reset-button" onClick={() => {
				setBoardState(clearAllEditableIndices(boardState));
			}}>
				Reset
			</button>
		</>
	);
};

export default Board;
