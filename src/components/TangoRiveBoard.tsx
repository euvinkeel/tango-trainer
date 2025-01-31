import { useSpring, animated } from "@react-spring/web";

const TangoRiveBoard = () => {

	// This board is meant to be emphemeral.

	// const [measureRef, { width, height }] = useMeasure()

	// const transitions = useTransition()

	const [springs, api] = useSpring(() => ({
		from: { 
			x: 0,
			opacity: 0,
			transform: "perspective(800px) rotateY(45deg)",
		},
		config: {
			mass: 2,
			tension: 600,
			friction: 40,
		}
	}));

	// useEffect(() => {
	// 	api.start({
	// 		to: {
	// 			x: 100,
	// 			opacity: 1,
	// 			transform: "perspective(800px) rotateY(0deg)",
	// 		},
	// 	});
	// 	// ref.current!.style.transform = "perspective(400px) rotateY(0deg)"
	// 	setTimeout(() => {
	// 		// springs.x.
	// 		api.start({
	// 			to: {
	// 				x: 50,
	// 				opacity: 0.5,
	// 				transform: "perspective(800px) rotateY(180deg)",
	// 			},
	// 		});
	// 		// console.log("Timeout!");
	// 		// console.log(ref)
	// 		// console.log(ref.current)
	// 		// console.log(ref.current?.innerHTML)
	// 		// ref.current!.style.transform = "perspective(400px) rotateY(15deg)"
	// 	}, 1000);
	// 	console.log("UseEffect Called!");
	// }, []);

	return (
		<>
			{/* <div className="test" ref={ref}></div> */}
			<animated.div
				className="test"
				// ref = {ref}
				style={{
					width: "300px",
					height: "300px",
					backgroundColor: "rgb(100, 100, 100)",
					margin: "10px auto",
					...springs,
				}}
			/>
		</>
	);
};

export default TangoRiveBoard;
