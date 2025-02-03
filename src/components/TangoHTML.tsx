import { useEffect, useState } from "react";
import TangoTS from "../utils/TangoTS";
import TangoHTMLBoard from "./TangoHTMLBoard";
import { Tile } from "./Tile";
import { BoardState } from "../types/types";

const TangoHTML = ({ tangoHTMLId, tangoTsApi }: { tangoHTMLId: string, tangoTsApi: InstanceType<typeof TangoTS> }) => {

	const [myOwnBoardState, setMyOwnBoardState] = useState(() => {
		return tangoTsApi.boardState;
	})
	const [myWinFlag, setMyWinFlag] = useState(false);

	useEffect(() => {
		return tangoTsApi.addChangeCallback(tangoHTMLId, (oldBoardState: BoardState, newBoardState: BoardState) => {
			// console.log("change callback askjdlkasjdlksa");
			// console.log(tangoTsApi);
			// console.log(tangoTsApi.isAWinState);
			setMyOwnBoardState(newBoardState);
			setMyWinFlag(tangoTsApi.isAWinState);
		})
	}, [tangoTsApi])

	return <>
		<div
			style={{
				margin: "20px",
				backgroundColor: "#333",
				padding: "10px",
				borderRadius: "10px",
				boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)"
			}}>

			<h1>
				Tango HTML
			</h1>

			<h2>
				{myWinFlag && "Solved!"}
			</h2>

			<TangoHTMLBoard boardState={myOwnBoardState} winning={myWinFlag} tileClickCallback={(index: number) => {
				console.log("TangoHTML: changing at ", index)
				tangoTsApi.changeTileAtIndex(index);
			}}/>

			<button className="regen-button" onClick={() => {
				tangoTsApi.regenerateBoard();
			}}>
				Regenerate
			</button>
			<button className="reset-button" onClick={() => {
				tangoTsApi.resetBoard();
			}}>
				Reset
			</button>
			<Tile />
		</div>
	</>
}
export default TangoHTML