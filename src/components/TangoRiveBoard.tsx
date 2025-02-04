import { useEffect, useState } from "react";
import { BoardState, ConstraintType } from "../types/types";
import TangoTS from "../utils/TangoTS";
import { TangoRiveBoardTile } from "./TangoRiveBoardTile";


const TangoRiveBoard = ({ boardId, tangoTsApi, tileClickCallback }: { boardId: string, tangoTsApi: InstanceType<typeof TangoTS>, tileClickCallback: (index: number) => void }) => {

	const [myWinFlag, setMyWinFlag] = useState(false);

	useEffect(() => {
		return tangoTsApi.addChangeCallback(boardId, (_oldBoardState: BoardState, _newBoardState: BoardState, completeReplace?: boolean) => {
			setMyWinFlag(tangoTsApi.isAWinState);
		})
	},[])

	return (
		<>
			<div className="grid"
			style={{
				gridTemplateColumns: `repeat(${tangoTsApi.boardState.columns}, 60px)`,
				gridTemplateRows: `repeat(${tangoTsApi.boardState.rows}, 60px)`,
				backgroundColor: `rgb(150, 150, 150)`,
			}}>

				{tangoTsApi.boardState.tiles.map((_, i) => (
					// only pass in the index and never update this (hence no using boardstate from useState)
					<TangoRiveBoardTile tileId={`${boardId}_tile_${i}`} key={i} boardIndex={i} tangoTsApi={tangoTsApi} onClick={() => {
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