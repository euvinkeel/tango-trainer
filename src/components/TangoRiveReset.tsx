import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

export const TangoRiveReset = ({
	onClick,
}: {
	onClick: () => void
}) => {

	const { rive, RiveComponent } = useRive({
		src: "clear.riv",
		autoplay: true,
		stateMachines: 'State',
	})

	const play = useStateMachineInput(rive, "State", "clear");

	return (
		<RiveComponent 
		// className="aspect-square"
		onClick={() => {
			play?.fire();
			onClick();
		}}>
		</RiveComponent>
	)
};
