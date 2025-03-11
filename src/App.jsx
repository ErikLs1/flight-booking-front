
import Navbar from "./components/Navbar.jsx";
import FlightSearch from "./components/FlightSearch.jsx";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import SeatSelectionPage from "./components/SeatSelectionPage.jsx";

function App() {

  return (
    <Router>
        <Navbar/>
        <Routes>
            <Route path="/" element={<FlightSearch />}/>
            <Route path="/booking/:flightId" element={<SeatSelectionPage />}/>
        </Routes>
    </Router>
  )
}

export default App
