import TangoTS from "../utils/TangoTS";
import { BoardState, TileIconType } from "../types/types";
import { Rive, useRive, useStateMachineInput } from "@rive-app/react-canvas";
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

	let onLoadCallback = (_rive: any) => {};
	const riveRef = useRef(null);

	const { rive, RiveComponent } = useRive({
		src: "src/assets/tile.riv", // spent way too much time trying to figure this out
		// i just screwed up the import path, and i forogt that assets was actually in src
		// i guess relative paths never worked. any relative path here did not work
		// also, the error messages are trash: why is it claiming "bad header" and "problem loading file, may be corrupt"
		// when it is a path issue
		autoplay: true,
		stateMachines: "StateMachine",
		onLoad: (_: any) => {
			console.log("Rive just loaded.", rive)
			onLoadCallback(rive);
		},
	});

	const isMoon = useStateMachineInput(rive, "StateMachine", "isMoon", false);
	const isSun = useStateMachineInput(rive, "StateMachine", "isSun", false);

	onLoadCallback = () => {
		console.log("ON LOAD CALLBACK SET")
		tangoTsApi.addChangeCallback( tileId, ( oldBoardState: BoardState, newBoardState: BoardState, completeReplace?: boolean) => {
			if (oldBoardState.tiles[boardIndex].iconType !== newBoardState.tiles[boardIndex].iconType) {
				console.log(`${tileId} Change from ${oldBoardState.tiles[boardIndex].iconType} to ${newBoardState.tiles[boardIndex].iconType}`);
				const newMoon = newBoardState.tiles[boardIndex].iconType === TileIconType.MOON;
				const newSun = newBoardState.tiles[boardIndex].iconType === TileIconType.SUN;

				// rive?.setBooleanStateAtPath("isMoon", newMoon, "");
				console.log(rive);
				console.log(rive?.stateMachineInputs('isMoon'));
				// rive?.setBooleanStateAtPath("isSun", newSun, "");
				console.log(isMoon, isSun, newMoon, newSun);
				// if (isMoon) {
				// 	isMoon!.value = 
				// }
				// if (isSun) {
				// 	isSun!.value = newBoardState.tiles[boardIndex].iconType === TileIconType.SUN;
				// }
			}
		});
	}

	useEffect(() => {
		return () => {
			tangoTsApi.removeChangeCallback(tileId);
		}
	}, [tileId]);

	return (
		<div
			style={{
				userSelect: "none",
				backgroundColor: generateDarkColor(),
			}}
		>
			<RiveComponent onClick={onClick} />
			{/* <TileCanvas onClick={onClick} moon={moon} sun={sun}/> */}
		</div>
	);
};
