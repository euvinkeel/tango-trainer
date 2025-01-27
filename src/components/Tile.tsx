import { TileIconType, TileState } from '../types/types';
import { useRef } from 'react';

export const Tile = ({startState={
    iconType: TileIconType.EMPTY,
    locked: false,
    error: false,
}, onClick}: {startState?: TileState, onClick?: () => void }) => {
    // const { rive, RiveComponent } = useRive({
    //     src: "/src/assets/sunandmoon.riv",
    //     artboard: "Tile",
    //     stateMachines: "StateMachine",
    //     autoplay: true,
    // })

    // const isMoon = useStateMachineInput(rive, "StateMachine", "isMoon", startState && startState.iconType == TileIconType.MOON);
    // const isSun = useStateMachineInput(rive, "StateMachine", "isSun", startState && startState.iconType == TileIconType.SUN);
    // const change = useStateMachineInput(rive, "StateMachine", "Change");
    const highlightRef = useRef<HTMLButtonElement>(null);

    // useEffect(() => {
    //     if (highlightRef.current) {
    //         if (isMoon?.value) {
    //             highlightRef.current.style.backgroundColor = 'blue';
    //         }
    //         else if (isSun?.value) {
    //             highlightRef.current.style.backgroundColor = 'yellow';
    //         }
    //         else {
    //             highlightRef.current.style.backgroundColor = 'white';
    //         }
    //     }
    // }, [isMoon, isSun, change])

    // console.log(`moon: ${isMoon?.value}, sun: ${isSun?.value}`);
    // console.log(startState.iconType);

    return (
        <div className='tile' style={{
            position: 'relative',
            backgroundColor: startState.error ? `rgb(255, 0, 0)` : `rgb(255, 255, 255)`
        }}>
            <button 
            ref={highlightRef}
            onClick={onClick}
            style={{
                border: '1px solid black',
                backgroundColor: startState.iconType === TileIconType.MOON ? 'rgb(0, 110, 255)' : startState.iconType === TileIconType.SUN ? 'rgb(255, 208, 0)' : 'white',
                // position: 'absolute',
                // top: 0,
                // left: 0,
                width: '70%',
                height: '70%',
                opacity: 0.9,
                zIndex: 1,
            }}/>
            {/* <RiveComponent
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
                onClick={() => rive && change?.fire()}
            /> */}
        </div>
    )
};