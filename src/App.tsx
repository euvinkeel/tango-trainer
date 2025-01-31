// Rive
import "./App.css";
import Board from "./components/Board";
import TangoRive from "./components/TangoRive";
// import { generateValidRowTileIcons } from "./utils/utils";

function App() {
	return (
		<>
			<h1>tango trainer</h1>
			<TangoRive/>
			<h3>improve your tango ELO and bragging rights</h3>
			<Board rows={6} columns={6} />
			<hr></hr>
			{/* <Board rows={4} columns={8} /> */}
			<hr></hr>
			{/* <Board rows={4} columns={16} /> */}
			<p></p>
		</>
	);
}

export default App;
