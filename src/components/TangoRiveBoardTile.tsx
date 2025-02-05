import TangoTS from "../utils/TangoTS";
import { BoardState, TileIconType } from "../types/types";
import { Rive, useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useEffect, useRef, useState } from "react";
import { getRandInt } from "../utils/utils";
import { useSpring, animated } from "@react-spring/web";

const springConfig = { mass: 4, tension: 500, friction: 50, precision: 0.0001, };

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
	const [showing, setShowing] = useState(false);
	const { opacity } = useSpring({
		opacity: showing ? 1 : 0,
		config: springConfig,
	})

	useEffect(() => {
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
				r.resizeDrawingSurfaceToCanvas();
				setTimeout(() => {
					setShowing(true);
					tangoTsApi.addChangeCallback( tileId, ( oldBoardState: BoardState, newBoardState: BoardState, completeReplace?: boolean) => {
						if (oldBoardState.tiles[boardIndex].iconType !== newBoardState.tiles[boardIndex].iconType) {
							updateTile(r);
						}
					});
					updateTile(r);
				}, 200)
			},
		})
		return () => {
			r.cleanup();
			tangoTsApi.removeChangeCallback(tileId);
		}
	}, [canvasRef])

	return (
		<div
			style={{
				userSelect: "none",
				backgroundColor: "rgb(255, 255, 255)"
			}}
		>
			<animated.canvas ref={canvasRef} id="canvas" className="tile" style={{
				opacity: opacity,
				width: "60px",
				height: "60px",
				justifySelf: "center",
				alignSelf: "center",
			}} onClick={onClick} >
			</animated.canvas>
		</div>
	);
};
