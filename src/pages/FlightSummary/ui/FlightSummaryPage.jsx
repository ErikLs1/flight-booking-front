import React, {useState, useEffect} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchAllSeatsForFlight, fetchFlightData, fetchPaymentMethods, handleBooking } from "../api/FlightSummaryApi.js";
import FlightInfo from "./FlightInfo.jsx";
import PassengerTicketDetails from "./PassengerTicketDetails.jsx";
import PaymentSelection from "./PaymentSelection.jsx";
import "./styles/FlightSummaryPage.css"

function FlightSummaryPage() {
    const { flightId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Passengers and seats from the state
    const { passengers, assignments } = location.state || { passengers: [], assignments: []}

    const [flight, setFlight] = useState(null);
    const [flightSeats, setFlightSeats] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

    useEffect(() => {
        getAllSeatsForFlight();
        getFlightData();
        getPaymentMethods();
    }, [flightId])

    const getAllSeatsForFlight = async () => {
        try {
            const response = await fetchAllSeatsForFlight(flightId);
            setFlightSeats(response.data);
        } catch (error) {
            console.error("Could not get flight seats: ", error);
        }
    };

    const getFlightData = async () => {
        try {
            const response = await fetchFlightData(flightId);
            setFlight(response.data);
        } catch (error) {
            console.error("Could not get flight data: ", error);
        }
    }

    const getPaymentMethods = async () => {
        try {
            const response = await fetchPaymentMethods();
            setPaymentMethods(response.data);
        } catch (error) {
            console.error("Could not get payment methods: ", error);
        }
    }

    // find needed seats
    const assignedSeats = assignments.map((seatId) =>
        flightSeats.find((seat) => seat.flightSeatId === seatId));

    // Get ticket price
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
        const bookingRequest = {
            flightId: parseInt(flightId),
            passengers: passengers,
            seatIds: assignments,
            paymentMethod: selectedPaymentMethod ? selectedPaymentMethod : "CREDIT_CARD"
        }

        try {
            await handleBooking(bookingRequest);
            navigate("/")
        } catch (error) {
            console.error("Booking failed: ", error);
            alert("Booking failed. Please try again")
        }
    };

    return (
        <div className="flight-summary-container">
            <h2>Flight summary</h2>
            <FlightInfo flight={flight}/>
            <PassengerTicketDetails
                passengers={passengers}
                assignedSeats={assignedSeats}
                getTicketPrice={getTicketPrice}
            />
            <div className="total-price">
                <h3>Total Price: ${totalPrice}</h3>
            </div>
            <PaymentSelection
                paymentMethods={paymentMethods}
                selectedPaymentMethod={selectedPaymentMethod}
                onChange={handlePaymentMethodChange}
            />
            <button className="pay-btn" onClick={handlePay}>
                Pay
            </button>
        </div>
    )
}

export default FlightSummaryPage;