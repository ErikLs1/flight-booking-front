import React from "react";
import "../ui/styles/TicketInfoPage.css"

function TicketSearch({ email, setEmail, handleSearch, error}) {
    return (
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
    );
}

export default TicketSearch;