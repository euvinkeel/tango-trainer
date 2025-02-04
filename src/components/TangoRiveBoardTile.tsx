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
		// console.log("Tile Effect ", tileId);

		// If the new board gets replaced right away, raise a flag so
		// we do NOT attach a new change callback to TangoTS when rive loads
		let deletedFlag = false;
		tangoTsApi.addChangeCallback( tileId, ( oldBoardState: BoardState, newBoardState: BoardState, completeReplace?: boolean) => {
			if (completeReplace) {
				deletedFlag = true;
			}
		})

		const updateTile = (r: Rive) => {
			const newMoon = tangoTsApi.boardState.tiles[boardIndex].iconType === TileIconType.MOON;
			const newSun = tangoTsApi.boardState.tiles[boardIndex].iconType === TileIconType.SUN;
			r.stateMachineInputs('StateMachine').find(i => i.name === "isMoon")!.value = newMoon;
			r.stateMachineInputs('StateMachine').find(i => i.name === "isSun")!.value = newSun;
		}

		const r = new Rive({
			src: "src/assets/tile.riv",
			canvas: canvasRef!.current!,
			autoplay: true,
			stateMachines: 'StateMachine',
			onLoad: () => {
				if (deletedFlag) {
					return;
				} else {
					tangoTsApi.addChangeCallback( tileId, ( oldBoardState: BoardState, newBoardState: BoardState, completeReplace?: boolean) => {
						if (oldBoardState.tiles[boardIndex].iconType !== newBoardState.tiles[boardIndex].iconType) {
							updateTile(r);
						}
					});
					updateTile(r);
				}
			},
		})

		// setInterval(() => {
		// 	r.resizeDrawingSurfaceToCanvas();
		// }, 100)
		setTimeout(() => {
			r.resizeDrawingSurfaceToCanvas();
		}, 500);

		return () => {
			r.cleanup();
			tangoTsApi.removeChangeCallback(tileId);
		}
	}, [canvasRef])

	return (
		<div
			style={{
				userSelect: "none",
				// backgroundColor: generateDarkColor(),
				backgroundColor: "rgb(255, 255, 255)"
			}}
		>
			<canvas ref={canvasRef} id="canvas" style={{
				// width: "100%",
				// height: "100%",
				width: "60px",
				height: "60px",
				justifySelf: "center",
				alignSelf: "center",
			}} onClick={onClick}
			></canvas>
		</div>
	);
};
