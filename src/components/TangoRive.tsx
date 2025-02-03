import { animated, useTransition } from "@react-spring/web";
import { useEffect, useState } from "react";
import TangoTS from "../utils/TangoTS";
import TangoRiveBoard from "./TangoRiveBoard";
import { BoardState } from "../types/types";
// import TangoRiveBoard from "./TangoRiveBoard";

const TangoRive = ({ tangoTsApi }: { tangoTsApi: InstanceType<typeof TangoTS> }) => {

	// This component will house a div that contains a TangoRiveBoard,
	// regeneration button, reset button, and a timer.
	// Designed to be used with a TangoTS object.
	// The TangoRiveBoard can be replaced with a new one at any time
	// if the game changes dimensions or uses a completely new board state.

	// const [measureRef, { width, height }] = useMeasure()
	// const [boards, setBoards] = useState<{[key: number]: BoardState}>({});
	const [boards, setBoards] = useState<BoardState[]>([]);
	// const [boardState, setBoardState] = useState<BoardState>(blankBoardState);
	const [myWinFlag, setMyWinFlag] = useState(false);

	useEffect(() => {
		console.log("TangoRive Effect: Adding existing tangoTS board");
		tangoTsApi.addChangeCallback((oldBoardState: BoardState, newBoardState: BoardState, completeReplace: boolean) => {
			console.log("TangoRive: change callback askjdlkasjdlksa");
			console.log(tangoTsApi);
			console.log(tangoTsApi.isAWinState);
			if (completeReplace) {
				// setBoards({ [itemId++]: newBoardState });
				setBoards([newBoardState]);
			} else {
				boards[0] = newBoardState;
			}
			// setMyOwnBoardState(newBoardState);
			setMyWinFlag(tangoTsApi.isAWinState);
		})
		setBoards([tangoTsApi.boardState]);
	}, [tangoTsApi])

	const transitions = useTransition(boards, {
		// key: (boards: { boardId: number } ) => boards[boardId],
		from: () => ({ opacity: 0, transform: "perspective(800px) rotate3d(2, 5, 1, -45deg)" }),
		enter: () => ({ opacity: 1, transform: "perspective(800px) rotate3d(2, 5, 1, 0deg)" }),
		leave: () => ({ opacity: 0, transform: "perspective(800px) rotate3d(2, 5, 1, 360deg)" }),
		config: {
			mass: 2,
			tension: 500,
			friction: 30,
		}
	})

	return (
		<>
			<div style={{
				backgroundColor: "rgb(250, 245, 240)",
				borderRadius: "10px",
				border: "1px solid rgb(220, 215, 210)",
				margin: "10px auto",
				width: "500px",
				height: "500px",
				position: "absolute",
				zIndex: "9999",
			}}>
				{transitions((transitionStyle, item) => (
					<animated.div style={transitionStyle}>
						<TangoRiveBoard tangoTsApi={tangoTsApi} tileClickCallback={(index: number) => {
							console.log("TangoHTML: changing at ", index)
							tangoTsApi.changeTileAtIndex(index);
						}}/>
					</animated.div>
				))}
			</div>
		</>
	)
};

export default TangoRive;