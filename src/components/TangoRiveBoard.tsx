import { useEffect, useRef, useState } from "react";
import { BoardState, ConstraintType } from "../types/types";
import TangoTS from "../utils/TangoTS";
import { TangoRiveBoardTile } from "./TangoRiveBoardTile";
import { animated, useSprings } from "@react-spring/web";
import { TangoRiveConstraint } from "./TangoRiveConstraint";

const TangoRiveBoard = ({
	boardId,
	tangoTsApi,
	tileClickCallback,
}: {
	boardId: string;
	tangoTsApi: InstanceType<typeof TangoTS>;
	tileClickCallback: (index: number) => void;
}) => {

	const cols = tangoTsApi.boardState.columns;
	const rows = tangoTsApi.boardState.rows;
	const boardRef = useRef<HTMLDivElement>(null);
	const [props, _api] = useSprings(
		tangoTsApi.boardState.tiles.length,
		(i) => ({
			config: { 
				mass: 5 + (i * 0.05),
				tension: 400,
				friction: 80,
				precision: 0.001,
			},
			from: { 
				x: -((i%cols) - (cols/2))*70,
				y: -((i/cols) - (rows/2))*70,
				opacity: 0,
			},
			to: {
				x: 0,
				y: 0,
				opacity: 1,
				borderRadius: 0,
			},
		}),
	);

	const [constraints, setConstraints] = useState(tangoTsApi.boardState.constraints);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > 450) {
				boardRef.current!.style.scale = `1`;
			} else {
				const newScale = window.innerWidth / 450;
				boardRef.current!.style.scale = `${newScale}`;
			}
		};
		const removeCallback = tangoTsApi.addChangeCallback(boardId, (_oldBoardState: BoardState, newBoardState: BoardState, completeReplace?: boolean) => {
			if (completeReplace) {
				setConstraints(newBoardState.constraints)
			}
		})
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => {
			window.removeEventListener('resize', handleResize);
			removeCallback();
		};
	}, [tangoTsApi])

	return (
		<animated.div
			ref={boardRef}
			className="grid bg-egg-dark place-self-center"
			style={{
				gridTemplateColumns: `repeat(${tangoTsApi.boardState.columns}, 60px)`,
				gridTemplateRows: `repeat(${tangoTsApi.boardState.rows}, 60px)`,
			}}
		>
			{tangoTsApi.boardState.tiles.map((_, i) => (
				<animated.div key={i} style={{ ...props[i] }}>
					<TangoRiveBoardTile
						tileId={`${boardId}_tile_${i}`}
						key={i}
						boardIndex={i}
						tangoTsApi={tangoTsApi}
						onClick={() => {
							tileClickCallback(i);
						}}
					/>
				</animated.div>
			))}

			{constraints.map((constraint) => {
				const pxcell = 64;
				const basex = (-tangoTsApi.boardState.columns / 2) * pxcell;
				const basey = (-tangoTsApi.boardState.rows / 2) * pxcell;
				let finalx = basex;
				let finaly = basey;

				const midrow =
					(constraint.coordinate1.row + constraint.coordinate2.row) /
					2;
				const midcol =
					(constraint.coordinate1.column +
						constraint.coordinate2.column) /
					2;
				finalx += midcol * pxcell + pxcell / 2;
				finaly += midrow * pxcell + pxcell / 2;

				const constraintKey = `${constraint.coordinate1.row}${constraint.coordinate1.column}${constraint.coordinate2.row}${constraint.coordinate2.column}${constraint.constraintType}.`;
				if (constraint.constraintType === ConstraintType.EQUAL) {
					return <TangoRiveConstraint key={constraintKey} isEquals={true} offsetX={finalx} offsetY={finaly}/>
				} else if (
					constraint.constraintType === ConstraintType.OPPOSITE
				) {
					return <TangoRiveConstraint key={constraintKey} isEquals={false} offsetX={finalx} offsetY={finaly}/>
				} else {
					throw "Invalid constraint type";
				}
			})}
		</animated.div>
	);
};

export default TangoRiveBoard;
