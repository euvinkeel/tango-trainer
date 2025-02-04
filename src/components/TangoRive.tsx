import { animated, useTransition } from "@react-spring/web";
import { useEffect, useState, ReactDOM, useRef } from "react";
import TangoTS from "../utils/TangoTS";
import TangoRiveBoard from "./TangoRiveBoard";
import { BoardState } from "../types/types";

let currBoardId = 0;
const springConfig = { mass: 8, tension: 200, friction: 50, precision: 0.0001, };

interface BoardQueueItem {
	id: number,
	boardState: BoardState,
	element?: HTMLElement,
}

const TangoRive = ({ tangoRiveId, tangoTsApi }: { tangoRiveId: string, tangoTsApi: InstanceType<typeof TangoTS> }) => {

	// This component will house a div that contains a TangoRiveBoard,
	// regeneration button, reset button, and a timer.
	// Designed to be used with a TangoTS object.
	// The TangoRiveBoard can be replaced with a new one at any time
	// if the game changes dimensions or uses a completely new board state.


	const [myWinFlag, setMyWinFlag] = useState(false);
	const boardContainerRef = useRef<HTMLDivElement>(null);
	const boardQueue = useRef<BoardQueueItem[]>([]);

	// 	from: () => ({ opacity: 0, transform: "perspective(800px) rotate3d(2, 5, 1, -45deg)" }),
	// 	enter: () => ({ opacity: 1, transform: "perspective(800px) rotate3d(2, 5, 1, 0deg)" }),
	// 	leave: () => ({ opacity: 0, transform: "perspective(800px) rotate3d(2, 5, 1, 360deg)" }),

	useEffect(() => {
		console.log("TangoRive Effect: Adding existing tangoTS board");

		const newBoardItem = { id: currBoardId, boardState: tangoTsApi.boardState, element: null };
		boardQueue.current = [];
		boardQueue.current.push(newBoardItem);
		console.log("Starting board queue:", boardQueue.current);

		const boardElement = <TangoRiveBoard boardId={currBoardId.toString()} tangoTsApi={tangoTsApi} tileClickCallback={() => {console.log("LOL")}} />

		return tangoTsApi.addChangeCallback(tangoRiveId, (_oldBoardState: BoardState, newBoardState: BoardState, completeReplace?: boolean) => {
			if (completeReplace) {
				const obsoleteBoardItem = boardQueue.current.shift();
				console.log("Kicked out ", obsoleteBoardItem);
				// play an animation on that board item and delete it
				currBoardId += 1;
				const newBoardItem = { id: currBoardId, boardState: newBoardState, };
				boardQueue.current.push(newBoardItem);
				console.log("Added ", newBoardItem);
			} else {
				boardQueue.current[0].boardState = newBoardState;
				console.log("Mutated ", boardQueue.current[0]);
				// just mutate the boardState member
			}
			console.log(boardQueue.current);
			setMyWinFlag(tangoTsApi.isAWinState);
		})

	}, [tangoTsApi])

	return (
		<>
			<div style={{
				backgroundColor: "rgb(250, 245, 240)",
				borderRadius: "10px",
				border: "1px solid rgb(220, 215, 210)",
				margin: "auto",
				width: "500px",
				height: "600px",
				position: "absolute",
				zIndex: "9999",
			}}>
				<h1 style={{color: "black" }} > Tango Rive </h1>
				<h2 style={{color: "red", backgroundColor: "white"}}> {myWinFlag && "Solved!"} </h2>
				<button className="regen-button" style={{ zIndex: "10000", }} onClick={() => { tangoTsApi.regenerateBoard(); }}> Regenerate </button>
				<button className="reset-button" style={{ zIndex: "10000", }} onClick={() => { tangoTsApi.resetBoard(); }}> Reset </button>
				<div ref={boardContainerRef}>

				</div>
			</div>
		</>
	)
};

export default TangoRive;