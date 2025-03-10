import api from "../api.js";
import React, {useState, useEffect} from "react";
import '../css/FlightSearch.css';
import Select from "react-select";

function FlightSearch() {
    // States for field options
    const [airportOptions, setAirportOptions] = useState([]);
    const [airlineOptions, setAirlineOptions] = useState([]);

    // Flight results
    const [flights, setFlights] = useState([]);

    // Search fields
    const [departureCity, setDepartureCity] = useState(null);
    const [arrivalCity, setArrivalCity] = useState(null);
    const [airlineName, setAirlineName] = useState(null);
    const [maxPrice, setMaxPrice] = useState('');
    const [departureStartDate, setDepartureStartDate] = useState('');
    const [departureStartTime, setDepartureStartTime] = useState('');
    const [departureEndDate, setDepartureEndDate] = useState('');
    const [departureEndTime, setDepartureEndTime] = useState('');

    useEffect(() => {
        fetchAllFlights();
        fetchAllAirlines();
        fetchAirports();
    }, []);

    const fetchAirports = async () => {
        try {
            const response = await api.get("/api/airport")
            const options = response.data.map((airport) => ({
                value: airport.airportCity,
                label: airport.airportCity
            }));
            setAirportOptions(options);
        } catch (error) {
            console.error("Failed to fetch airports: ", error);
        }
    }

    const fetchAllAirlines = async () => {
        try {
            const response = await api.get("/api/airline")
            const options = response.data.map((airline) => ({
                value: airline.airlineName,
                label: airline.airlineName
            }));
            setAirlineOptions(options);
        } catch (error) {
            console.error("Failed to fetch airlines: ", error);
        }
    }

    const fetchAllFlights = async () => {
        try {
            const response = await api.get('/api/flight');
            setFlights(response.data);
        } catch (error) {
            console.error("Failed to fetch flights: ", error);
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault();

        // Combine start date/time
        let startDateTime = null;
        if (departureStartDate && departureStartTime) {
            startDateTime = `${departureStartDate}T${departureStartTime}:00`
        }

        let endDateTime = null;
        if (departureEndDate && departureEndTime) {
            endDateTime = `${departureEndDate}T${departureEndTime}:00`
        }

        const filterDTO = {
            departureCity: departureCity ? departureCity.value : null,
            arrivalCity: arrivalCity ? arrivalCity.value : null,
            airlineName: airlineName ? airlineName.value : null,
            maxPrice: maxPrice ? parseFloat(maxPrice) : null,
            departureStartTime: startDateTime,
            departureEndTime: endDateTime,
        }

        try {
            const response = await api.post("api/flight/filter", filterDTO);
            setFlights(response.data);
        } catch (error) {
            console.error("Failed to filter flights: ", error);
        }

    };

    return (
        <div className="flight-search-container">
            <div className="search-header">
                <h2>Start your journey</h2>
            </div>

            <form className="search-form" onSubmit={handleSearch}>
                <div className="form-row">
                    <label>From</label>
                    <Select
                        value={departureCity}
                        onChange={setDepartureCity}
                        options={airportOptions}
                        placeholder="Select city"
                        isClearable
                    />
                </div>
                <div className="form-row">
                    <label>To</label>
                    <Select
                        value={arrivalCity}
                        onChange={setArrivalCity}
                        options={airportOptions}
                        placeholder="Select city"
                        isClearable
                    />
                </div>
                <div className="form-row">
                    <label>Airline</label>
                    <Select
                        value={airlineName}
                        onChange={setAirlineName}
                        options={airlineOptions}
                        placeholder="Select airline"
                        isClearable
                    />
                </div>
                <div className="form-row">
                    <label>Max Price</label>
                    <input
                        type="number"
                        placeholder="300"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </div>
                <div className="form-row">
                    <label>Date Start</label>
                    <input
                        type="date"
                        value={departureStartDate}
                        onChange={(e) => setDepartureStartDate(e.target.value)}
                    />
                </div>
                <div className="form-row">
                    <label>Time start</label>
                    <input
                        type="time"
                        value={departureStartTime}
                        onChange={(e) => setDepartureStartTime(e.target.value)}
                    />
                </div>
                <div className="form-row">
                    <label>Date End</label>
                    <input
                        type="date"
                        value={departureEndDate}
                        onChange={(e) => setDepartureEndDate(e.target.value)}
                    />
                </div>
                <div className="form-row">
                    <label>Time End</label>
                    <input
                        type="time"
                        value={departureEndTime}
                        onChange={(e) => setDepartureEndTime(e.target.value)}
                    />
                </div>

                <button type="submit" className="search-btn">
                    Search
                </button>
            </form>

            <h3>Available Flights</h3>
            <table className="flight-table">
                <thead>
                <tr>
                    <th>Flight Number</th>
                    <th>Departure city</th>
                    <th>Arrival City</th>
                    <th>Airline Name</th>
                    <th>Departure Time</th>
                    <th>Arrival Time</th>
                    <th>Base Price</th>
                </tr>
                </thead>
                <tbody>
                {flights.map((flight) => (
                    <tr key={flight.flightId}>
                        <td>{flight.flightNumber}</td>
                        <td>{flight.departureCity}</td>
                        <td>{flight.arrivalCity}</td>
                        <td>{flight.airlineName}</td>
                        <td>{new Date(flight.departureTime).toLocaleString()}</td>
                        <td>{new Date(flight.arrivalTime).toLocaleString()}</td>
                        <td>{flight.basePrice}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default FlightSearch;