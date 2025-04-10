import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "../src/css/Header.css";
import "../src/css/Staff.css";
import "../src/css/Tables.css";
import "../src/css/Admin.css";
import "../src/css/AdminTables.css";
import "../src/css/LogIn.css";
import "../src/css/SignUp.css";
import "../src/css/Modal/InventoryModal.css";
import "../src/css/Modal/GroupModal.css";
import "../src/css/Modal/EditModal.css";
import "../src/css/Modal/In&OutModal.css";
import "../src/css/Modal/FocusedStockHistoryModal.css";
import "../src/css/Modal/HistoryFixModal.css";
import "../src/css/Modal/HistorySelectOptionModal.css";
import "../src/css/Modal/HistoryManualFixModal.css";
import "../src/css/activity.css";
import "../src/css/Admindashboard.css";
import "../src/css/404.css";
import "../src/css/RequestBoard.css";
import "../src/css/Modal/CommentsModal.css";
import "../src/css/ViewDetails.css";

import StaffRoute from "./staffRoute.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StaffRoute />
  </StrictMode>
);
