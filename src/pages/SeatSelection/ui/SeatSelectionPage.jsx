import React, {useState, useEffect} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import { fetchAllSeatsForFlight, fetchAircraftModel, fetchSeatClasses, fetchFlightCities, recommendSeats} from "../api/SeatApi.js";
import SeatMap from "./SeatMap.jsx";
import SeatFilterComponent from "./SeatFilterComponent.jsx";
import PassengerComponent from "./PassengerComponent.jsx";
import "./styles/SeatSelectionPage.css"

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

    // Seat assignments
    const [assignments, setAssignments] = useState(Array(passengerCount).fill(null));
    const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);
    const assignedSeats = assignments.filter((id) => id !== null)


    // Get all seats for the flight
    useEffect(() => {
        getSeats();
        getAircraftModel();
        getSeatClasses();
        getFlightCities();
    }, [flightId]);

    const getSeats = async () => {
        try {
            const response = await fetchAllSeatsForFlight(flightId);
            setFlightSeats(response.data);
        } catch (error) {
            console.error("Could not get flight seats: ", error);
        }
    };

    const getAircraftModel = async () => {
        try {
            const response = await fetchAircraftModel(flightId);
            setAircraftModel(response.data);
        } catch (error) {
            console.error("Could not get aircraft model: ", error);
        }
    }

    const getSeatClasses = async () => {
        try {
            const response = await fetchSeatClasses(flightId);
            setAvailableSeatClasses(response.data);
        } catch (error) {
            console.error("Could not get seat classes: ", error);
        }

    }

    const getFlightCities = async () => {
        try {
            const response = await fetchFlightCities(flightId);
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

            const response = await recommendSeats(requestBody);
            const recommendedSeats = response.data;
            const recommendedSeatIds = recommendedSeats.map((seat) => seat.seatId)
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

    const recommendedSeats = flightSeats.map(seat => ({
        ...seat,
        recommended: recommendedSeatIds.includes(seat.seatId)
    }));

    return (
        <div className="seat-selection-container">
            <h2>{flightCities[0]} → {flightCities[1]}</h2>
            <SeatFilterComponent
                seatClassType={seatClassType}
                setSeatClassType={setSeatClassType}
                windowPreferred={windowPreferred}
                setWindowPreferred={setWindowPreferred}
                aislePreferred={aislePreferred}
                setAislePreferred={setAislePreferred}
                nearExitPreferred={nearExitPreferred}
                setNearExitPreferred={setNearExitPreferred}
                extraLegRoomPreferred={extraLegRoomPreferred}
                setExtraLegRoomPreferred={setExtraLegRoomPreferred}
                adjacentPreferred={adjacentPreferred}
                setAdjacentPreferred={setAdjacentPreferred}
                passengerCount={passengerCount}
                onRecommend={handleRecommendation}
                availableSeatClasses={availableSeatClasses}
            />

            <div className="seat-selection-content">
                <PassengerComponent
                    passengers={passengers}
                    assignments={assignments}
                    currentPassengerIndex={currentPassengerIndex}
                    onPassengerSelect={handlePassengerSelect}
                    flightSeats={flightSeats}
                />
                <div className="seat-map-panel">
                    <SeatMap
                        seats={recommendedSeats}
                        aircraftModel={aircraftModel}
                        onSeatClick={handleSeatClick}
                        assignedSeatIds={assignedSeats}
                    />
                </div>
            </div>
            <button className="next-btn" onClick={handleNext}>
                Flight Summary
            </button>
        </div>
    )
}

export default SeatSelectionPage;