import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
import TangoTS from '../utils/TangoTS';
import { useEffect } from 'react';
import { BoardState, TileIconType } from '../types/types';


export const TangoRiveBoardTile = ({ boardIndex, tangoTsApi, onClick }: { boardIndex: number, tangoTsApi: InstanceType<typeof TangoTS>, onClick: () => void }) => {
    const { rive, RiveComponent } = useRive({
        src: "src/assets/tile.riv", // spent way too much time trying to figure this out
		// i just screwed up the import path, and i forogt that assets was actually in src
		// i guess relative paths never worked. any relative path here did not work
		// also, the error messages are trash: why is it claiming "bad header" and "problem loading file, may be corrupt"
		// when it is a path issue
        autoplay: true,
        stateMachines: "StateMachine",
    })


    const isMoon = useStateMachineInput(rive, "StateMachine", "isMoon", false);
    const isSun = useStateMachineInput(rive, "StateMachine", "isSun", false);


	useEffect(() => {
		let lifetime = 0;
		const intid = setInterval(() => {
			lifetime += 100;
			try {
				if (lifetime > 2000) {
					clearInterval(intid);
					return;
				}
				if (isMoon !== null && isSun !== null) {
					// console.log(isMoon, isSun);
					isMoon!.value = tangoTsApi.boardState.tiles[boardIndex].iconType === TileIconType.MOON;
					isSun!.value = tangoTsApi.boardState.tiles[boardIndex].iconType === TileIconType.SUN;
				} else {
					// console.log("OWNED")
					clearInterval(intid);
				}
			} finally {
				clearInterval(intid);
			}
		}, 100);

		tangoTsApi.addChangeCallback((oldBoardState: BoardState, newBoardState: BoardState, completeReplace?: boolean) => {
			if (oldBoardState.tiles[boardIndex] != newBoardState.tiles[boardIndex]) {
				if (isMoon) {
					isMoon!.value = newBoardState.tiles[boardIndex].iconType === TileIconType.MOON;
				}
				if (isSun) {
					isSun!.value = newBoardState.tiles[boardIndex].iconType === TileIconType.SUN;
				}
			}
		})
	}, [tangoTsApi, isMoon, isSun])

    return (
		<div style={{
			// height: "200px",
			// width: "200px",
			// backgroundColor: "rgb(255, 100, 100)",
			// border: "5px solid yellow"
			userSelect: "none",
		}}>
			<RiveComponent
				onClick={onClick}
			/>
		</div>
    )
};