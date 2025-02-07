import { Rive } from "@rive-app/react-canvas";
import { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "@react-spring/web";

const springConfig = { mass: 4, tension: 500, friction: 50, precision: 0.0001, };

export const TangoRiveConstraint = ({
	isEquals,
	offsetX,
	offsetY,
}: {
	isEquals: boolean;
	offsetX: number;
	offsetY: number;
}) => {

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [showing, setShowing] = useState(false);
	const { opacity } = useSpring({
		opacity: showing ? 1 : 0,
		config: springConfig,
	})

	useEffect(() => {

		const updateTile = (r: Rive) => {
			r.stateMachineInputs('State').find(i => i.name === "isEquals")!.value = isEquals;
		}

		const r = new Rive({
			src: "constraint.riv",
			canvas: canvasRef!.current!,
			autoplay: true,
			stateMachines: 'State',
			onLoad: () => {
				r.resizeDrawingSurfaceToCanvas();
				r.stateMachineInputs('State').find(i => i.name === "isEquals")!.value = isEquals;
				setTimeout(() => {
					setShowing(true);
					updateTile(r);
				}, 200)
			},
		})
		return () => {
			r.cleanup();
		}
	})

	return (
		// <div 
		<animated.div 
			className="constraint"
			style={{
				opacity: opacity,
				position: "absolute",
				userSelect: "none",
				transform: `translateX(${offsetX}px) translateY(${offsetY}px)`,
			}}
		>
			<animated.canvas 
				ref={canvasRef} 
				style={{
					zIndex: 100,
					opacity: opacity,
					// width: opacity.to((op) => op*20),
					// height: opacity.to((op) => op*20),
					width: "20px",
					height: "20px",
					justifySelf: "center",
					alignSelf: "center",
				}}
			>
			</animated.canvas>
		{/* </div> */}
		</animated.div>
	);
};
