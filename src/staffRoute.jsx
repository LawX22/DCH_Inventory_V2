import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LogIn from "./jsx/LogIn";
import Inventory from "./jsx/Inventory";
import StockInOut from "./jsx/stockInOut";
import StockHistory from "./jsx/stockHistory";
import ActivityReport from "./jsx/activity";

function StaffRoute() {
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

export default StaffRoute;
