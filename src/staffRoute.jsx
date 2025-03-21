import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import LogIn from "./Auth/LogIn";
import ProtectedRoute from "./Auth/ProtectedRoute";
import Inventory from "./Page/Inventory";
import StockInOut from "./Page/stockInOut";
import StockHistory from "./Page/stockHistory";
import ActivityReport from "./Page/activity";
import Admin_dashboard from "./Admin/admin_dashboard";
import Admin_Inventory from "./Admin/admin_Inventory";
import Admin_stockHistory from "./Admin/admin_stockHistory";
import NotFoundPage from "./404/MaintenancePage";
import List_Restock from "./Page/List_Restock";
import SalesmanPriceList from "./Salesman/Salesman_PriceList";

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
        <Route path="/List_Restock" element={<ProtectedRoute><List_Restock /></ProtectedRoute>} />

        <Route path="/admin_dashboard" element={<ProtectedRoute><Admin_dashboard /></ProtectedRoute>} />
        <Route path="/admin_Inventory" element={<ProtectedRoute><Admin_Inventory /></ProtectedRoute>} />
        <Route path="/admin_stockHistory" element={<ProtectedRoute><Admin_stockHistory /></ProtectedRoute>} />

        <Route path="/Salesman_PriceList" element={<ProtectedRoute><SalesmanPriceList /></ProtectedRoute>} />


        {/* 404 Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default StaffRoute;
