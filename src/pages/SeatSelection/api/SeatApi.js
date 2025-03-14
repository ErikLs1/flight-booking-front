import api from "../../../api.js";

export async function fetchAllSeatsForFlight(flightId) {
    return api.get(`/api/flightSeat/flight/${flightId}`)
}

export async function fetchAircraftModel(flightId) {
    return api.get(`/api/flight/${flightId}/aircraft-model`)
}

export async function fetchSeatClasses(flightId){
    return api.get(`/api/flight/${flightId}/seat-classes`)
}

export async function fetchFlightCities(flightId) {
    return api.get(`/api/flight/${flightId}/cities`)
}

export async function recommendSeats(requestBody) {
    return api.post("/api/seat/recommend", requestBody)
}