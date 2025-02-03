import { useEffect, useState } from "react";
import { BoardState, ConstraintType } from "../types/types";
import TangoTS from "../utils/TangoTS";
import { TangoRiveBoardTile } from "./TangoRiveBoardTile";

const generateDarkColor = () => {
  const r = Math.floor(Math.random() * 156);
  const g = Math.floor(Math.random() * 156);
  const b = Math.floor(Math.random() * 156);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

const TangoRiveBoard = ({ tangoTsApi, tileClickCallback }: { tangoTsApi: InstanceType<typeof TangoTS>, tileClickCallback: (index: number) => void }) => {

	const boardColor = generateDarkColor();
	// const [myOwnBoardState, setMyOwnBoardState] = useState(tangoTsApi.boardState);
	const [myWinFlag, setMyWinFlag] = useState(false);

	useEffect(() => {
		console.log("TangoRive Board: useffect")
		tangoTsApi.addChangeCallback((oldBoardState: BoardState, newBoardState: BoardState, completeReplace: boolean) => {
			if (completeReplace) {
				console.log("I AM BEING REPLACED!!")
			} else {
				// fire events to change our board tiles

			}
			setMyWinFlag(tangoTsApi.isAWinState);
		})
	},[])


	return (
		<>
			<div className="grid"
			style={{
				gridTemplateColumns: `repeat(${tangoTsApi.boardState.columns}, 60px)`,
				gridTemplateRows: `repeat(${tangoTsApi.boardState.rows}, 60px)`,
				backgroundColor: boardColor,
			}}>
				{/* <TangoRiveBoardTile boardIndex={0} tangoTsApi={tangoTsApi} onClick={() => {
					console.log("SADJSKHDHJKLSD");
				}}></TangoRiveBoardTile> */}


				{tangoTsApi.boardState.tiles.map((_, i) => (
					// only pass in the index and never update this (hence no using boardstate from useState)
					<TangoRiveBoardTile key={i} boardIndex={i} tangoTsApi={tangoTsApi} onClick={() => {
						tileClickCallback(i)
					}} />
				))}
				{tangoTsApi.boardState.constraints.map((constraint, i) => {
					const pxcell = 64;
					const basex = -tangoTsApi.boardState.columns / 2 * pxcell;
					const basey = -tangoTsApi.boardState.rows / 2 * pxcell;
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
									userSelect: "none",
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
									userSelect: "none",
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
		</>
	);
};

export default TangoRiveBoard