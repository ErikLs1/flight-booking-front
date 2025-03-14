import api from "../../../api.js";

export async function searchTickets(email) {
    return api.get(`/api/ticket/info?email=${email}`)
}