// Rive
import "./App.css";
import Board from "./components/Board";
// import { useRive } from '@rive-app/react-canvas';

// export const UrlDemo = () => {
//   const { rive, RiveComponent } = useRive({
//     // src: "https://cdn.rive.app/animations/vehicles.riv",
//     autoplay: true,
//   });
//   return <RiveComponent className="LOL" />;
// };

function App() {
	// const [count, setCount] = useState(0)
	return (
		<>
			<h1>tango trainer</h1>
			<h3>improve your tango ELO and bragging rights</h3>
			<Board rows={6} columns={6} />
			{/* <Board rows={3} columns={5} /> */}
			<hr></hr>
			<p></p>
		</>
	);
}

export default App;
