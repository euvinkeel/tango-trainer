import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useEffect } from "react";

export const TileCanvas = ({ moon, sun, onClick, }: {moon: boolean, sun: boolean, onClick: () => void; }) => {

	const { rive, RiveComponent } = useRive({
		src: "src/assets/tile.riv", // spent way too much time trying to figure this out
		// i just screwed up the import path, and i forogt that assets was actually in src
		// i guess relative paths never worked. any relative path here did not work
		// also, the error messages are trash: why is it claiming "bad header" and "problem loading file, may be corrupt"
		// when it is a path issue
		autoplay: true,
		stateMachines: "StateMachine",
	});

	// console.log(moon, sun);
	const isMoon = useStateMachineInput(rive, "StateMachine", "isMoon", moon);
	const isSun = useStateMachineInput(rive, "StateMachine", "isSun", sun);

	useEffect(() => {
		let checkerId = null;
		const check = (isMoon: any, isSun: any) => {
			if (isMoon) {
				isMoon!.value = moon;
			}
			if (isSun) {
				isSun!.value = sun;
			}
			if (isMoon !== null && isSun !== null) {
				console.log("FINALLY")
				isMoon!.value = moon;
				isSun!.value = sun;
				clearInterval(checkerId!);
			}
		}
		checkerId = setInterval(() => {
			check(isMoon, isSun);
		}, 100)
		check(isMoon, isSun);
	}, [rive, isMoon, isSun, moon, sun])


	// return <RiveComponent onClick={onClick} />
	return (<div style={{
		width: "50px",
		height: "50px",
		margin: "auto",
	}}>
		<RiveComponent onClick={onClick} />
	</div>)

};
