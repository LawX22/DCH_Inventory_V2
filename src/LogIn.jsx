import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Temporary authentication (replace with actual authentication logic)
    if (credentials.username === "admin" && credentials.password === "password") {
      navigate("/inventory"); // Redirect to Inventory after login
    } else {
      alert("Invalid username or password");
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
