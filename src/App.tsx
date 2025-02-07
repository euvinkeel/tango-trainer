/// <reference types="vite-plugin-svgr/client" />
import { useState } from "react";
import "./App.css";
import TangoTS from "./utils/TangoTS";
import TangoRive from "./components/TangoRive";
import SunIcon from './svgs/sun.svg?react';
import MoonIcon from './svgs/moon.svg?react';
import { TwitterLogoIcon, LinkedInLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

function App() {

	const [TTS, _setTTS] = useState(() => {
		return new TangoTS({
			// usePresetBoards: true,
			usePresetBoards: false,
		})
	})
	
	return (
		<>
			<div className="background"></div>
			<div className="w-dvw">
				<div className="p-8 max-portrait:p-0 flex-col justify-center lg:max-w-lg max-portrait:max-w-dvw place-self-center">

					<div className="my-12">
						<h1 className="text-4xl text-title font-display font-bold">tango trainer</h1>
						<h3 className="text-xl text-secondary m-2 font-display max-w-md font-medium">improve your tango solve times by practicing infinite variants of tango puzzles</h3>
						<h3 className="text-sm text-secondary m-2 font-body max-w-md font-light">(not affiliated with LinkedIn)</h3>
					</div>

					<TangoRive tangoRiveId="tangoRive" tangoTsApi={TTS}/>

					<div className="bg-white max-portrait:max-w-dvw mx-4 my-6 rounded-md place-self-center p-6 max-w-md shadow-xl">
						<h3 className="text-xl text-secondary mb-4">How to play</h3>
						<ul>
							<li>Click a tile to change them into a <SunIcon className="icon"/> or a <MoonIcon className="icon"/>.</li>
							<li>There cannot be more than 2 <SunIcon className="icon"/> or <MoonIcon className="icon"/> next to each other vertically or horizontally.</li>
							<li>There must be exactly 3 <SunIcon className="icon"/> and 3 <MoonIcon className="icon"/> in every row and column.</li>
							<li>Tiles with an × between them must be opposite icons.</li>
							<li>Tiles with an = between them must be equivalent icons.</li>
							<li>There is exactly one solution to completely fill the board.</li>
						</ul>
						<p className="text-sm text-secondary my-4 text-left">Use the above rules to deduce each tile!</p>
					</div>

					<a className="text-secondary font-body text-xl" href="euvinkeel.github.io">Fan project made by Euvin</a>

					<div className="flex justify-center h-5 gap-2 m-2">
						<a href="https://x.com/euvin_keel">
							<TwitterLogoIcon height={30} width={30} />
						</a>
						<a href="https://www.linkedin.com/in/euvin-k-41887825a/">
							<LinkedInLogoIcon height={30} width={30} />
						</a>
						<a href="https://github.com/euvinkeel/tango-trainer">
							<GitHubLogoIcon height={30} width={30} />
						</a>
					</div>
				</div>

				<footer className="mt-20 w-full h-40 p-8 text-wrap font-body font-normal text-secondary backdrop-blur-xs place-self-center flex justify-center">
					<p className="text-sm max-w-lg">
						This is a fan-made, non-commercial project created solely for personal and educational purposes.
						It is not affiliated with or endorsed by LinkedIn Corporation, and all rights belong to their respective owners.
						Play the original Tango at
						<span><a className="text-secondary font-body" href="https://www.linkedin.com/games/tango"> https://www.linkedin.com/games/tango.</a></span>
					</p>
				</footer>
			</div>
		</>
	);
}

export default App;
