import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import LogIn from "./Auth/LogIn";
import Inventory from "./Page/Inventory";
import StockInOut from "./Page/stockInOut";
import StockHistory from "./Page/stockHistory";
import ActivityReport from "./Page/activity";

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
