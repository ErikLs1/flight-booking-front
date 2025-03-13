import React, {useState, useEffect} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import api from "../api.js";
import SeatMap from "./SeatMap.jsx";
import "../css/SeatSelectionPage.css"

function SeatSelectionPage() {
    const { flightId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { passengers } = location.state || {passengers: []}
    const passengerCount = passengers.length;

    const [flightSeats, setFlightSeats] = useState([]);
    const [recommendedSeatIds, setRecommendedSeatIds] = useState([]);
    const [aircraftModel, setAircraftModel] = useState("");
    const [availableSeatClasses, setAvailableSeatClasses] = useState([])
    const [flightCities, setFlightCities] = useState(["", ""]);

    // Filters
    const [seatClassType, setSeatClassType] = useState("");
    const [windowPreferred, setWindowPreferred] = useState(false);
    const [aislePreferred, setAislePreferred] = useState(false);
    const [nearExitPreferred, setNearExitPreferred] = useState(false);
    const [extraLegRoomPreferred, setExtraLegRoomPreferred] = useState(false);
    const [adjacentPreferred, setAdjacentPreferred] = useState(false);

    const [selectedSeatIds, setSelectedSeatIds] = useState([]);

    const [assignments, setAssignments] = useState(Array(passengerCount).fill(null));

    const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);


    // Get all seats for the flight
    useEffect(() => {
        fetchAllSeatsForFlight();
        fetchAircraftModel();
        fetchSeatClasses();
        fetchFlightCities();
    }, [flightId]);

    const fetchAllSeatsForFlight = async () => {
        try {
            const response = await api.get(`/api/flightSeat/flight/${flightId}`);
            setFlightSeats(response.data);
        } catch (error) {
            console.error("Could not get flight seats: ", error);
        }
    };

    const fetchAircraftModel = async () => {
        try {
            const response = await api.get(`/api/flight/${flightId}/aircraft-model`);
            setAircraftModel(response.data);
        } catch (error) {
            console.error("Could not get aircraft model: ", error);
        }
    }

    const fetchSeatClasses = async () => {
        try {
            const response = await api.get(`/api/flight/${flightId}/seat-classes`);
            setAvailableSeatClasses(response.data);
        } catch (error) {
            console.error("Could not get seat classes: ", error);
        }

    }

    const fetchFlightCities = async () => {
        try {
            const response = await api.get(`/api/flight/${flightId}/cities`);
            setFlightCities(response.data);
        } catch (error) {
            console.error("Could not get cities: ", error);
        }
    }
    // Recommendation request
    const handleRecommendation = async () => {
        try {
            const requestBody = {
                flightId: parseInt(flightId),
                passengerCount: passengerCount,
                seatClassType: seatClassType || null,
                windowPreferred,
                aislePreferred,
                nearExitPreferred,
                extraLegRoomPreferred,
                adjacentPreferred
            };

            const response = await api.post("/api/seat/recommend", requestBody);
            const recommendedSeats = response.data;

            const recommendedSeatIds = recommendedSeats.map(seat => seat.seatId)
            setRecommendedSeatIds(recommendedSeatIds)
        } catch (error) {
            console.error("Failed to apply filters: ", error)
        }
    };

    const handleSeatClick = (seat) => {
        if (seat.isBooked) return;
        const isAssigned = assignments.some(
            (assignedId, idx) =>
                assignedId === seat.flightSeatId && idx !== currentPassengerIndex
        );

        if (isAssigned) {
            alert("This seat is already assigned t another passenger.")
            return;
        }

        const newAssignments = [...assignments];
        newAssignments[currentPassengerIndex] = seat.flightSeatId;
        setAssignments(newAssignments);
    }

   const handlePassengerSelect = (index) => {
        setCurrentPassengerIndex(index);
   }

    const handleNext = () => {
        if (assignments.some((seatId) => seatId === null)) {
            alert(`Please select seat for every passenger.`)
            return;
        }
        navigate(`/flight-summary/${flightId}`, {
            state: {flightId, passengers, assignments}
        });
    }

    return (
        <div className="seat-selection-container">
            <h2>{flightCities[0]} → {flightCities[1]}</h2>
            <div className="filters-container">
                <h3>Recommendation Filters</h3>
                <div className="filter-group">
                    <label>Seat class:</label>
                    <select value={seatClassType} onChange={(e) => setSeatClassType(e.target.value)}>
                        <option value="">Any</option>
                        {availableSeatClasses.map((seatClass) => (
                            <option key={seatClass} value={seatClass}>{seatClass.
                                toLowerCase()
                                .split('_')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ')}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={windowPreferred}
                            onChange={(e) => setWindowPreferred(e.target.checked)}
                        />
                        Window
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={aislePreferred}
                            onChange={(e) => setAislePreferred(e.target.checked)}
                        />
                        Aisle
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={extraLegRoomPreferred}
                            onChange={(e) => setExtraLegRoomPreferred(e.target.checked)}
                        />
                        Extra Legroom
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={nearExitPreferred}
                            onChange={(e) => setNearExitPreferred(e.target.checked)}
                        />
                        Near Exit
                    </label>
                </div>

                {passengerCount > 1 && (
                    <div className="filter-group">
                        <label>
                            <input
                                type="checkBox"
                                checked={adjacentPreferred}
                                onChange={(e) => setAdjacentPreferred(e.target.checked)}
                            />
                            Required Adjacent
                        </label>
                    </div>
                )}

                <button className="apply-filters-btn" onClick={handleRecommendation}>
                    Recommend Seats
                </button>
            </div>

            <div className="seat-selection-content">
                <div className="passenger-panel">
                    <h2>Passengers</h2>
                    {passengers.map((p, index) => {
                        const assignedSeatId = assignments[index];
                        const seatObj = flightSeats.find((s) => s.flightSeatId === assignedSeatId);
                        return (
                            <div key={index}
                                 className={`passenger-item ${index === currentPassengerIndex ? "active" : ""}`}
                                 onClick={() => handlePassengerSelect(index)}
                            >
                                <div className="passenger-name">
                                    {p.firstName} {p.lastName}
                                </div>
                                <div className="assigned-seat">
                                    {seatObj ? seatObj.seatNumber : "None"}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="seat-map-panel">
                    <SeatMap
                        seats={flightSeats.map(seat =>({
                            ...seat, recommended: recommendedSeatIds.includes(seat.seatId)
                        }))}
                        aircraftModel={aircraftModel}
                        onSeatClick={handleSeatClick}
                        assignedSeatIds={assignments.filter((id) => id !== null)}
                    />
                </div>
            </div>

            {/*<div className="seat-map-panel">*/}
            {/*    <SeatMap*/}
            {/*        seats={flightSeats.map(seat =>({*/}
            {/*            ...seat, recommended: recommendedSeatIds.includes(seat.seatId)*/}
            {/*        }))}*/}
            {/*        aircraftModel={aircraftModel}*/}
            {/*        onSeatClick={handleSeatClick}*/}
            {/*        assignedSeatIds={assignments.filter((id) => id !== null)}*/}
            {/*    />*/}
            {/*</div>*/}

            {/*<button className="next-btn" onClick={handleNext}>*/}
            {/*    Flight Summary*/}
            {/*</button>*/}
            <button className="next-btn" onClick={handleNext}>
                Flight Summary
            </button>
        </div>
    )
}

export default SeatSelectionPage;