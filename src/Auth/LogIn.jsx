import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LogIn = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await axios.post("https://slategrey-stingray-471759.hostingersite.com/api/backend/login.php", credentials);
      
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
        setError("Invalid username or password");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loader-container">
            <div className="loader-spinner"></div>
            <p>Signing in...</p>
          </div>
        </div>
      )}

      {/* Left Side - Login Form */}
      <div className="login-form">
        <div className="login-header">
          <h1 className="welcome-text">WELCOME!</h1>
          <h3 className="system-name">DCH Online Inventory System V2</h3>
        </div>
        
        <div className="login-card">
          <div className="login-card-header">
            <h2>Sign In</h2>
            <p>Please enter your credentials to continue</p>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="login-fields">
            <div className="input-group">
              <label className="label">Username</label>
              <div className="input-container">
                <i className="input-icon user-icon"></i>
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>
            
            <div className="input-group">
              <label className="label">Password</label>
              <div className="input-container">
                <i className="input-icon lock-icon"></i>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            
            <div className="remember-forgot">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>
            
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              Sign In
            </button>
          </form>
          
          <div className="login-footer">
            <p>© 2025 DCH Inventory System. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Branding Image */}
      <div className="login-banner">
        <div className="banner-content">
          <img src="/src/assets/Logo.png" alt="DCH Logo" className="banner-logo" />
          <div className="banner-text">
            <h2>Streamline Your Inventory Management</h2>
            <p>Access real-time data and manage your inventory efficiently with our comprehensive system</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;