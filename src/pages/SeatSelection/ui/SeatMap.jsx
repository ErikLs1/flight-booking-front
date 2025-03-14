import React from "react";
import "./styles/SeatMap.css";

function groupSeatsByRow(seats) {
    const map = {};
    seats.forEach((seat) => {
        const row = seat.rowNumber;
        if (!map[row]) {
            map[row] = [];
        }
        map[row].push(seat);
    });
    return map;
}

function SeatMap({seats, aircraftModel, onSeatClick, assignedSeatIds = []}) {
    let setLetters = [];
    if (aircraftModel === "Airbus A320" ||
        aircraftModel === "Airbus A321" ||
        aircraftModel === "Airbus A322")
    {
        setLetters = ["A", "B", "C","", "D", "E", "F"];
    } else if (
        aircraftModel === "Embraer 190"||
        aircraftModel === "Embraer 191" ||
        aircraftModel === "Embraer 192")
    {
        setLetters = ["A", "B", "", "C", "D"];
    }

    const seatsByRow = groupSeatsByRow(seats);

    const sortedRows = Object.keys(seatsByRow)
        .map((r) => parseInt(r, 10))
        .sort((a, b) => a - b);

    const handleClick = (seat) => {
        if (seat.isBooked) return;
        onSeatClick(seat);
    }

    return (
        <div className="seatmap-container">
            {sortedRows.map((rowNumber) => {
                const rowSeats = seatsByRow[rowNumber];
                return(
                    <div className="seatmap-row" key={rowNumber}>
                        <div className="row-lable">{rowNumber}</div>
                        <div className="seat-row-block">
                            {setLetters.map((letter, index) => {
                                if (letter === "") {
                                    return (
                                        <div className="aisle-block" key={`aisle-${index}`}/>
                                    )
                                }

                                const seatObj = rowSeats.find((s) => s.seatLetter === letter);
                                if (!seatObj) {
                                    return (
                                        <div className="seat-block empty" key={`empty-${rowNumber}-${letter}`}>
                                        </div>
                                    )
                                }

                                const classes = [
                                    "seat-block",
                                    seatObj.isBooked ? "booked" : "",
                                    seatObj.recommended ? "recommended" : "",
                                    assignedSeatIds.includes(seatObj.flightSeatId) ? "selected" : ""
                                ]
                                    .filter(Boolean)
                                    .join(" ");

                                return (
                                    <div className={classes}
                                         key={seatObj.flightSeatId}
                                         onClick={() => handleClick(seatObj)}
                                    >
                                        {letter}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default SeatMap;
