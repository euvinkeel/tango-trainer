import TangoTS from "../utils/TangoTS";
import { BoardState, TileIconType } from "../types/types";
import { Rive, useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useEffect, useRef, useState } from "react";
import { getRandInt } from "../utils/utils";

const generateDarkColor = () => {
  const r = getRandInt(100, 220);
  const g = getRandInt(100, 220);
  const b = getRandInt(100, 220);
  return `rgb(${r},${g},${b})`;
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

	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		// console.log("This should run with a valid canvas:", canvasRef);

		// If the new board gets replaced right away, raise a flag so
		// we do NOT attach a new change callback to TangoTS when rive loads
		let deletedFlag = false;
		tangoTsApi.addChangeCallback( tileId, ( oldBoardState: BoardState, newBoardState: BoardState, completeReplace?: boolean) => {
			if (completeReplace) {
				deletedFlag = true;
			}
		})

		const r = new Rive({
			src: "src/assets/tile.riv",
			canvas: canvasRef!.current!,
			autoplay: true,
			stateMachines: 'StateMachine',
			onLoad: () => {
				// console.log("Rive loaded");
				if (deletedFlag) {
					console.log("too late to load");
					return;
				}
				r.resizeDrawingSurfaceToCanvas();
				tangoTsApi.addChangeCallback( tileId, ( oldBoardState: BoardState, newBoardState: BoardState, completeReplace?: boolean) => {
					if (oldBoardState.tiles[boardIndex].iconType !== newBoardState.tiles[boardIndex].iconType) {
						console.log(`${tileId} Change from ${oldBoardState.tiles[boardIndex].iconType} to ${newBoardState.tiles[boardIndex].iconType}`);
						const newMoon = newBoardState.tiles[boardIndex].iconType === TileIconType.MOON;
						const newSun = newBoardState.tiles[boardIndex].iconType === TileIconType.SUN;
						// console.log(r);
						// console.log(r.stateMachineInputs('StateMachine'));
						r.stateMachineInputs('StateMachine').find(i => i.name === "isMoon")!.value = newMoon;
						r.stateMachineInputs('StateMachine').find(i => i.name === "isSun")!.value = newSun;
						// console.log(isMoon, isSun, newMoon, newSun);
						// if (isMoon) {
						// 	isMoon!.value = 
						// }
						// if (isSun) {
						// 	isSun!.value = newBoardState.tiles[boardIndex].iconType === TileIconType.SUN;
						// }
					}
				});

				const newMoon = tangoTsApi.boardState.tiles[boardIndex].iconType === TileIconType.MOON;
				const newSun = tangoTsApi.boardState.tiles[boardIndex].iconType === TileIconType.SUN;
				r.stateMachineInputs('StateMachine').find(i => i.name === "isMoon")!.value = newMoon;
				r.stateMachineInputs('StateMachine').find(i => i.name === "isSun")!.value = newSun;
			},
		})
		return () => {
			tangoTsApi.removeChangeCallback(tileId);
		}
	}, [canvasRef])

	// useEffect(() => {
	// }, [tileId]);

	return (
		<div
			style={{
				userSelect: "none",
				backgroundColor: generateDarkColor(),
			}}
		>
			<canvas ref={canvasRef} id="canvas" style={{
				width: "90%",
				height: "90%",
			}} onClick={onClick}
			></canvas>
			{/* <RiveComponent onClick={onClick} /> */}
			{/* <TileCanvas onClick={onClick} moon={moon} sun={sun}/> */}
		</div>
	);
};
