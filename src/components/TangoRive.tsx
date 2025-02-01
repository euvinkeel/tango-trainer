import { animated, useTransition } from "@react-spring/web";
import { BoardState } from "../types/types";
import Board from "./Board";
import { useEffect, useMemo, useRef, useState } from "react";
// import TangoRiveBoard from "./TangoRiveBoard";

let itemId = 0;

const TangoRive = ({tangoTsApi}) => {

	// This component will house a div that contains a TangoRiveBoard,
	// regeneration button, reset button, and a timer.
	// Designed to be used with a TangoTS object.
	// The TangoRiveBoard can be replaced with a new one at any time
	// if the game changes dimensions or uses a completely new board state.

	// const [measureRef, { width, height }] = useMeasure()
	const [boards, setBoards] = useState(() => [
		{
			rows: 2,
			columns: 2,
			constraints: [],
			tiles: [],
			boardId: -1,
		},
	])

	useEffect(() => {
		console.log("LOL")
		// setBoards([
		// 	{
		// 		rows: 4,
		// 		columns: 4,
		// 		constraints: [],
		// 		tiles: [],
		// 		boardId: itemId++,
		// 	}
		// ])
	}, [])

	const transitions = useTransition(boards, {
		key: (item: { boardId: number } ) => itemId++,
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
				width: "360px",
				height: "360px",
				position: "absolute",
				zIndex: "9999",
			}}>
				{transitions((tstyle, item) => (
					<animated.div style={tstyle}>
						<Board rows={item.rows} columns={item.columns}/>
					</animated.div>
				))}
			</div>
		</>
	)
};

export default TangoRive;