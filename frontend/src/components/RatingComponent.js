import React, { useState } from 'react';
import axios from 'axios';
import './RatingComponent.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const RATING_LABELS = {
  1: 'Not Satisfactory',
  2: 'Poor',
  3: 'Fair',
  4: 'Good',
  5: 'Satisfactory'
};

function RatingComponent({ grievanceId, currentRating, onRated }) {
  const [rating, setRating] = useState(currentRating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleRatingClick = async (selectedRating) => {
    if (submitting) return;
    
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not logged in. Please refresh the page.');
        setSubmitting(false);
        return;
      }

      console.log('Submitting rating:', { grievanceId, rating: selectedRating });
      
      const response = await axios.put(
        `${API_URL}/grievances/${grievanceId}/rate`,
        { rating: parseInt(selectedRating) },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      console.log('Rating response:', response.data);

      if (response.data.success) {
        setRating(selectedRating);
        if (onRated) {
          onRated(selectedRating);
        }
      } else {
        setError(response.data.message || 'Failed to submit rating');
      }
    } catch (err) {
      console.error('Rating error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to submit rating. Please check your connection and try again.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    const displayRating = hoveredRating || rating;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= displayRating ? 'filled' : ''} ${i <= rating ? 'rated' : ''}`}
          onMouseEnter={() => !submitting && setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => !submitting && handleRatingClick(i)}
          style={{ cursor: submitting ? 'not-allowed' : 'pointer' }}
          title={RATING_LABELS[i]}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const getCurrentLabel = () => {
    const displayRating = hoveredRating || rating;
    return displayRating > 0 ? RATING_LABELS[displayRating] : '';
  };

  if (currentRating) {
    // Show read-only rating if already rated
    return (
      <div className="rating-display">
        <span className="rating-label">Your Rating:</span>
        <div className="stars-readonly">
          {renderStars()}
        </div>
        <span className="rating-value">
          ({rating}/5 - {RATING_LABELS[rating]})
        </span>
      </div>
    );
  }

  return (
    <div className="rating-component">
      <div className="rating-header">
        <span className="rating-label">Rate this resolution:</span>
        <span className="rating-scale-info">(1 = Not Satisfactory, 5 = Satisfactory)</span>
      </div>
      <div className="stars-container">
        <div className="stars-interactive">
          {renderStars()}
        </div>
        {getCurrentLabel() && (
          <span className="rating-label-text">{getCurrentLabel()}</span>
        )}
      </div>
      {error && <div className="rating-error">{error}</div>}
      {submitting && <div className="rating-submitting">Submitting...</div>}
    </div>
  );
}

export default RatingComponent;
