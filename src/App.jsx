
import Navbar from "./shared/ui/Navbar.jsx";
import FlightSearch from "./pages/FlightSearch/ui/FlightSearch.jsx";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import SeatSelectionPage from "./pages/SeatSelection/ui/SeatSelectionPage.jsx";
import CollectPassengerInfo from "./pages/CollectPassengerInfo/ui/CollectPassengerInfo.jsx";
import FlightSummaryPage from "./pages/FlightSummary/ui/FlightSummaryPage.jsx";
import TicketInfoPage from "./pages/TicketInformation/ui/TicketInfoPage.jsx";

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
