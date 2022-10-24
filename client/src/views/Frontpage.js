import { React, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Frontpage.css";

function Frontpage() {
	const [dates, setDates] = useState({
		all: { from: "1871", to: "2022" },
		nba: { from: "1947", to: "2022" },
		nfl: { from: "1920", to: "2022" },
		mlb: { from: "1871", to: "2022" },
	});

	return (
		<div id="main-container">
			<div id="top-container">
				<h2>All Leagues</h2>
				<div className="content-container">
					<div className="links-container">
						<Link className="link" to="/player">
							Random
						</Link>
						<Link
							className="link"
							to="/player"
							state={{ where: { hof: { equals: true } } }}
						>
							Hall of Famers
						</Link>
						<Link
							className="link"
							to="/player"
							state={{ where: { active: { equals: true } } }}
						>
							Active
						</Link>
					</div>
					<div className="years-container">
						<p>From</p>
						<input
							className="input-from"
							defaultValue={dates.all.from}
							onChange={(e) => {
								let temp = dates;
								temp.all.from = e;
								setDates(temp);
							}}
						></input>
						<p>To</p>
						<input
							className="input-to"
							defaultValue={dates.all.to}
							onChange={(e) => {
								let temp = dates;
								temp.all.to = e;
								setDates(temp);
							}}
						></input>
						<Link
							className="link"
							to="/player"
							state={{
								where: {
									from: { equals: dates.all.from },
									to: { equals: dates.all.to },
								},
							}}
						>
							Go
						</Link>
					</div>
				</div>
			</div>
			<div className="league-container">
				<h2>NBA</h2>
				<div className="content-container">
					<div className="links-container">
						<Link
							className="link"
							to="/player"
							state={{ league: "NBA" }}
						>
							Random
						</Link>
						<Link
							className="link"
							to="/player"
							state={{
								league: "NBA",
								where: { allstars: { gt: 3 } },
							}}
						>
							All-Stars
						</Link>
						<Link
							className="link"
							to="/player"
							state={{
								league: "NBA",
								where: { hof: { equals: true } },
							}}
						>
							Hall of Famers
						</Link>
						<Link
							className="link"
							to="/player"
							state={{
								league: "NBA",
								where: { active: { equals: true } },
							}}
						>
							Active
						</Link>
					</div>
					<div className="years-container">
						<p>From</p>
						<input
							className="input-from"
							defaultValue={dates.nba.from}
							onChange={(e) => {
								let temp = dates;
								temp.nba.from = e;
								setDates(temp);
							}}
						></input>
						<p>To</p>
						<input
							className="input-to"
							defaultValue={dates.nba.to}
							onChange={(e) => {
								let temp = dates;
								temp.nba.to = e;
								setDates(temp);
							}}
						></input>
						<Link
							className="link"
							to="/player"
							state={{
								where: {
									from: { equals: dates.nba.from },
									to: { equals: dates.nba.to },
								},
							}}
						>
							Go
						</Link>
					</div>
				</div>
			</div>
			<div className="league-container">
				<h2>MLB</h2>
				<div className="content-container">
					<div className="links-container">
						<Link
							className="link"
							to="/player"
							state={{ league: "MLB" }}
						>
							Random
						</Link>
						<Link
							className="link"
							to="/player"
							state={{
								league: "MLB",
								where: { allstars: { gt: 3 } },
							}}
						>
							All-Stars
						</Link>
						<Link
							className="link"
							to="/player"
							state={{
								league: "MLB",
								where: { hof: { equals: true } },
							}}
						>
							Hall of Famers
						</Link>
						<Link
							className="link"
							to="/player"
							state={{
								league: "MLB",
								where: { active: { equals: true } },
							}}
						>
							Active
						</Link>
						<Link
							className="link"
							to="/player"
							state={{
								league: "MLB",
								where: { allstars: { gt: 3 } },
								modern: true,
							}}
						>
							All-Stars (post 1970)
						</Link>
					</div>
					<div className="years-container">
						<p>From</p>
						<input
							className="input-from"
							defaultValue={dates.mlb.from}
							onChange={(e) => {
								let temp = dates;
								temp.mlb.from = e;
								setDates(temp);
							}}
						></input>
						<p>To</p>
						<input
							className="input-to"
							defaultValue={dates.mlb.to}
							onChange={(e) => {
								let temp = dates;
								temp.mlb.to = e;
								setDates(temp);
							}}
						></input>
						<Link
							className="link"
							to="/player"
							state={{
								where: {
									from: { equals: dates.mlb.from },
									to: { equals: dates.mlb.to },
								},
							}}
						>
							Go
						</Link>
					</div>
				</div>
			</div>
			<div className="league-container">
				<h2>NFL</h2>
				<div className="content-container">
					<div className="links-container">
						<Link
							className="link"
							to="/player"
							state={{ league: "NFL" }}
						>
							Random
						</Link>
						<Link
							className="link"
							to="/player"
							state={{
								league: "NFL",
								where: { probowls: { gt: 3 } },
							}}
						>
							Pro Bowlers
						</Link>
						<Link
							className="link"
							to="/player"
							state={{
								league: "NFL",
								where: { hof: { equals: true } },
							}}
						>
							Hall of Famers
						</Link>
						<Link
							className="link"
							to="/player"
							state={{
								league: "NFL",
								where: { active: { equals: true } },
							}}
						>
							Active
						</Link>
					</div>
					<div className="years-container">
						<p>From</p>
						<input
							className="input-from"
							defaultValue={dates.nfl.from}
							onChange={(e) => {
								let temp = dates;
								temp.nfl.from = e;
								setDates(temp);
							}}
						></input>
						<p>To</p>
						<input
							className="input-to"
							defaultValue={dates.nfl.to}
							onChange={(e) => {
								let temp = dates;
								temp.nfl.to = e;
								setDates(temp);
							}}
						></input>
						<Link
							className="link"
							to="/player"
							state={{
								where: {
									from: { equals: dates.nfl.from },
									to: { equals: dates.nfl.to },
								},
							}}
						>
							Go
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
export default Frontpage;
