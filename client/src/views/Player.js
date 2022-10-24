import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import "../styles/table.css";
import "../styles/Player.css";

function Player() {
	const location = useLocation();
	const [player, setPlayer] = useState({});
	const [table, setTable] = useState("");
	const [searched, setSearched] = useState({ athletes: [] });
	const [correct, setCorrect] = useState(null);
	const [tries, setTries] = useState(3);
	const where = location.state == null ? {} : location.state.where;
	const league = location.state == null ? {} : location.state.league;
	const modern = location.state == null ? {} : location.state.modern;

	const inputChange = (e) => {
		const name = e.target.value;
		if (name.length < 3) {
			setSearched({ athletes: [] });
			return;
		}
		console.log(name);
		axios
			.get(`http://localhost:4000/players/search`, {
				params: {
					name,
					league: player.league,
				},
			})
			.then((res) => {
				setSearched(res.data);
			});
	};

	const click = (id) => {
		return () => {
			setCorrect(id === player.athlete.id);
			if (!correct && tries > 0) {
				setTries(tries - 1);
			}
			setSearched({ athletes: [] });
		};
	};

	useEffect(() => {
		axios
			.get("http://localhost:4000/players/random", {
				params: {
					where,
					league,
					modern,
				},
			})
			.then((x) => {
				let json = x.data;
				setPlayer(json);
				console.log(json);
				const link = json.athlete.link;
				const position = json.data.position;
				axios
					.get(
						`http://localhost:4000/players/table?position=${position}&link=${link}`
					)
					.then((x) => {
						setTable(x.data);
					});
			})
			.catch((e) => {
				console.error(e);
			});
	}, []);

	return (
		<div className="player-container">
			<div className="player-info">
				{!correct && tries > 0 ? (
					<button
						onClick={() => {
							setCorrect(false);
							setTries(0);
						}}
					>
						Give Up
					</button>
				) : (
					<></>
				)}
				{correct || tries === 0 ? (
					<div>
						<img
							className="player-icon"
							alt="player-name"
							src={player.athlete.image}
						></img>
						<h2>{player.athlete ? player.athlete.name : ""}</h2>
						<button
							onClick={() => {
								window.location.reload();
							}}
						>
							Try Again
						</button>
					</div>
				) : (
					<></>
				)}
				{correct ? (
					<img
						className="icon"
						alt="correct"
						src={require("../assets/check.png")}
					></img>
				) : correct != null ? (
					<img
						className="icon"
						src={require("../assets/x.png")}
						alt="incorrect"
					></img>
				) : (
					<></>
				)}
			</div>
			<div dangerouslySetInnerHTML={{ __html: table }}></div>

			<div className="input-div">
				<input className="input" onChange={inputChange} />
			</div>
			<div className="results-container">
				{searched.athletes.map((x) => {
					return (
						<div
							onClick={click(x.id)}
							key={x.id}
							className="result"
						>
							<img alt={x.name} src={x.image}></img>
							<p>{x.name}</p>
						</div>
					);
				})}
			</div>
		</div>
	);
}
export default Player;
