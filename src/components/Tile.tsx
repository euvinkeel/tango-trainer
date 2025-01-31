// import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
import Sun from '../assets/sun.svg';
import Moon from '../assets/moon.svg';
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
    // isSun?.value

    // const change = useStateMachineInput(rive, "StateMachine", "Change");
    const highlightRef = useRef<HTMLButtonElement>(null);

    // console.log(`moon: ${isMoon?.value}, sun: ${isSun?.value}`);
    // console.log(startState.iconType);

    return (
        <div className='tile' style={{
            position: 'relative',
            backgroundColor: (()=>{
                if (startState.error) {
                    if (startState.locked) {
                        return 'rgb(150, 100, 100)'
                    } else {
                        return 'rgb(255, 100, 100)'
                    }
                } else {
                    if (startState.locked) {
                        return 'rgb(200, 200, 200)'
                    } else {
                        return 'rgb(255, 255, 255)'
                    }
                }
                return startState.error ? `rgb(255, 0, 0)` : startState.locked ? `rgb(150, 150, 150)` : `rgb(255, 255, 255)`
            })(),
        }}>
            <button 
            ref={highlightRef}
            onClick={onClick}
            style={{
                // border: '0px solid black',
                outline: 'none',
                WebkitTapHighlightColor: 'transparent',

                // backgroundColor: startState.iconType === TileIconType.MOON ? 'rgb(0, 110, 255)' : startState.iconType === TileIconType.SUN ? 'rgb(255, 208, 0)' : 'white',
                // position: 'absolute',
                // top: 0,
                // left: 0,
                width: '70%',
                height: '70%',
                opacity: 0.9,
                zIndex: 1,
            }}>
                {
                    startState.iconType === TileIconType.MOON ? <img src={Moon}/> : startState.iconType === TileIconType.SUN ? <img src={Sun}/> : <></>
                }
            </button>
            {/* <RiveComponent
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
                // onClick={() => rive && change?.fire()}
                onClick={onClick}
            /> */}
        </div>
    )
};