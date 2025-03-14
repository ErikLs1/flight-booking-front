import React, {useState, useEffect} from "react";
import './styles/FlightSearch.css';
import Select from "react-select";
import {useNavigate} from "react-router-dom";
import {fetchFlights, fetchAirports, fetchAirlines, filterFlights} from "../api/FlightApi.js";

function FlightSearch() {
    // States for field options
    const [airportOptions, setAirportOptions] = useState([]);
    const [airlineOptions, setAirlineOptions] = useState([]);
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

    const navigate = useNavigate();

    useEffect(() => {
        getAirports();
        getAirlines();
        getAllFlights();
    }, []);

    const getAirports = async () => {
        try {
            const response = await fetchAirports();
            const options = response.data.map((airport) => ({
                value: airport.airportCity,
                label: airport.airportCity
            }));
            setAirportOptions(options);
        } catch (error) {
            console.error("Failed to fetch airports: ", error);
        }
    }

    const getAirlines = async () => {
        try {
            const response = await fetchAirlines();
            const options = response.data.map((airline) => ({
                value: airline.airlineName,
                label: airline.airlineName
            }));
            setAirlineOptions(options);
        } catch (error) {
            console.error("Failed to fetch airlines: ", error);
        }
    }

    const getAllFlights = async () => {
        try {
            const response = await fetchFlights()
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

        const maxPriceValue = maxPrice && maxPrice !== "" ? parseFloat(maxPrice) : null;

        const filterDTO = {
            departureCity: departureCity ? departureCity.value : null,
            arrivalCity: arrivalCity ? arrivalCity.value : null,
            airlineName: airlineName ? airlineName.value : null,
            maxPrice: maxPriceValue,
            departureStartTime: startDateTime,
            departureEndTime: endDateTime,
        }
        try {
            const response = await filterFlights(filterDTO);
            setFlights(response.data);
        } catch (error) {
            console.error("Failed to filter flights: ", error);
        }

    };

    return (
        <div className="flight-search-wrapper">
            <div className="filter-container">
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
                            maxMenuHeight={200}
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
                            maxMenuHeight={200}
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
                            maxMenuHeight={200}
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
            </div>

            <div className="flight-container">
                {flights.map((flight) => (
                    <div key={flight.flightId} className="flight-card">
                        <h3>{flight.flightNumber}</h3>
                        <p className="route">
                            {flight.departureCity} → {flight.arrivalCity}
                        </p>
                        <p>
                            <strong>Airline:</strong> {flight.airlineName}
                        </p>
                        <p>
                            <strong>Departure:</strong>{"  "}
                            {new Date(flight.departureTime).toLocaleString()}
                        </p>
                        <p>
                            <strong>Arrival:</strong>{"  "}
                            {new Date(flight.arrivalTime).toLocaleString()}
                        </p>
                        <div className="seat-class-prices">
                            {flight.seatClasses.map((sc) => (
                                <div key={sc.seatClassName} className="seat-price">
                                    <span className="seat-class">{sc.seatClassName}</span>: {" "}
                                    <span className="price">
                                        ${(flight.basePrice + sc.baseFee)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <button className="book-btn" onClick={() => navigate(`/passengers-info/${flight.flightId}`)}>
                            Book
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FlightSearch;