import TangoTS from "../utils/TangoTS";
import { BoardState, TileIconType } from "../types/types";
import { useEffect, useRef, useState } from "react";
import { TileCanvas } from "./TileCanvas";

const generateDarkColor = () => {
  const r = Math.floor(Math.random() * 156);
  const g = Math.floor(Math.random() * 156);
  const b = Math.floor(Math.random() * 156);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

export const TangoRiveBoardTile = ({
	tileId,
	boardIndex,
	tangoTsApi,
	onClick,
}: {
	tileId: string;
	boardIndex: number;
	tangoTsApi: InstanceType<typeof TangoTS>;
	onClick: () => void;
}) => {

	const [moon, setmoon] = useState(false);
	const [sun, setsun] = useState(false);

	useEffect(() => {
		return tangoTsApi.addChangeCallback( tileId,
			(
				oldBoardState: BoardState,
				newBoardState: BoardState,
				completeReplace?: boolean
			) => {
				// rive.
				if (oldBoardState.tiles[boardIndex].iconType !== newBoardState.tiles[boardIndex].iconType) {
					console.log(`${tileId} Change from ${oldBoardState.tiles[boardIndex].iconType} to ${newBoardState.tiles[boardIndex].iconType}`);
					setmoon(newBoardState.tiles[boardIndex].iconType === TileIconType.MOON);
					setsun(newBoardState.tiles[boardIndex].iconType === TileIconType.SUN);
					// console.log(isMoon);
					// console.log(isSun);
					// if (isMoon) {
					// 	isMoon.value = true;
					// 	console.log("moon");
					// } else if (isSun) {
					// 	isSun.value = true;
					// 	console.log("sun");
					// }
					// console.log(isMoonRef, isMoonRef.current);
					// console.log(isSunRef, isSunRef.current);
					// if (isMoonRef.current !== null) {
					// 	isMoonRef.current!.value =
					// 		newBoardState.tiles[boardIndex].iconType ===
					// 		TileIconType.MOON;
					// }
					// if (isSunRef.current !== null) {
					// 	isSunRef.current!.value =
					// 		newBoardState.tiles[boardIndex].iconType ===
					// 		TileIconType.SUN;
					// }
				}
			}
		);
	}, [tileId]);

	return (
		<div
			style={{
				userSelect: "none",
				backgroundColor: generateDarkColor(),
			}}
		>
			<TileCanvas onClick={onClick} moon={moon} sun={sun}/>
		</div>
	);
};
