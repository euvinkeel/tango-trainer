import { useEffect, useState, } from "react";
import TangoTS from "../utils/TangoTS";
import TangoRiveBoard from "./TangoRiveBoard";
import { BoardState } from "../types/types";

const springConfig = { mass: 8, tension: 200, friction: 50, precision: 0.0001, };

const TangoRive = ({ tangoRiveId, tangoTsApi }: { tangoRiveId: string, tangoTsApi: InstanceType<typeof TangoTS> }) => {

	const [myWinFlag, setMyWinFlag] = useState(false);

	useEffect(() => {
		return tangoTsApi.addChangeCallback(tangoRiveId, (_oldBoardState: BoardState, newBoardState: BoardState, completeReplace?: boolean) => {
			// console.log("CHANGE CALLBACK");
			if (completeReplace) {
			} else {
			}
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
				zIndex: "10",
			}}>
				<h1 style={{color: "black" }} > Tango Rive </h1>
				<h2 style={{color: "red", backgroundColor: "white"}}> {myWinFlag && "Solved!"} </h2>
				<button className="regen-button" style={{ zIndex: "10000", }} onClick={() => { tangoTsApi.regenerateBoard(); }}> Regenerate </button>
				<button className="reset-button" style={{ zIndex: "10000", }} onClick={() => { tangoTsApi.resetBoard(); }}> Reset </button>
				<TangoRiveBoard boardId={`board_${tangoRiveId}`} tangoTsApi={tangoTsApi} tileClickCallback={(idx) => {
					tangoTsApi.changeTileAtIndex(idx);
				}}/>
			</div>
		</>
	)
};

export default TangoRive;