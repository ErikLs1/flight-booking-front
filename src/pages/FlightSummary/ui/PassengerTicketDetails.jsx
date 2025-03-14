import React from "react";
import "../ui/styles/FlightSummaryPage.css"

function PassengerTicketDetails({ passengers, assignedSeats, getTicketPrice }) {
    return (
        <div>
            <h2>Passenger Ticket Details</h2>
            <table className="summary-table">
                <thead>
                <tr>
                    <th>Passenger</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Seat Number</th>
                    <th>Ticket Price</th>
                </tr>
                </thead>
                <tbody>
                {passengers.map((p, index) => {
                    const seat = assignedSeats[index];
                    return (
                        <tr key={index}>
                            <td>{p.firstName} {p.lastName}</td>
                            <td>{p.email}</td>
                            <td>{p.phone}</td>
                            <td>{seat ? seat.seatNumber : "None"}</td>
                            <td>${seat ? getTicketPrice(seat) : "0.00"}</td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
}

export default PassengerTicketDetails;