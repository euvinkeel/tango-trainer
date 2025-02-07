import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

export const TangoRiveRegenerate = ({
	onClick,
}: {
	onClick: () => void
}) => {

	const { rive, RiveComponent } = useRive({
		src: "src/assets/regenerate.riv",
		autoplay: true,
		stateMachines: 'State',
	})

	const play = useStateMachineInput(rive, "State", "play");

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
