import React from 'react';
import '../App.css'; // Ensure App.css is imported for styling

const LoginPage = ({ onLoginSuccess }) => {
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    // In a real app, you'd validate credentials here
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="app-container"> {/* Assuming app-container provides basic layout */}
      <div className="login-page-container"> {/* For specific login page styling */}
        <h1>Login Page</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit" className="submit-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
