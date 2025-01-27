import { useState } from "react";
import { Tile } from "./Tile";
import { BoardState, ConstraintType } from "../types/types";
import { changeBoardTileIcons, generateRandomBoardState, getAllViolations, getNextTileIcon, indexToCoordinate, isVerticalConstraint, isWinState, updateBoardTileStateErrors } from "../utils/utils";

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

	const [boardState, setBoardState] = useState<BoardState>(
		generateRandomBoardState(rows, columns)
	)

    console.log("Generated:");
    console.log(boardState);

	let boardColor = generateDarkColor();
	if (isWinState(boardState)) {
		console.log("WIN STATE!");
		boardColor = `rgb(255,255,255)`
	}

	return (
		<div className="grid"
		style={{
			gridTemplateColumns: `repeat(${columns}, 60px)`,
			gridTemplateRows: `repeat(${rows}, 60px)`,
			backgroundColor: boardColor,
		}}>
			{boardState.tiles.map((tileState, i) => (
				<Tile key={i} startState={tileState} onClick={() => {
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

				if (isVerticalConstraint(constraint)) {
					// find the row line to be on top of, centered horizontally
					const midrow = (constraint.coordinate1.row + constraint.coordinate2.row) / 2
					const midcol = (constraint.coordinate1.column + constraint.coordinate2.column) / 2
					// finalx += constraint.coordinate1.column * pxcell
					finalx += midcol * pxcell + (pxcell / 2)
					finaly += midrow * pxcell + (pxcell / 2)
				} else {
					const midrow = (constraint.coordinate1.row + constraint.coordinate2.row) / 2
					const midcol = (constraint.coordinate1.column + constraint.coordinate2.column) / 2
					// finalx += constraint.coordinate1.column * pxcell
					finalx += midcol * pxcell + (pxcell / 2)
					finaly += midrow * pxcell + (pxcell / 2)
					// const midcol = (constraint.coordinate1.column + constraint.coordinate2.column) / 2
					// finalx += midcol * pxcell
					// finaly += constraint.coordinate1.row * pxcell
				}
				
				if (constraint.constraintType === ConstraintType.EQUAL) {
					return (
						<div
							className="constraint text-2xl text-center"
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
							className="constraint text-2xl text-center"
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
	);
};

export default Board;
