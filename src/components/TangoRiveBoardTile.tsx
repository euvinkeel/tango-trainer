import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
import TangoTS from '../utils/TangoTS';

export const TangoRiveBoardTile = ({ boardIndex, tangoTsApi, onClick }: { boardIndex: number, tangoTsApi: InstanceType<typeof TangoTS>, onClick: () => void }) => {
	console.log("TILE:", boardIndex);

    const { rive, RiveComponent } = useRive({
        src: "../assets/tile.riv/",
        autoplay: true,
        stateMachines: "StateMachine",
    })

    // const isMoon = useStateMachineInput(rive, "StateMachine", "isMoon", false);
    // const isSun = useStateMachineInput(rive, "StateMachine", "isSun", false);
    // const change = useStateMachineInput(rive, "StateMachine", "Change");

    return (
		<div>
			<RiveComponent
				onClick={onClick}
			/>
		</div>
		// <Rive
		// 	src="https://cdn.rive.app/animations/vehicles.riv"
		// 	stateMachines="bumpy"
		// />
    )
};