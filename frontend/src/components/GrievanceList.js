import React from 'react';
import RatingComponent from './RatingComponent';
import './GrievanceList.css';

const RATING_LABELS = {
  1: 'Not Satisfactory',
  2: 'Poor',
  3: 'Fair',
  4: 'Good',
  5: 'Satisfactory'
};

function GrievanceList({ grievances, userRole, onSelect, selectedId, onUpdate, onStatusUpdate, onRated }) {
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'in_progress':
        return 'status-in-progress';
      case 'resolved':
        return 'status-resolved';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (grievances.length === 0) {
    return (
      <div className="no-grievances">
        <p>No grievances found.</p>
      </div>
    );
  }

  return (
    <div className="grievance-list">
      {grievances.map(grievance => (
        <div
          key={grievance.grievance_id}
          className={`grievance-card ${selectedId === grievance.grievance_id ? 'selected' : ''} ${userRole === 'admin' ? 'clickable' : ''}`}
          onClick={() => userRole === 'admin' && onSelect && onSelect(grievance)}
        >
          <div className="grievance-header">
            <div className="grievance-title-section">
              <h3>{grievance.title}</h3>
              {userRole === 'admin' && (
                <span className="anonymous-badge">Anonymous</span>
              )}
            </div>
            <div className="grievance-meta">
              <span className={`status-badge ${getStatusClass(grievance.status_name)}`}>
                {grievance.status_name.replace('_', ' ').toUpperCase()}
              </span>
              {grievance.category_name && (
                <span className="category-badge">{grievance.category_name}</span>
              )}
            </div>
          </div>

          <div className="grievance-body">
            <p className="grievance-description">
              {grievance.description.length > 150
                ? `${grievance.description.substring(0, 150)}...`
                : grievance.description}
            </p>
          </div>

          {grievance.admin_response && (
            <div className="grievance-response">
              <strong>Admin Response:</strong>
              <p>{grievance.admin_response}</p>
            </div>
          )}

          {userRole === 'student' && grievance.status_name === 'resolved' && (
            <RatingComponent
              grievanceId={grievance.grievance_id}
              currentRating={grievance.rating}
              onRated={onRated}
            />
          )}

          {userRole === 'admin' && grievance.rating && (
            <div className="grievance-rating-display">
              <strong>Student Rating:</strong>
              <div className="admin-rating-stars">
                {[1, 2, 3, 4, 5].map(i => (
                  <span
                    key={i}
                    className={`star ${i <= grievance.rating ? 'filled' : ''}`}
                  >
                    ★
                  </span>
                ))}
                <span className="rating-text">({grievance.rating}/5 - {RATING_LABELS[grievance.rating]})</span>
              </div>
            </div>
          )}

          <div className="grievance-footer">
            <span className="grievance-date">
              Submitted: {formatDate(grievance.created_at)}
            </span>
            {grievance.updated_at !== grievance.created_at && (
              <span className="grievance-date">
                Updated: {formatDate(grievance.updated_at)}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default GrievanceList;
