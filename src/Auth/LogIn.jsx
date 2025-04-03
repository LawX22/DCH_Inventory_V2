import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const LogIn = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost/DCH_Inventory_V2/src/backend/login.php", credentials);
      
      if (response.data.success) {
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("userType", response.data.userType);

        // Redirect based on userType
        if (response.data.userType === "Admin") {
          navigate("/admin_dashboard"); 
          // console.log('login');
   
        } else if (response.data.userType === "Store-Staff" || response.data.userType === "Warehouse-Staff") {
          // console.log('login');
          navigate("/Inventory");
        } else if (response.data.userType === "Salesman") {
          // console.log('login');
          navigate("/Salesman_PriceList");
        }

        
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again.");
    }
  };


  return (
    <div className="login-container">
      {/* Left Side - Login Form */}
      <div className="login-form">
        <h1 className="welcome-text">WELCOME!</h1>
        <h3>DCH Online Inventory System V2</h3>
        <img src="/src/assets/DCH.png" alt="Parts Box" className="parts-image" />

        <form onSubmit={handleSubmit} className="login-fields">
          <div>
            <label className="label">Username</label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>

      {/* Right Side - Branding Image */}
      <div className="login-banner">
   
      </div>
    </div>
  );
};

export default LogIn;
