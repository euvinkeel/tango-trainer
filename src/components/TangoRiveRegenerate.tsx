import { useEffect, useRef, useState } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

export const TangoRiveRegenerate = ({
	onClick,
	onLongPress,
}: {
	onClick: () => void;
	onLongPress: () => void;
}) => {
	const { rive, RiveComponent } = useRive({
		src: "regenerate.riv",
		autoplay: true,
		stateMachines: "State",
	});
	const play = useStateMachineInput(rive, "State", "play");

	const [isPressed, setIsPressed] = useState(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleMouseDown = () => {
		setIsPressed(true);
		timerRef.current = setTimeout(() => {
			setTimeout(() => {
				play?.fire();
			}, 100)
			onLongPress();
			setIsPressed(false);
		}, 500);
	};

	const handleMouseUp = () => {
		if (isPressed) {
			play?.fire();
			onClick();
		}
		setIsPressed(false);
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	};

	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, []);

	return (
		<RiveComponent
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onTouchStart={handleMouseDown}
			onTouchEnd={handleMouseUp}
			onMouseLeave={handleMouseUp}
		></RiveComponent>
	);
};
