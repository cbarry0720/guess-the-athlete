const express = require("express");
const cors = require("cors");
const players = require("./routes/players.js");
const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);

app.use("/players", players);

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
