// import { useRive, useRiveFile, useStateMachineInput } from '@rive-app/react-canvas';

// export const TileRive = () => {
//     const { rive, RiveComponent } = useRive({
//         src: "../assets/sunandmoon.riv",
//         stateMachines: "StateMachine",
//         autoplay: false,
//     })

//     const isMoon = useStateMachineInput(rive, "StateMachine", "isMoon", false);
//     const isSun = useStateMachineInput(rive, "StateMachine", "isSun", false);
//     const change = useStateMachineInput(rive, "StateMachine", "Change");

//     return (
//         <RiveComponent
//             onClick={() => rive && change?.fire()}
//         />
//     )
// };