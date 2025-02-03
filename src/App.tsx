// Rive
import { useEffect, useState } from "react";
import "./App.css";
// import TangoRive from "./components/TangoRive";
import TangoHTML from "./components/TangoHTML";
import TangoTS from "./utils/TangoTS";
import TangoRive from "./components/TangoRive";
// import { generateValidRowTileIcons } from "./utils/utils";

function App() {

	const [TTS, setTTS] = useState(() => {
		return new TangoTS({ })
	})

	return (
		<>
			<h1>tango trainer</h1>
			<h3>improve your tango ELO and bragging rights</h3>

			<hr></hr>
			{/* <TangoHTML tangoTsApi={TTS}/> */}
			<TangoRive tangoTsApi={TTS}/>
			<hr></hr>

			<div style={{
				height: "1000px"
			}}/>
		</>
	);
}

export default App;
