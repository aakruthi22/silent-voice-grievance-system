import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GrievanceForm from './GrievanceForm';
import GrievanceList from './GrievanceList';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function StudentDashboard({ user, onLogout }) {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/grievances`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setGrievances(response.data.data);
      }
    } catch (err) {
      setError('Failed to load grievances');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGrievanceCreated = () => {
    setShowForm(false);
    fetchGrievances();
  };

  const handleRated = () => {
    fetchGrievances();
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Silent APP</h1>
          <p className="dashboard-subtitle">Student Dashboard</p>
          <div className="user-info">
            <span>Welcome, {user.username}</span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-actions">
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="primary-btn"
          >
            {showForm ? 'Cancel' : '+ Submit New Grievance'}
          </button>
        </div>

        {showForm && (
          <GrievanceForm 
            onSuccess={handleGrievanceCreated}
            onCancel={() => setShowForm(false)}
          />
        )}

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading grievances...</div>
        ) : (
          <GrievanceList 
            grievances={grievances} 
            userRole="student"
            onUpdate={fetchGrievances}
            onRated={handleRated}
          />
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;

