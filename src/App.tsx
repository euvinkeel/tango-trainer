// Rive
import "./App.css";
import Board from "./components/Board";
// import { generateValidRowTileIcons } from "./utils/utils";

function App() {

	console.log("TEST")
	// console.log(generateValidRowTileIcons(6))

	return (
		<>
			<h1>tango trainer</h1>
			<h3>improve your tango ELO and bragging rights</h3>
			<Board rows={6} columns={6} />
			<hr></hr>
			<p></p>
		</>
	);
}

export default App;
