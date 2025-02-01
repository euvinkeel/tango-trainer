// Rive
import { useEffect, useState } from "react";
import "./App.css";
// import TangoRive from "./components/TangoRive";
import TangoHTML from "./components/TangoHTML";
import TangoTS from "./utils/TangoTS";
// import { generateValidRowTileIcons } from "./utils/utils";

function App() {

	const [TTS, setTTS] = useState(() => {
		return new TangoTS({ })
	})

	return (
		<>
			<h1>tango trainer</h1>
			{/* <Test/> */}
			<h3>improve your tango ELO and bragging rights</h3>
			<TangoHTML tangoTsApi={TTS}/>
			<TangoHTML tangoTsApi={TTS}/>
			{/* <Board rows={6} columns={6} /> */}
			<hr></hr>
			{/* <Board rows={4} columns={8} /> */}
			<hr></hr>
			{/* <Board rows={4} columns={16} /> */}
			<p></p>
		</>
	);
}

export default App;
