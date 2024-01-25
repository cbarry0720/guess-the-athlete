import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import "../styles/table.css";
import "../styles/Player.css";

function Player() {
	const location = useLocation();
	const [player, setPlayer] = useState({});
	const [table, setTable] = useState("");
	const [searched, setSearched] = useState([]);
	const [correct, setCorrect] = useState(null);
	const [tries, setTries] = useState(3);
	const where = location.state == null ? {} : location.state.where;
	const league = location.state == null ? {} : location.state.league;
	const modern = location.state == null ? {} : location.state.modern;

	const inputChange = (e) => {
		const name = e.target.value;
		if (name.length < 3) {
			setSearched([]);
			return;
		}
		axios
			.get(`http://localhost:4000/players/search`, {
				params: {
					name,
					league: player.league,
				},
			})
			.then((res) => {
				setSearched([]);
				setSearched(res.data.athletes);
			});
	};

	const click = (id) => {
		return () => {
			setCorrect(id === player.id);
			if (!correct && tries > 0) {
				setTries(tries - 1);
			}
			setSearched([]);
		};
	};

	const getNewPlayer = () => {
		axios
			.post("http://localhost:4000/players/random", {
				where,
				league,
				modern,
			})
			.then((x) => {
				let json = x.data;
				setPlayer(json);
				const link = json.link;
				const position = json.position;
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
	};
	useEffect(getNewPlayer, []);

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
					<div className="player-info-left">
						<img
							className="player-icon"
							alt="player-name"
							src={player.image}
						></img>
						<h2>{player.name}</h2>
						<button
							onClick={() => {
								setTries(3);
								setCorrect(null);
								setSearched([]);
								setTable("");
								getNewPlayer();
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
				<div className="search-container">
					<div className="input-div">
						<input className="input" onChange={inputChange} />
					</div>
					<div className="results-container">
						{searched.map((x) => {
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
			</div>
			<div dangerouslySetInnerHTML={{ __html: table }}></div>
		</div>
	);
}
export default Player;
