import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LogIn from "./LogIn";
import Inventory from "./Inventory";
import StockInOut from "./stockInOut";
import StockHistory from "./stockHistory";
import ActivityReport from "./activity";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route to login page */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LogIn />} />

        {/* Other routes */}
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/stockInOut" element={<StockInOut />} />
        <Route path="/stockHistory" element={<StockHistory />} />
        <Route path="/activity" element={<ActivityReport />} />
      </Routes>
    </Router>
  );
}

export default App;
