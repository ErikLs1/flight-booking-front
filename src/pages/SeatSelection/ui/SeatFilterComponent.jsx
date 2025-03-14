import React from "react";
import "../ui/styles/SeatSelectionPage.css"

function SeatFilterComponent({
                                 seatClassType,
                                 setSeatClassType,
                                 windowPreferred,
                                 setWindowPreferred,
                                 aislePreferred,
                                 setAislePreferred,
                                 nearExitPreferred,
                                 setNearExitPreferred,
                                 extraLegRoomPreferred,
                                 setExtraLegRoomPreferred,
                                 adjacentPreferred,
                                 setAdjacentPreferred,
                                 passengerCount,
                                 onRecommend,
                                 availableSeatClasses
                             }) {

    return (
            <div className="filters-container">
                <h3>Recommendation Filters</h3>
                <div className="filter-group">
                    <label>Seat class:</label>
                    <select value={seatClassType} onChange={(e) => setSeatClassType(e.target.value)}>
                        <option value="">Any</option>
                        {availableSeatClasses.map((seatClass) => (
                            <option key={seatClass} value={seatClass}>{seatClass.
                            toLowerCase()
                                .split('_')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ')}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={windowPreferred}
                            onChange={(e) => setWindowPreferred(e.target.checked)}
                        />
                        Window
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={aislePreferred}
                            onChange={(e) => setAislePreferred(e.target.checked)}
                        />
                        Aisle
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={extraLegRoomPreferred}
                            onChange={(e) => setExtraLegRoomPreferred(e.target.checked)}
                        />
                        Extra Legroom
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={nearExitPreferred}
                            onChange={(e) => setNearExitPreferred(e.target.checked)}
                        />
                        Near Exit
                    </label>
                </div>

                {passengerCount > 1 && (
                    <div className="filter-group">
                        <label>
                            <input
                                type="checkBox"
                                checked={adjacentPreferred}
                                onChange={(e) => setAdjacentPreferred(e.target.checked)}
                            />
                            Required Adjacent
                        </label>
                    </div>
                )}

                <button className="apply-filters-btn" onClick={onRecommend}>
                    Recommend Seats
                </button>
            </div>
    )
}

export default SeatFilterComponent;