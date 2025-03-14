import React from "react";
import "../ui/styles/FlightSummaryPage.css"

function FlightInfo({ flight }) {
    if (!flight) return null;

    return (
        <div className="flight-info">
            <p>
                <strong>Flight Number:</strong>
                {" "} {flight.flightNumber}
            </p>
            <p>
                <strong>Airline Name:</strong>
                {" "} {flight.airlineName}
            </p>
            <p>
                <strong>Departure City:</strong>
                {" "} {flight.departureCity}
            </p>
            <p>
                <strong>Departure Time:</strong>
                {" "} {new Date(flight.departureTime).toLocaleString()}
            </p>
            <p>
                <strong>Arrival City:</strong>
                {" "} {flight.arrivalCity}
            </p>
            <p>
                <strong>Arrival Time:</strong>
                {" "} {new Date(flight.arrivalTime).toLocaleString()}
            </p>
        </div>
    );
}

export default FlightInfo;