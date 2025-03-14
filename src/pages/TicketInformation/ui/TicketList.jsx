import React from "react";
import "../ui/styles/TicketInfoPage.css"

function TicketList( {tickets}) {
    return (
        <div className="ticket-info-display">
            {tickets.length === 0 ? (
                <p>No tickers found for this email</p>
            ): (
                tickets.map((ticket) => (
                    <div key={ticket.ticketId} className="ticket-container">
                        <div className="ticket-info">
                            <h3>Ticket Information</h3>
                            <p><strong>Seat Number:</strong> {ticket.seatNumber}</p>
                            <p><strong>Seat Class:</strong> {ticket.seatClass}</p>
                            <p><strong>Ticket Price:</strong> ${ticket.ticketPrice}</p>
                            <p><strong>Passenger:</strong> {ticket.person.firstName} {ticket.person.lastName}</p>
                            <p><strong>Email:</strong> {ticket.person.email}</p>
                            <p><strong>Phone:</strong> {ticket.person.phone}</p>
                        </div>

                        <div className="flight-info">
                            <h3>Flight Details</h3>
                            <p>
                                <strong>Flight Number:</strong> {ticket.flight.flightNumber}
                            </p>
                            <p>
                                <strong>From:</strong> {" "} {ticket.flight.departureCity}, {ticket.flight.departureCountry}
                            </p>
                            <p>
                                <strong>Departure Time:</strong> {" "} {new Date(ticket.flight.departureTime).toLocaleString()}
                            </p>
                            <p>
                                <strong>To:</strong> {" "} {ticket.flight.arrivalCity}, {ticket.flight.arrivalCountry}
                            </p>
                            <p>
                                <strong>Arrival Time:</strong> {" "} {new Date(ticket.flight.arrivalTime).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default TicketList;