import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import LogIn from "./Auth/LogIn";
import ProtectedRoute from "./Auth/ProtectedRoute";
import Inventory from "./Page/Inventory";
import StockInOut from "./Page/stockInOut";
import StockHistory from "./Page/stockHistory";
import ActivityReport from "./Page/activity";
import NotFoundPage from "./404/MaintenancePage";

function StaffRoute() {
  return (
    <Router>
      <Routes>
        {/* Default route to login page */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LogIn />} />

        {/* Other routes */}
        <Route path="/inventory" element={ <ProtectedRoute><Inventory /></ProtectedRoute>} />
        <Route path="/stockInOut" element={<ProtectedRoute><StockInOut /></ProtectedRoute>} />
        <Route path="/stockHistory" element={<ProtectedRoute><StockHistory /></ProtectedRoute>} />
        <Route path="/activity" element={<ProtectedRoute><ActivityReport /></ProtectedRoute>} />

        {/* 404 Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default StaffRoute;
