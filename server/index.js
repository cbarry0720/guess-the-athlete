const express = require("express");
const nbaplayers = require('./routes/nbaplayers.js')
const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());

app.use("/nbaplayers", nbaplayers);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});