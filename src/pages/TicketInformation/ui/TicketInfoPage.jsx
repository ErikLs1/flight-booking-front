import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { searchTickets } from "../api/TicketInfoApi.js";
import TicketList from "./TicketList.jsx";
import TicketSearch from "./TicketSearch.jsx";
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
            const response = await searchTickets(email);
            if (response.data && response.data.length > 0) {
                setTicketInfo(response.data);
            } else {
                setTicketInfo([])
                setError("Could not find tickets for this email.")
            }
        } catch (er) {
            console.error("Could not get ticket info: ", err);
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
                <TicketSearch
                    email={email}
                    setEmail={setEmail}
                    handleSearch={handleSearch}
                    error={error}
                />
            )}
            {ticketInfo && (
                <TicketList tickets={ticketInfo}/>
            )}
            {ticketInfo && (
                <div className="ticket-info-buttons">
                    <button onClick={handleReset}>Search again</button>
                    <button onClick={() => navigate("/")}>Back to Flights</button>
                </div>
            )}
        </div>
    )

}

export default TicketInfoPage;