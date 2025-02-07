import TangoTS from "../utils/TangoTS";
import { BoardState, TileIconType } from "../types/types";
import { Rive } from "@rive-app/react-canvas";
import { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "@react-spring/web";

const springConfig = { mass: 4, tension: 500, friction: 50, precision: 0.0001, };

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
			if (!r.stateMachineInputs('StateMachine')) {
				return;
			}
			r.stateMachineInputs('StateMachine').find(i => i.name === "isMoon")!.value = newMoon;
			r.stateMachineInputs('StateMachine').find(i => i.name === "isSun")!.value = newSun;

			if (tangoTsApi.boardState.tiles[boardIndex].error) {
				setTimeout(() => {
					if (tangoTsApi.boardState.tiles[boardIndex].error) {
						r.stateMachineInputs('StateMachine').find(i => i.name === "error")!.value = tangoTsApi.boardState.tiles[boardIndex].error;
					}
				}, 1000)
			} else {
				r.stateMachineInputs('StateMachine').find(i => i.name === "error")!.value = false;
			}

			if (tangoTsApi.isAWinState) {
				setTimeout(() => {
					r.stateMachineInputs('StateMachine').find(i => i.name === "win")!.fire();
				}, boardIndex * 5)
			}
		}

		const r = new Rive({
			src: "tile.riv",
			canvas: canvasRef!.current!,
			autoplay: true,
			stateMachines: 'StateMachine',
			onLoad: () => {
				setTimeout(() => {
					setShowing(true);
					tangoTsApi.addChangeCallback( tileId, ( _oldBoardState: BoardState, _newBoardState: BoardState, completeReplace?: boolean) => {
						if (completeReplace) {
							r.stateMachineInputs('StateMachine').find(i => i.name === "isMoon")!.value = false;
							r.stateMachineInputs('StateMachine').find(i => i.name === "isSun")!.value = false;
							setTimeout(() => {
								updateTile(r);
							}, 500)
						} else {
							updateTile(r);
						}
					});
					r.resizeDrawingSurfaceToCanvas();
					updateTile(r);
				}, 500)
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
			<animated.canvas ref={canvasRef} className="tile shadow-2xl aspect-square" style={{
				opacity: opacity,
				width: "60px",
				height: "60px",
				justifySelf: "center",
				alignSelf: "center",
				// position: 'absolute', top: 0, left: 0
			}} onClick={onClick} >
			</animated.canvas>
		</div>
	);
};
