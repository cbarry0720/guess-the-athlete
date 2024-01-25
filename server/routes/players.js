const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { spawn, exec } = require("child_process");
const cors = require("cors");
const express = require("express");
const router = express.Router();
const fs = require("fs");

router.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);

router.get("/table", async function (req, res) {
	const link = req.query.link;
	const position = req.query.position;
	const split = link.split("/");
	var formattedLink = "https://widgets.sports-reference.com/wg.fcgi?css=1";
	if (link.includes("basketball")) {
		formattedLink += "&site=bbr&div=div_per_game&url=";
		for (let i = 3; i < split.length; ++i) {
			formattedLink += "%2F";
			formattedLink += split[i];
		}
	} else if (link.includes("baseball")) {
		formattedLink += "&site=br&url=";
		for (let i = 3; i < split.length; ++i) {
			formattedLink += "%2F";
			formattedLink += split[i];
		}
		formattedLink +=
			position == "Pitcher"
				? "&div=div_pitching_standard"
				: "&div=div_batting_standard";
	} else if (link.includes("football")) {
	}
	console.log(formattedLink);
	var command = spawn("python", [
		"routes/scraping.py",
		"table",
		formattedLink,
	]);
	command.on("close", () => {
		string = fs.readFileSync("html.txt", { encoding: "utf8", flag: "r" });
		res.status(200).send(string);
	});
});

router.get("/update", async function (req, res) {
	if (
		req.body.league == "nba" ||
		req.body.league == "mlb" ||
		req.body.league == "nfl"
	) {
		const python = spawn("python", ["scraping.py", req.body.league]);
		python.on("error", () => res.status("400").send("INTERNAL ERROR"));
		python.on("close", () => res.send("Done updating!"));
	} else {
		res.status(400).send("ERROR");
	}
});

router.post("/random", async function (req, res) {
	const where = req.body.where || {};
	console.log(where);
	if (req.body.modern) {
		if (req.body.league == "MLB") {
			Object.assign(where, {
				from: {
					gte: 1970,
				},
				league: "MLB",
			});
			const size = await prisma.athletes_joined_mlb_players.count({
				where,
			});
			const random = Math.floor(Math.random() * size);
			const player = await prisma.athletes_joined_mlb_players.findFirst({
				where,
				skip: random,
				take: 1,
			});
			const athlete = {
				id: Number(player.id),
				name: player.name,
				link: player.link,
				league: player.league,
				image: player.image,
				from: player.from,
				to: player.to,
				active: player.active,
				hof: player.hof,
			};
			const data = {
				athlete_id: Number(player.athlete_id),
				war: player.war,
				allstars: player.allstars,
				cyyoungs: player.cyyoungs,
				mvps: player.mvps,
				ggs: player.ggs,
				ss: player.ss,
				position: player.position,
			};
			res.json(Object.assign(athlete, data));
			return;
		}
	}
	let data = {};
	if (req.body.league == undefined) {
	} else if (req.body.league == "NBA") {
		let size = await prisma.athletes_joined_nba_players.count({
			where: where,
		});
		let random = Math.floor(Math.random() * size);
		data = await prisma.athletes_joined_nba_players.findFirst({
			skip: random,
			take: 1,
			where: where,
		});
	} else if (req.body.league == "MLB") {
		let size = await prisma.athletes_joined_mlb_players.count({
			where: where,
		});
		let random = Math.floor(Math.random() * size);
		data = await prisma.athletes_joined_mlb_players.findFirst({
			skip: random,
			take: 1,
			where: where,
		});
	} else {
		let size = await prisma.nfl_players.count({ where: where });
		let random = Math.floor(Math.random() * size);
		data = await prisma.nfl_players.findFirst({
			skip: random,
			take: 1,
			where: where,
		});
	}
	data.id = Number(data.id);
	data.athlete_id = Number(data.athlete_id);
	res.json(data);
});

router.get("/search", async function (req, res) {
	const name = req.query.name;
	if (name == undefined || name == null) {
		res.status(400).send("ERROR: Name not provided");
		return;
	}
	if (name.length < 3) {
		res.status(200).json({});
		return;
	}
	const athletes = await prisma.aTHLETES.findMany({
		where: {
			name: { contains: name, mode: "insensitive" },
		},
		take: 10,
	});
	for (let i = 0; i < athletes.length; ++i) {
		athletes[i].id = Number(athletes[i].id);
	}
	let unique = [];
	for (let i = 0; i < athletes.length; i++) {
		let athlete = athletes[i];
		let found = false;
		for (let j = 0; j < unique.length; j++) {
			if (unique[j].id == athlete.id) {
				found = true;
			}
		}
		if (!found) {
			unique.push(athlete);
		}
	}
	res.json({ athletes: unique });
});

module.exports = router;
