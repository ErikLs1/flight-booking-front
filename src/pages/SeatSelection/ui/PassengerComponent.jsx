import React from "react";
import "../ui/styles/SeatSelectionPage.css"

function PassengerComponent({
                                passengers,
                                assignments,
                                currentPassengerIndex,
                                onPassengerSelect,
                                flightSeats
                            }) {
    return (
        <div className="passenger-panel">
            <h2>Passengers</h2>
            {passengers.map((p, index) => {
                const assignedSeatId = assignments[index];
                const seatObj = flightSeats.find((s) => s.flightSeatId === assignedSeatId);
                return (
                    <div key={index}
                         className={`passenger-item ${index === currentPassengerIndex ? "active" : ""}`}
                         onClick={() => onPassengerSelect(index)}
                    >
                        <div className="passenger-name">
                            {p.firstName} {p.lastName}
                        </div>
                        <div className="assigned-seat">
                            {seatObj ? seatObj.seatNumber : "Choose Seat"}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default PassengerComponent;