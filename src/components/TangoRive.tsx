import { animated, useTransition } from "@react-spring/web";
import { BoardState } from "../types/types";
import TangoRiveBoard from "./TangoRiveBoard";

const TangoRive = () => {

	// This component will house a div that contains a TangoRiveBoard,
	// regeneration button, reset button, and a timer.
	// Designed to be used with a TangoTS object.
	// The TangoRiveBoard can be replaced with a new one at any time
	// if the game changes dimensions or uses a completely new board state.

	// const [measureRef, { width, height }] = useMeasure()

	const boards: BoardState[] = [
		{
			rows: 6,
			columns: 6,
			constraints: [],
			tiles: []
		},
	]

	const transitions = useTransition(boards, {
		from: {
			opacity: 0.5,
		},
		enter: {
			opacity: 1,
		},
		leave: {
			opacity: 0.5,
		},
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
			}}>
				{transitions((style, item) => (
					<animated.div style={style}>
						<TangoRiveBoard />
					</animated.div>
				))}
			</div>
		</>
	)
};

export default TangoRive;