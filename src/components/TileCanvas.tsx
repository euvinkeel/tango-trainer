import { useEffect } from "react";

export const TileCanvas = ({ moon, sun, onClick, }: {moon: boolean, sun: boolean, onClick: () => void; }) => {


	useEffect(() => {
		// const isMoon = useStateMachineInput(rive, "StateMachine", "isMoon", moon);
		// const isSun = useStateMachineInput(rive, "StateMachine", "isSun", sun);
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
	}, [])


	// return <RiveComponent onClick={onClick} />
	return (<div style={{
		width: "50px",
		height: "50px",
		margin: "auto",
	}}>
		<RiveComponent onClick={onClick} />
	</div>)

};
