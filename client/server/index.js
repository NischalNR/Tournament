const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/tournament-tracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const tournamentSchema = new mongoose.Schema({
  slNo: Number,
  tournamentName: String,
  startDate: String,
  endDate: String,
  playerList: String,
});

const Tournament = mongoose.model("Tournament", tournamentSchema);

app.get("/tournaments", async (req, res) => {
  const tournaments = await Tournament.find();
  res.json(tournaments);
});

app.post("/tournaments", async (req, res) => {
  const newTournament = new Tournament(req.body);
  await newTournament.save();
  res.json(newTournament);
});

app.put("/tournaments/:id", async (req, res) => {
  const tournamentId = req.params.id;
  const updatedTournament = req.body;
  await Tournament.findByIdAndUpdate(tournamentId, updatedTournament);
  res.json(updatedTournament);
});

app.delete("/tournaments/:id", async (req, res) => {
  const tournamentId = req.params.id;
  await Tournament.findByIdAndDelete(tournamentId);
  res.json({ message: `Tournament ${tournamentId} deleted` });
});

app.get("/tournaments/:tournamentId/status", (req, res) => {
  const { tournamentId } = req.params;
  const tournament = getTaskById(tournamentId);
  if (!tournament) {
    return res.status(404).json({ error: "Tournament not found" });
  }

  app.get("/tournaments", (req, res) => {
    const searchTerm = req.query.searchTerm.toLowerCase();
    const searchFilter = req.query.searchFilter.toLowerCase();
    const filteredTournament = tournaments.filter((tournament) =>
      tournament[searchFilter].toLowerCase().includes(searchTerm)
    );
    res.json(filteredTournament);
  });
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
