/// <reference types="vite-plugin-svgr/client" />
import { useState } from "react";
import "./App.css";
import TangoTS from "./utils/TangoTS";
import TangoRive from "./components/TangoRive";
import SunIcon from './assets/sun.svg?react';
import MoonIcon from './assets/moon.svg?react';

function App() {

	const [TTS, setTTS] = useState(() => {
		return new TangoTS({
			// usePresetBoards: true,
			usePresetBoards: false,
		})
	})
	
	return (
		<>
			<div className="p-8 flex-col justify-center">

				<div className="my-12">
					<h1 className="text-4xl text-title font-display font-bold">tango trainer</h1>
					<h3 className="text-xl text-secondary m-2 font-display max-w-md font-medium">improve your tango solve times by practicing infinite variants of tango puzzles</h3>
					<h3 className="text-sm text-secondary m-2 font-body max-w-md font-light">(not affiliated with LinkedIn)</h3>
				</div>

				<TangoRive tangoRiveId="tangoRive" tangoTsApi={TTS}/>

				<div className="bg-white my-6 rounded-md place-self-center p-6 max-w-sm shadow-xl">
					<h3 className="text-xl text-secondary mb-4">How to play</h3>
					<ul>
						{/* <li>Click a cell to change it into a <span><svg /></></span></li> */}
						<li>Click a tile to change it into a <SunIcon className="icon"/> or a <MoonIcon className="icon"/>.</li>
						<li>There cannot be more than 2 <SunIcon className="icon"/> or <MoonIcon className="icon"/> next to each other vertically or horizontally.</li>
						<li>There must be exactly 3 <SunIcon className="icon"/> and 3 <MoonIcon className="icon"/> in every row and column.</li>
						<li>Tiles with an × between them must be opposite icons.</li>
						<li>Tiles with an = between them must be equivalent icons.</li>
						<li>There is exactly one solution to completely fill the board.</li>
						{/* <li>Every row must have the same number of suns and moons.</li>
						<li>Click a cell to change it into a <img src="sun.svg" alt="Sun icon" className="inline-block h-5 w-5 mr-2" /> or a <img src="moon.svg" alt="Moon icon" className="inline-block h-5 w-5 mr-2" /></li> */}
					</ul>
				</div>

				<footer className="my-20 text-sm max-w-md font-body font-normal text-secondary backdrop-blur-xs place-self-center">
					This is a fan-made, non-commercial project created solely for personal and educational purposes.
					It is not affiliated with or endorsed by LinkedIn Corporation, and all rights belong to their respective owners.
					Play the original Tango
					<span><a className="text-secondary font-body" href="https://www.linkedin.com/games/tango"> here.</a></span>
				</footer>

			</div>
		</>
	);
}

export default App;
