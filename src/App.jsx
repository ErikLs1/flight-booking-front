
import Navbar from "./components/Navbar.jsx";
import FlightSearch from "./components/FlightSearch.jsx";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import SeatSelectionPage from "./components/SeatSelectionPage.jsx";
import CollectPassengerInfo from "./components/CollectPassengerInfo.jsx";
import FlightSummaryPage from "./components/FlightSummaryPage.jsx";
import TicketInfoPage from "./components/TicketInfoPage.jsx";

function App() {

  return (
    <Router>
        <Navbar/>
        <Routes>
            <Route path="/" element={<FlightSearch />}/>
            <Route path="/passengers-info/:flightId" element={<CollectPassengerInfo />}/>
            <Route path="/seat-selection/:flightId" element={<SeatSelectionPage />}/>
            <Route path="/flight-summary/:flightId" element={<FlightSummaryPage />}/>
            <Route path="/my-tickets" element={<TicketInfoPage />}/>
        </Routes>
    </Router>
  )
}

export default App
