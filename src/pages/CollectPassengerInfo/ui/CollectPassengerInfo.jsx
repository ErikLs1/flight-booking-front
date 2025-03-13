import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/CollectPassengerInfo.css"

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

    // Validation check
    const validateEmail = (email) => {
        const emailRegex = /^\S+@\S+\.\S+$/;
        return emailRegex.test(email);
    }

    const validateName = (name) => {
        const nameRegex = /^[A-Za-z]+$/;
        return nameRegex.test(name);
    }

    const validatePhone = (phone) => {
        const phoneRegex = /^\+\d+$/;
        return phoneRegex.test(phone);
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
                        <div key={index} className="passenger-form">
                            <h3>Passenger {index + 1}</h3>
                            <div className="form-row">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    value={passenger.firstName}
                                    onChange={(e) => handlePassengerChange(index, "firstName", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    value={passenger.lastName}
                                    onChange={(e) => handlePassengerChange(index, "lastName", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <label>Email</label>
                                <input
                                    type="text"
                                    value={passenger.email}
                                    onChange={(e) => handlePassengerChange(index, "email", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    value={passenger.phone}
                                    onChange={(e) => handlePassengerChange(index, "phone", e.target.value)}
                                    required
                                />
                            </div>
                            <p>&nbsp;</p>
                            {passengers.length > 1 && (
                                <button type="button" className="remove-btn" onClick={() => removePassenger(index)}>
                                    <strong>Remove</strong>
                                </button>
                            )}
                        </div>
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