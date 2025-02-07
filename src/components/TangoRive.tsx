import { useCallback, useEffect, useRef, useState } from "react";
import TangoTS from "../utils/TangoTS";
import TangoRiveBoard from "./TangoRiveBoard";
import { BoardState } from "../types/types";
import { TangoRiveRegenerate } from "./TangoRiveRegenerate";
import { TangoRiveReset } from "./TangoRiveReset";

const TangoRive = ({
	tangoRiveId,
	tangoTsApi,
}: {
	tangoRiveId: string;
	tangoTsApi: InstanceType<typeof TangoTS>;
}) => {
	const [myWinFlag, setMyWinFlag] = useState(false);
	const timeEnabledRef = useRef(false); // seconds
	const timeRef = useRef(0); // seconds
	const timerRef = useRef<HTMLHeadingElement>(null);

	useEffect(() => {
		return tangoTsApi.addChangeCallback(
			tangoRiveId,
			(
				_oldBoardState: BoardState,
				_newBoardState: BoardState,
				completeReplace?: boolean
			) => {
				// console.log("CHANGE CALLBACK");
				if (completeReplace) {
				} else {
				}
				setMyWinFlag(tangoTsApi.isAWinState);
			}
		);
	}, [tangoTsApi]);

	const updateTimerDisplay = useCallback(() => {
		const currTime = timeRef.current;
		const hours = Math.floor(currTime / 60);
		const minutes = currTime % 60;
		timerRef.current!.textContent = `${hours
			.toString()
			.padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
	}, [timeRef]);
	const resetTimer = useCallback(() => {
		timeEnabledRef.current = false;
		timeRef.current = 0;
		updateTimerDisplay();
	}, [timeRef, updateTimerDisplay]);

	useEffect(() => {
		const timerInterval = setInterval(() => {
			if (timeEnabledRef.current && !myWinFlag) {
				timeRef.current += 1;
			}
			if (!timeEnabledRef.current && !myWinFlag) {
				timeRef.current = 0;
			}
			updateTimerDisplay();
		}, 1000);
		return () => clearInterval(timerInterval);
	}, [myWinFlag]);

	return (
		<>
			<div className="bg-egg-light rounded-xl shadow-xl p-8 flex-col items-center justify-center">
				<h1
					ref={timerRef}
					className="m-1 text-3xl text-egg-text font-mono font-black">
					00:00
				</h1>
				<div className="flex justify-center h-14 w-40 m-2 place-self-center">
					<TangoRiveRegenerate
						onClick={() => {
							resetTimer();
							tangoTsApi.regenerateBoard();
						}}
						onLongPress={() => {
							resetTimer();
							tangoTsApi.regenerateBoard(true);
						}}
					/>
					<TangoRiveReset
						onClick={() => {
							resetTimer();
							tangoTsApi.resetBoard();
						}}
					/>
				</div>
				<TangoRiveBoard
					boardId={`board_${tangoRiveId}`}
					tangoTsApi={tangoTsApi}
					tileClickCallback={(idx) => {
						tangoTsApi.changeTileAtIndex(idx);
						if (!timeEnabledRef.current) {
							updateTimerDisplay();
							timeEnabledRef.current = true;
						}
					}}
				/>
			</div>
		</>
	);
};

export default TangoRive;
