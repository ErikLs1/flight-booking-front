import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/CollectPassengerInfo.css"
import PassengerForm from "./PassengerForm.jsx";
import { validateName, validateEmail, validatePhone } from "../../../shared/utils/validation.js";

function CollectPassengerInfo() {
    const { flightId } = useParams();
    const navigate = useNavigate();

    // Store passengers
    const [passengers, setPassengers] = useState([
        {firstName: "", lastName: "", email: "", phone: ""},
    ])

    // handle input change if passenger decides to change something
    const handlePassengerChange = (index, field, value) => {
        const updatedPassengers = [...passengers];
        updatedPassengers[index][field] = value;
        setPassengers(updatedPassengers);
    };

    // Add new form
    const addPassenger = () => {
        setPassengers([
            ...passengers,
            {firstName: "", lastName: "", email: "", phone: ""}
        ]);
    }

    const removePassenger = (index) => {
        if (passengers.length > 1) {
            setPassengers(passengers.filter((_, i) => i !== index));
        }
    }

    // Pass passengers data to seat selection page
    const handleSubmit = (e) => {
        e.preventDefault()

        let valid = true;
        let errorMessage = "";

        passengers.forEach((passenger, index) => {
            if (!validateName(passenger.firstName)) {
                valid = false;
                errorMessage += `Passenger ${index + 1}: First name should contain only letters. \n`;
            }

            if (!validateName(passenger.lastName)) {
                valid = false;
                errorMessage += `Passenger ${index + 1}: Last name should contain only letters. \n`;
            }

            if (!validateEmail(passenger.email)) {
                valid = false;
                errorMessage += `Passenger ${index + 1}: Email is invalid. \n`
            }

            if (!validatePhone(passenger.phone)) {
                valid = false;
                errorMessage += `Passenger ${index + 1}: Phone number is invalid. \n`
            }
        });

        if (!valid) {
            alert(errorMessage)
            return;
        }

        navigate(`/seat-selection/${flightId}`, {
            state: {flightId, passengers}
        })

    };

    return (
        <div className="passenger-info-wrapper">
            <div className="passenger-info-container">
                <h2 className="passenger-info-title">Enter Passenger Information</h2>
                <form className="passenger-form-container" onSubmit={handleSubmit}>
                    {passengers.map((passenger, index) => (
                        <PassengerForm
                            key={index}
                            index={index}
                            passenger={passenger}
                            onChange={handlePassengerChange}
                            onRemove={removePassenger}
                            showRemoveButton={passengers.length > 1}
                        />
                    ))}
                    <div className="passenger-buttons-container">
                        <button type="button" className="add-btn" onClick={addPassenger}>
                            Add Passenger
                        </button>
                        <button type="submit" className="next-btn">
                            Choose Seats
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default CollectPassengerInfo;