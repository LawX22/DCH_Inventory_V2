import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Inventory from "./Inventory";
import StockInOut from "./stockInOut";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route to login page */}
        <Route path="/Inventory" element={<Inventory />} />
        
        {/* Other routes */}
        <Route path="/stockInOut" element={<StockInOut />} />
      </Routes>
    </Router>
  );
}

export default App;
