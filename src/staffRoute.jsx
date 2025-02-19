import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Inventory from "./Inventory";
import StockInOut from "./stockInOut";
import StockHistory from "./stockHistory";


function App() {
  return (
    <Router>
      <Routes>
        {/* Default route to login page */}
        <Route path="/Inventory" element={<Inventory />} />
        
        {/* Other routes */}
        <Route path="/stockInOut" element={<StockInOut />} />

        <Route path="/stockHistory" element={<StockHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
