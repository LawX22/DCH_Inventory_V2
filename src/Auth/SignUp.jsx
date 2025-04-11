import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "Staff" // Default user type
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!formData.fullName || !formData.username) {
        setError("Please fill in all fields");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.email) {
        setError("Please enter your email");
        return;
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address");
        return;
      }
    }
    
    setError("");
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setError("");
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      // Replace with your actual signup endpoint
      const response = await axios.post("https://slategrey-stingray-471759.hostingersite.com/api/backend/register.php", formData);
      
      if (response.data.success) {
        setSuccess("Account created successfully!");
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(response.data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="signup-card-header">
              <h2>Basic Information</h2>
              <p>Let's start with your identity</p>
            </div>
            
            <div className="signup-input-group">
              <label className="signup-label">Full Name</label>
              <div className="signup-input-container">
                <i className="signup-input-icon signup-user-icon"></i>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="signup-input-field"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
            
            <div className="signup-input-group">
              <label className="signup-label">Username</label>
              <div className="signup-input-container">
                <i className="signup-input-icon signup-user-icon"></i>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="signup-input-field"
                  placeholder="Choose a username"
                  required
                />
              </div>
            </div>
            
            <button 
              type="button" 
              className="signup-button"
              onClick={nextStep}
            >
              Continue
            </button>
          </>
        );
        
      case 2:
        return (
          <>
            <div className="signup-card-header">
              <h2>Contact Details</h2>
              <p>How can we reach you?</p>
            </div>
            
            <div className="signup-input-group">
              <label className="signup-label">Email</label>
              <div className="signup-input-container">
                <i className="signup-input-icon signup-email-icon"></i>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="signup-input-field"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div className="signup-input-group">
              <label className="signup-label">User Type</label>
              <div className="signup-input-container">
                <i className="signup-input-icon signup-role-icon"></i>
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  className="signup-input-field"
                  required
                >
                  <option value="Staff">Staff</option>
                  <option value="Salesman">Salesman</option>
                </select>
              </div>
            </div>
            
            <div className="signup-button-group">
              <button 
                type="button" 
                className="signup-back-button"
                onClick={prevStep}
              >
                Back
              </button>
              
              <button 
                type="button" 
                className="signup-button"
                onClick={nextStep}
              >
                Continue
              </button>
            </div>
          </>
        );
        
      case 3:
        return (
          <>
            <div className="signup-card-header">
              <h2>Secure Your Account</h2>
              <p>Create a strong password</p>
            </div>
            
            <div className="signup-input-group">
              <label className="signup-label">Password</label>
              <div className="signup-input-container">
                <i className="signup-input-icon signup-lock-icon"></i>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="signup-input-field"
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>
            
            <div className="signup-input-group">
              <label className="signup-label">Confirm Password</label>
              <div className="signup-input-container">
                <i className="signup-input-icon signup-lock-icon"></i>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="signup-input-field"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
            
            <div className="signup-button-group">
              <button 
                type="button" 
                className="signup-back-button"
                onClick={prevStep}
              >
                Back
              </button>
              
              <button 
                type="submit" 
                className="signup-button"
                disabled={isLoading}
              >
                Create Account
              </button>
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="signup-container">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="signup-loading-overlay">
          <div className="signup-loader-container">
            <div className="signup-loader-spinner"></div>
            <p>Creating your account...</p>
          </div>
        </div>
      )}

      {/* Left Side - Sign Up Form */}
      <div className="signup-form">
        <div className="signup-header">
          <h1 className="signup-welcome-text">JOIN US!</h1>
          <h3 className="signup-system-name">DCH Online Inventory System V2</h3>
        </div>
        
        <div className="signup-card">
          {/* Progress Indicator */}
          <div className="signup-progress">
            {[...Array(totalSteps)].map((_, index) => (
              <div 
                key={index} 
                className={`signup-progress-step ${currentStep > index ? 'completed' : ''} ${currentStep === index + 1 ? 'active' : ''}`}
              >
                <div className="signup-progress-indicator">{index + 1}</div>
                <div className="signup-progress-label">
                  {index === 0 ? "Basic Info" : index === 1 ? "Contact" : "Security"}
                </div>
              </div>
            ))}
          </div>
          
          {error && <div className="signup-error-message">{error}</div>}
          {success && <div className="signup-success-message">{success}</div>}
          
          <form onSubmit={handleSubmit} className="signup-fields">
            {renderStepContent()}
            
            <div className="signup-alt-action">
              Already have an account? <a href="/login" className="signup-link">Sign In</a>
            </div>
          </form>
          
          <div className="signup-footer">
            <p>© 2025 DCH Inventory System. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Branding Image */}
      <div className="signup-banner">
        <div className="signup-banner-content">
          <img src="/src/assets/Logo.png" alt="DCH Logo" className="signup-banner-logo" />
          <div className="signup-banner-text">
            <h2>Join Our Inventory Management System</h2>
            <p>Create an account to access our powerful tools and streamline your inventory operations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;