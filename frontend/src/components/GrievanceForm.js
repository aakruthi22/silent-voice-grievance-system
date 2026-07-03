import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GrievanceForm.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function GrievanceForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: ''
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/grievances/categories`);
      if (response.data.success) {
        setCategories(response.data.data);
        if (response.data.data.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: response.data.data[0].category_id }));
        }
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.categoryId) {
      setError('Please select a category');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/grievances`,
        {
          title: formData.title,
          description: formData.description,
          categoryId: parseInt(formData.categoryId)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setFormData({ title: '', description: '', categoryId: categories[0]?.category_id || '' });
        onSuccess();
      } else {
        setError(response.data.message || 'Failed to submit grievance');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit grievance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grievance-form-container">
      <form onSubmit={handleSubmit} className="grievance-form">
        <h3>Submit New Grievance</h3>
        
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter grievance title"
            maxLength={255}
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          {loadingCategories ? (
            <select disabled>
              <option>Loading categories...</option>
            </select>
          ) : (
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              {categories.map(cat => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Describe your grievance in detail..."
            rows="6"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" disabled={loading || loadingCategories} className="submit-btn">
            {loading ? 'Submitting...' : 'Submit Grievance'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default GrievanceForm;
