import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GrievanceList from './GrievanceList';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const RATING_LABELS = {
  1: 'Not Satisfactory',
  2: 'Poor',
  3: 'Fair',
  4: 'Good',
  5: 'Satisfactory'
};

function AdminDashboard({ user, onLogout }) {
  const [grievances, setGrievances] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStatuses();
    fetchGrievances();
  }, []);

  const fetchStatuses = async () => {
    try {
      const response = await axios.get(`${API_URL}/grievances/statuses`);
      if (response.data.success) {
        setStatuses(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching statuses:', err);
    }
  };

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

  const handleRespond = async () => {
    if (!selectedGrievance || !responseText.trim()) {
      alert('Please enter a response');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/grievances/${selectedGrievance.grievance_id}/respond`,
        { admin_response: responseText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResponseText('');
      setSelectedGrievance(null);
      fetchGrievances();
      alert('Response submitted successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (grievanceId, statusId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/grievances/${grievanceId}/status`,
        { statusId: parseInt(statusId) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchGrievances();
      if (selectedGrievance?.grievance_id === grievanceId) {
        setSelectedGrievance(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const filteredGrievances = filter === 'all' 
    ? grievances 
    : grievances.filter(g => g.status_name === filter);

  const getStatusCount = (statusName) => {
    return grievances.filter(g => g.status_name === statusName).length;
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Silent APP</h1>
          <p className="dashboard-subtitle">Admin Dashboard</p>
          <div className="user-info">
            <span>Welcome, {user.username}</span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-filters">
          <button 
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('all')}
          >
            All ({grievances.length})
          </button>
          <button 
            className={filter === 'pending' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('pending')}
          >
            Pending ({getStatusCount('pending')})
          </button>
          <button 
            className={filter === 'in_progress' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('in_progress')}
          >
            In Progress ({getStatusCount('in_progress')})
          </button>
          <button 
            className={filter === 'resolved' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('resolved')}
          >
            Resolved ({getStatusCount('resolved')})
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading grievances...</div>
        ) : (
          <div className="admin-layout">
            <div className="grievances-panel">
              <GrievanceList 
                grievances={filteredGrievances} 
                userRole="admin"
                onSelect={setSelectedGrievance}
                selectedId={selectedGrievance?.grievance_id}
                onUpdate={fetchGrievances}
                onStatusUpdate={handleStatusUpdate}
              />
            </div>

            {selectedGrievance && (
              <div className="response-panel">
                <h3>Respond to Grievance</h3>
                <div className="grievance-detail">
                  <p className="anonymous-note"><em>This grievance is anonymous - submitter identity is not visible</em></p>
                  <p><strong>Title:</strong> {selectedGrievance.title}</p>
                  <p><strong>Category:</strong> {selectedGrievance.category_name || 'General'}</p>
                  <p><strong>Status:</strong> 
                    <select 
                      value={selectedGrievance.status_id} 
                      onChange={(e) => handleStatusUpdate(selectedGrievance.grievance_id, e.target.value)}
                      className="status-select"
                    >
                      {statuses.map(status => (
                        <option key={status.status_id} value={status.status_id}>
                          {status.status_name.replace('_', ' ').toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </p>
                  <p><strong>Description:</strong></p>
                  <div className="description-box">{selectedGrievance.description}</div>
                  {selectedGrievance.admin_response && (
                    <>
                      <p><strong>Previous Response:</strong></p>
                      <div className="response-box">{selectedGrievance.admin_response}</div>
                    </>
                  )}
                  {selectedGrievance.rating && (
                    <div className="rating-display-admin">
                      <p><strong>Student Rating:</strong></p>
                      <div className="admin-rating-stars">
                        {[1, 2, 3, 4, 5].map(i => (
                          <span
                            key={i}
                            className={`star ${i <= selectedGrievance.rating ? 'filled' : ''}`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="rating-text">({selectedGrievance.rating}/5 - {RATING_LABELS[selectedGrievance.rating]})</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="response-form">
                  <label>Your Response:</label>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Enter your response here..."
                    rows="6"
                  />
                  <button 
                    onClick={handleRespond} 
                    disabled={submitting || !responseText.trim()}
                    className="submit-response-btn"
                  >
                    {submitting ? 'Submitting...' : 'Submit Response'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
