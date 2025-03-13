import api from "../../../api.js";

export async function fetchAirports() {
    return api.get("/api/airport");
}

export async function fetchAirlines() {
    return api.get("/api/airline");
}

export async function fetchFlights() {
    return api.get("/api/flight");
}

export async function filterFlights(filterDTO) {
    return api.post("/api/flight/filter", filterDTO);
}