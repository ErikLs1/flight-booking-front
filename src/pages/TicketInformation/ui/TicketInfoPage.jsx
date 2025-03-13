import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api.js";
import "./styles/TicketInfoPage.css"

function TicketInfoPage() {
    const [email, setEmail] = useState("");
    const [ticketInfo, setTicketInfo] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await api.get(`/api/ticket/info?email=${email}`);
            if (response.data && response.data.length > 0) {
                setTicketInfo(response.data);
            } else {
                setTicketInfo([])
                setError("Could not find tickets for this email.")
            }
        } catch (er) {
            console.error("Could not get ticket info: ", err);
            setError("Could not get ticket info. Try again.")
        }
    }

    const handleReset = () => {
        setTicketInfo(null);
        setEmail("");
        setError("");
    };

    return (
        <div className="ticket-info-container">
            <h2>My Tickets</h2>
            {!ticketInfo && (
                <form onSubmit={handleSearch} className="ticket-search-form">
                    <label htmlFor="email">Enter your email to view your tickets:</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        placeholder="booking@example.com"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Search</button>
                    {error && <p className="error-message">{error}</p>}
                </form>
            )}
            {ticketInfo && (
                <div className="ticket-info-display">
                    {ticketInfo.length === 0 ? (
                        <p>No tickers found for this email</p>
                    ): (
                        ticketInfo.map((ticket) => (
                            <div key={ticket.ticketId} className="ticket-container">
                                {/* Ticket Info */}
                                <div className="ticket-info">
                                    <h3>Ticket Information</h3>
                                    <p><strong>Seat Number:</strong> {ticket.seatNumber}</p>
                                    <p><strong>Seat Class:</strong> {ticket.seatClass}</p>
                                    <p><strong>Ticket Price:</strong> ${ticket.ticketPrice}</p>
                                    <p><strong>Passenger:</strong> {ticket.person.firstName} {ticket.person.lastName}</p>
                                    <p><strong>Email:</strong> {ticket.person.email}</p>
                                    <p><strong>Phone:</strong> {ticket.person.phone}</p>
                                </div>

                                {/* Flight Info */}
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
                    <div className="ticket-info-buttons">
                        <button onClick={handleReset}>Search again</button>
                        <button onClick={() => navigate("/")}>Back to Flights</button>
                    </div>
                </div>
            )}
        </div>
    )

}

export default TicketInfoPage;