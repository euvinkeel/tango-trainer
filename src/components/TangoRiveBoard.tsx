import { Transition, TransitionStatus } from "react-transition-group";
import { useEffect, useRef, useState } from "react";
import { BoardState, ConstraintType } from "../types/types";
import TangoTS from "../utils/TangoTS";
import { TangoRiveBoardTile } from "./TangoRiveBoardTile";
import { useSpring, animated } from "@react-spring/web";

const springConfig = { mass: 4, tension: 500, friction: 50, precision: 0.0001, };

const TangoRiveBoard = ({ showing, boardId, tangoTsApi, tileClickCallback }: { showing: boolean, boardId: string, tangoTsApi: InstanceType<typeof TangoTS>, tileClickCallback: (index: number) => void }) => {

	const [myWinFlag, setMyWinFlag] = useState(false);
	const nodeRef = useRef<HTMLDivElement>(null);
	const [showingState, setShowingState] = useState(false);

	const { transform, opacity } = useSpring({
		opacity: showingState ? 1 : 0,
		transform: `perspective(800px) rotate3d(2, 5, 1, ${showingState ? 0 : -45}deg)`,
		config: springConfig,
	})

	useEffect(() => {
		setShowingState(showing);
	}, [showing])

	const transitionStyles = {
		// from: () => ({ opacity: 0, transform: "perspective(800px) rotate3d(2, 5, 1, -45deg)" }),
		// enter: () => ({ opacity: 1, transform: "perspective(800px) rotate3d(2, 5, 1, 0deg)" }),
		// leave: () => ({ opacity: 0, transform: "perspective(800px) rotate3d(2, 5, 1, 360deg)" }),
		entering: { opacity: 1 },
		entered:  { opacity: 1 },
		exiting:  { opacity: 0 },
		exited:  { opacity: 0 },
		unmounted:  { opacity: 0 },
	}

	useEffect(() => {
		return tangoTsApi.addChangeCallback(boardId, (_oldBoardState: BoardState, _newBoardState: BoardState, completeReplace?: boolean) => {
			setMyWinFlag(tangoTsApi.isAWinState);
		})
	},[])

	return (
		// <div 
		<animated.div
		ref={nodeRef}
		className="grid"
		style={{
			transform: transform,
			opacity: opacity,
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
		{/* </div> */}
		</animated.div>
	);
};

export default TangoRiveBoard