import React from "react";

function PassengerForm({index, passenger, onChange, onRemove, showRemoveButton}) {
    const handleChange = (field, value) => {
        onChange(index,field, value);
    }

    return (
        <div key={index} className="passenger-form">
            <h3>Passenger {index + 1}</h3>
            <div className="form-row">
                <label>First Name</label>
                <input
                    type="text"
                    value={passenger.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    required
                />
            </div>
            <div className="form-row">
                <label>Last Name</label>
                <input
                    type="text"
                    value={passenger.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    required
                />
            </div>
            <div className="form-row">
                <label>Email</label>
                <input
                    type="text"
                    value={passenger.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                />
            </div>
            <div className="form-row">
                <label>Phone</label>
                <input
                    type="text"
                    value={passenger.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                />
            </div>
            <p>&nbsp;</p>
            {showRemoveButton && (
                <button type="button" className="remove-btn" onClick={() => onRemove(index)}>
                    <strong>Remove</strong>
                </button>
            )}
        </div>
    );
}

export default PassengerForm;