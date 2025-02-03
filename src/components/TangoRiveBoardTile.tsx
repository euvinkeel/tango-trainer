import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
import TangoTS from '../utils/TangoTS';

export const TangoRiveBoardTile = ({ boardIndex, tangoTsApi, onClick }: { boardIndex: number, tangoTsApi: InstanceType<typeof TangoTS>, onClick: () => void }) => {
	console.log("TILE:", boardIndex);

    const { rive, RiveComponent } = useRive({
        src: "src/assets/tile.riv", // spent way too much time trying to figure this out
		// i just screwed up the import path, and i forogt that assets was actually in src
		// i guess relative paths never worked. any relative path here did not work
		// also, the error messages are trash: why is it claiming "bad header" and "problem loading file, may be corrupt"
		// when it is a path issue

        autoplay: true,
        stateMachines: "StateMachine",
    })

    // const isMoon = useStateMachineInput(rive, "StateMachine", "isMoon", false);
    // const isSun = useStateMachineInput(rive, "StateMachine", "isSun", false);
    // const change = useStateMachineInput(rive, "StateMachine", "Change");

    return (
		<div style={{
			height: "200px",
			width: "200px",
			backgroundColor: "rgb(255, 100, 100)",
			border: "5px solid yellow"
		}}>
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