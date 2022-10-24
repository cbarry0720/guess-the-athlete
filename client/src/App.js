import logo from "./logo.svg";
import Frontpage from "./views/Frontpage";
import Player from "./views/Player";
import Results from "./views/Results";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
	return (
		<BrowserRouter>
			<Routes path="/">
				<Route index element={<Frontpage />} />
				<Route path="player" element={<Player />} />
				<Route path="results" element={<Results />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
