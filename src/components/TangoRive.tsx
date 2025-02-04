import { animated, useTransition } from "@react-spring/web";
import { useEffect, useState } from "react";
import TangoTS from "../utils/TangoTS";
import TangoRiveBoard from "./TangoRiveBoard";
import { BoardState } from "../types/types";

let currBoardId = 0;

const TangoRive = ({ tangoRiveId, tangoTsApi }: { tangoRiveId: string, tangoTsApi: InstanceType<typeof TangoTS> }) => {

	// This component will house a div that contains a TangoRiveBoard,
	// regeneration button, reset button, and a timer.
	// Designed to be used with a TangoTS object.
	// The TangoRiveBoard can be replaced with a new one at any time
	// if the game changes dimensions or uses a completely new board state.

	const [activeBoards, setActiveBoards] = useState<BoardState[]>([]);
	const [myWinFlag, setMyWinFlag] = useState(false);

	useEffect(() => {
		console.log("TangoRive Effect: Adding existing tangoTS board");
		setActiveBoards([tangoTsApi.boardState]);
		return tangoTsApi.addChangeCallback(tangoRiveId, (_oldBoardState: BoardState, newBoardState: BoardState, completeReplace?: boolean) => {
			if (completeReplace) {
				currBoardId += 1;
				setActiveBoards([newBoardState]);
			} else {
				activeBoards[0] = newBoardState;
			}
			setMyWinFlag(tangoTsApi.isAWinState);
		})
	}, [tangoTsApi])

	const transitions = useTransition(activeBoards, {
		from: () => ({ opacity: 0, transform: "perspective(800px) rotate3d(2, 5, 1, -45deg)" }),
		enter: () => ({ opacity: 1, transform: "perspective(800px) rotate3d(2, 5, 1, 0deg)" }),
		leave: () => ({ opacity: 0, transform: "perspective(800px) rotate3d(2, 5, 1, 360deg)" }),
		config: {
			mass: 8,
			tension: 200,
			friction: 50,
			precision: 0.0001,
		}
	})

	return (
		<>
			<h1 style={{color: "black", backgroundColor: "white"}} > Tango Rive </h1>
			<h2 style={{color: "red", backgroundColor: "white"}}> {myWinFlag && "Solved!"} </h2>
			<button className="regen-button" style={{
				zIndex: "10000",
			}}
				onClick={() => {
				tangoTsApi.regenerateBoard();
			}}>
				Regenerate
			</button>
			<button className="reset-button" style={{
				zIndex: "10000",
			}}
				onClick={() => {
				tangoTsApi.resetBoard();
			}}>
				Reset
			</button>

			<div style={{
				backgroundColor: "rgb(250, 245, 240)",
				borderRadius: "10px",
				border: "1px solid rgb(220, 215, 210)",
				margin: "10px auto",
				width: "500px",
				height: "600px",
				// position: "absolute",
				// zIndex: "9999",
			}}>
				{transitions((transitionStyle, item, t, index) => (
					<animated.div key={index} style={{
						position: "absolute",
						display: "flex",
						justifyContent: "center",
						top: "70%",
						right: "50%",
						bottom: "50%",
						left: "50%",
						zIndex: "9999",
						transformOrigin: "100% 100% 0",
						...transitionStyle
					}}>
						<TangoRiveBoard boardId={`${tangoRiveId}_${currBoardId}`} tangoTsApi={tangoTsApi} tileClickCallback={(index: number) => {
							// console.log("TangoHTML: changing at ", index)
							tangoTsApi.changeTileAtIndex(index);
						}}/>
					</animated.div>
				))}
			</div>


		</>
	)
};

export default TangoRive;