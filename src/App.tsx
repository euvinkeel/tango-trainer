// Rive
import { useState } from "react";
import "./App.css";
import TangoHTML from "./components/TangoHTML";
import TangoTS from "./utils/TangoTS";
import TangoRive from "./components/TangoRive";

function App() {

	const [TTS, setTTS] = useState(() => {
		return new TangoTS({
			usePresetBoards: true,
		})
	})
	
	return (
		<>
			<h1>tango trainer</h1>
			<h3>improve your tango ELO and bragging rights</h3>
			<hr></hr>

			<TangoHTML tangoHTMLId="tangoHTML" tangoTsApi={TTS}/>
			<TangoRive tangoRiveId="tangoRive" tangoTsApi={TTS}/>
			
			<hr></hr>
		</>
	);
}

export default App;
