import React, {useState, useEffect} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../api.js";
import "../css/FlightSummaryPage.css"

function FlightSummaryPage() {
    const { flightId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { passengers, assignments } = location.state || { passengers: [], assignments: []}

    const [flight, setFlight] = useState(null);
    const [flightSeats, setFlightSeats] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

    useEffect(() => {
        fetchAllSeatsForFlight();
        fetchFlightData();
        fetchPaymentMethods();
    }, [flightId])

    const fetchAllSeatsForFlight = async () => {
        try {
            const response = await api.get(`/api/flightSeat/flight/${flightId}`);
            setFlightSeats(response.data);
        } catch (error) {
            console.error("Could not get flight seats: ", error);
        }
    };

    const fetchFlightData = async () => {
        try {
            const response = await api.get(`/api/flight/${flightId}`);
            setFlight(response.data);
        } catch (error) {
            console.error("Could not get flight data: ", error);
        }
    }

    const fetchPaymentMethods = async () => {
        try {
            const response = await api.get("/api/payment/methods")
            setPaymentMethods(response.data);
        } catch (error) {
            console.error("Could not get payment methods: ", error);
        }
    }

    // find needed seats
    const assignedSeats = assignments.map((seatId) =>
        flightSeats.find((seat) => seat.flightSeatId === seatId));

    // Get ticket price (error here)
    const getTicketPrice = (seat) => {
        if (!flight) return 0;
        const seatClass = flight.seatClasses.find(sc => sc.seatClassName === seat.seatClassName)
        const additionalFee = seatClass ? seatClass.baseFee : 0;
        return flight.basePrice + additionalFee;
    }

    // Get total price
    const totalPrice = assignedSeats.reduce(
        (sum, seat) => sum + (seat ? getTicketPrice(seat) : 0), 0
    );

    const handlePaymentMethodChange = (e) => {
        setSelectedPaymentMethod(e.target.value);
    }
    // Handle pay
    const handlePay = async () => {
        const bookingPayload = {
            flightId: parseInt(flightId),
            passengers: passengers,
            seatIds: assignments,
            paymentMethod: selectedPaymentMethod ? selectedPaymentMethod : "CREDIT_CARD"
        }

        try {
            await api.post("/api/booking", bookingPayload);
            navigate("/")
        } catch (error) {
            console.error("Booking failed: ", error);
            alert("Booking failed. Please try again")
        }
    };

    return (
        <div className="flight-summary-container">
            <h2>Flight summary</h2>
            {flight && (
                <div className="flight-info">
                    <p>
                        <strong>Flight Number:</strong> {flight.flightNumber}
                    </p>
                    <p>
                        <strong>Departure:</strong> {flight.departureCity} at{" "}
                        {new Date(flight.departureTime).toLocaleString()}
                    </p>
                    <p>
                        <strong>Arrival:</strong> {flight.arrivalCity} at{" "}
                        {new Date(flight.arrivalTime).toLocaleString()}
                    </p>
                </div>
            )}
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
            <div className="total-price">
                <h3>Total Price: ${totalPrice}</h3>
            </div>
            <div className="payment-selection">
                <select>
                    <option value="">Any</option>
                    {paymentMethods.map((method) => (
                        <option key={method} value={method}>
                            {method.replace("_", " ")}
                        </option>
                    ))}
                </select>
            </div>
            <button className="pay-btn" onClick={handlePay}>
                Pay
            </button>
        </div>
    )
}

export default FlightSummaryPage;