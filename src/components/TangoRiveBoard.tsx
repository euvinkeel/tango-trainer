import { useSpring } from "@react-spring/web";

const TangoRiveBoard = () => {

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

	return (
		<>
			<div
				className="test"

				style={{
					width: "300px",
					height: "300px",
					backgroundColor: "rgb(100, 100, 100)",
					margin: "10px auto",
					// ...springs,
				}}>

			</div>
		</>
	);
};

export default TangoRiveBoard;
