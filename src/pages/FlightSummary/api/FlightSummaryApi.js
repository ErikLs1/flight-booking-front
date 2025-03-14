import api from "../../../api.js";

export async function fetchAllSeatsForFlight(flightId) {
    return api.get(`/api/flightSeat/flight/${flightId}`);
}

export async function fetchFlightData(flightId) {
    return api.get(`/api/flight/${flightId}`);
}

export async function fetchPaymentMethods() {
    return api.get("/api/payment/methods");
}

export async function handleBooking(bookingRequest) {
    return api.post("/api/booking", bookingRequest);
}