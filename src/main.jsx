import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "../src/css/Header.css";
import "../src/css/Inventory.css";
import "../src/css/LogIn.css";
import "../src/css/InventoryModal.css";
import "../src/css/In&OutModal.css";
import "../src/css/activity.css";
import "../src/css/dashboard.css";
import "../src/css/404.css";
import "../src/css/RequestBoard.css";
import "../src/css/CommentsModal.css";
import "../src/css/ViewDetails.css";

import StaffRoute from "./staffRoute.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StaffRoute />
  </StrictMode>
);
