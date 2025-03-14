import React from "react";
import "../ui/styles/FlightSummaryPage.css"

function PaymentSelection({ paymentMethods, selectedPaymentMethod, onChange }) {
    return (
        <div className="payment-selection">
            <select value={selectedPaymentMethod} onChange={onChange}>
                <option value="">Any</option>
                {paymentMethods.map((method) => (
                    <option key={method} value={method}>
                        {method.replace("_", " ")}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default PaymentSelection;