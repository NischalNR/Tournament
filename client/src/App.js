import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App({ onDelete }) {
  const [tournaments, setTournaments] = useState([]);
  const [tournamentName, setTournamentName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [playerList, setPlayerList] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showTournamentEdit, setShowTournamentEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleClick = (_id) => {
    setShowTournamentEdit(true);
    setTournamentName(tournaments[_id].tournamentName);
    setStartDate(tournaments[_id].startDate);
    setEndDate(tournaments[_id].endDate);
    setPlayerList(tournaments[_id].playerList);
  };

  const showToastAddMessage = () => {
    toast.success("Tournament add Successfully", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const showToastEditMessage = () => {
    toast.success("Tournament Edit Successfully", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const getStatus = (startDate, endDate) => {
    const currentDate = new Date();
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);

    if (currentDate < sDate) {
      return "Not yet";
    } else if (currentDate >= sDate && currentDate <= eDate) {
      return "In progress";
    } else {
      return "Completed";
    }
  };

  function handleTournamentNameChange(event) {
    setTournamentName(event.target.value);
    //console.log(tournamentName);
  }

  function handleStartDateChange(event) {
    setStartDate(event.target.value);
    //console.log(startDate);
  }

  function handleEndDateChange(event) {
    setEndDate(event.target.value);
    //console.log(endDate);
  }

  function handlePlayerListChange(event) {
    setPlayerList(event.target.value);
    //console.log(playerList);
  }

  let handleUpdate = async (e) => {
    e.preventDefault();
    let payload = { tournamentName };
    await axios.put(`http://localhost:5000/tournaments/`, payload);
  };

  const handleDelete = (tournamentId) => {
    axios
      .delete(`http://localhost:5000/tournaments/${tournamentId}`)
      .then(() => {
        setTournaments(
          tournaments.filter((tournament) => tournament._id !== tournamentId)
        );
      });
  };

  function handleSubmit(event) {
    event.preventDefault();
    if (tournamentName.trim() === "") {
      return;
    }
    const tournamentData = {
      tournamentName: tournamentName,
      startDate: startDate,
      endDate: endDate,
      playerList: playerList,
    };
    axios
      .post("http://localhost:5000/tournaments", tournamentData)
      .then((response) => {
        console.log("Tournament added:", response.data);
        setTournaments([...tournaments, response.data]);
        setTournamentName("");
        setStartDate("");
        setEndDate("");
        setPlayerList("");
      })
      .catch((error) => {
        console.error("Error adding Tournament:", error);
      });
    console.log(tournamentData);
    window.location.assign("#");
  }

  useEffect(() => {
    const getTournaments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/tournaments");
        setTournaments(res.data);
      } catch (err) {
        console.error(err.message);
      }
    };

    getTournaments();
  }, []);

  const PerPage = 10;
  const indexOfLastRecord = currentPage * PerPage;
  const indexOfFirstRecord = indexOfLastRecord - PerPage;
  const currentTournaments = tournaments.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handlePrevClick = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextClick = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleSearch = (event) => {
    const filteredTournaments = tournaments.filter((tournament) =>
      tournament.tournamentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setTournaments(filteredTournaments);
  };

  return (
    <>
      <h1 id="heading">TOURNAMENT TRACKER</h1>
      <form onSubmit={handleSubmit}>
        <div className="firstdiv">
          <label className="label">
            Tournament Name :
            <input
              placeholder="Tournament Name"
              className="felid"
              type="text"
              value={tournamentName}
              onChange={handleTournamentNameChange}
            />
          </label>
          <label className="label">
            PlayerList :
            <input
              className="felid"
              placeholder="Player list"
              type="number"
              value={playerList}
              onChange={handlePlayerListChange}
            />
          </label>
        </div>
        <br />
        <div className="seconddiv">
          <label className="label2">
            Start Date :
            <input
              className="felid"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
            />
          </label>
          <label className="label2">
            End Date :
            <input
              className="felid"
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </label>
        </div>
        <br />
        <br />
        <div className="add">
          <button
            className="addbutton"
            type="submit"
            onClick={showToastAddMessage}
          >
            <b>Add</b>
          </button>
          <button
            className="updatebutton"
            type="submit"
            onClick={showToastEditMessage}
            onChange={handleUpdate}
          >
            <b>Update</b>
          </button>
          <ToastContainer />
        </div>
        <br />
        <div className="searchbox">
          <label>
            Search :
            <input
              className="felid"
              type="text"
              placeholder="Search Tournaments"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
          <button className="filter" onClick={handleSearch}>
            <b>Filter</b>
          </button>
        </div>
      </form>
      <div className="table">
        <table className="lookup">
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Tournament Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>PlayerList</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentTournaments.map((tournament, index) => (
              <tr key={tournament._id}>
                <td>{index + 1} </td>
                <td>{tournament.tournamentName}</td>
                <td>{tournament.startDate}</td>
                <td>{tournament.endDate}</td>
                <td>{tournament.playerList}</td>
                <td>
                  <p> {getStatus(tournament.startDate, tournament.endDate)}</p>
                </td>
                <td>
                  {getStatus(tournament.startDate, tournament.endDate) ===
                    "Not yet" && (
                    <div className="action">
                      <button
                        className="editbutton"
                        onClick={() => {
                          handleClick(index);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="deletebutton"
                        onClick={() => {
                          let result = prompt(
                            `Are you sure you want to delete the ${tournament.tournamentName}?`
                          );
                          if (result === "yes") {
                            handleDelete(tournament._id);
                            toast.error("Tournament Delete Successfully");
                          } else {
                            window.alert("OK thank you Resume!");
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  {getStatus(tournament.startDate, tournament.endDate) ===
                    "In progress" && (
                    <div>
                      <button
                        className="deletebutton"
                        onClick={() => {
                          let result = prompt(
                            `Are you sure you want to delete the ${tournament.tournamentName}?`
                          );
                          if (result === "yes") {
                            handleDelete(tournament._id);
                            toast.error("DELETED");
                          } else {
                            window.alert("OK thank you Resume!");
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  {getStatus(tournament.startDate, tournament.endDate) ===
                    "Completed" && <div></div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div />
        <div className="pagebuttons">
          <button
            className="prevbutton"
            onClick={handlePrevClick}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <button
            className="nextbutton"
            onClick={handleNextClick}
            disabled={indexOfLastRecord >= tournaments.length}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
