import React from 'react';
import './dashboard.css';
const Dashboard = () => {
// Add the onLogout function
  const onLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };
  return (
    <div className="dashboard-container">
      <div className="welcome-message">
        <h1>Welcome to Portal</h1>
        <p>This is your dashboard. You have successfully logged in.</p>
      </div>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
