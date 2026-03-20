"use client";

import { useState, useEffect, useRef } from 'react';
import statesData from '@/data/states-districts.json';
import './submit.css';

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    state: '',
    district: '',
    description: '',
    gps_lat: null,
    gps_lng: null
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);

  // Auto-capture GPS
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            gps_lat: position.coords.latitude,
            gps_lng: position.coords.longitude
          }));
        },
        (error) => {
          console.warn("GPS error:", error.message);
        }
      );
    }
  }, []);

  const handleStateChange = (e) => {
    setFormData({ ...formData, state: e.target.value, district: '' });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !formData.state || !formData.district || formData.description.length < 10) {
      setError('Please fill all fields and provide a detailed description (min 10 chars).');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      data.append('image', image);
      data.append('description', formData.description);
      data.append('state', formData.state);
      data.append('district', formData.district);
      if (formData.gps_lat) data.append('gps_lat', formData.gps_lat);
      if (formData.gps_lng) data.append('gps_lng', formData.gps_lng);

      const response = await fetch('/api/submit', {
        method: 'POST',
        body: data
      });

      const result = await response.json();
      if (response.ok) {
        setIsSuccess(true);
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container animate-fade-in">
        <div className="card success-card">
          <div className="success-badge">SUCCESS</div>
          <h2>Submission Received</h2>
          <p>Thank you for contributing. Your submission is now pending review.</p>
          <button 
            className="btn-primary" 
            onClick={() => {
              setIsSuccess(false);
              setFormData({ state: '', district: '', description: '', gps_lat: null, gps_lng: null });
              setImage(null);
              setPreview(null);
            }}
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  const districts = statesData[formData.state] || [];

  return (
    <div className="container animate-fade-in">
      <div className="header">
        <h1>Village Image Collection</h1>
        <p>Help us train AI models with authentic rural imagery.</p>
      </div>

      <form onSubmit={handleSubmit} className="submission-form">
        <div className="card">
          <div className="form-group">
            <label>Select State</label>
            <select value={formData.state} onChange={handleStateChange} required>
              <option value="">-- Choose State --</option>
              {Object.keys(statesData).map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select District</label>
            <select 
              value={formData.district} 
              onChange={(e) => setFormData({...formData, district: e.target.value})} 
              disabled={!formData.state}
              required
            >
              <option value="">-- Choose District --</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              placeholder="Describe the image (village name, activity, landmarks...)"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              minLength={10}
            />
          </div>

          <div className="form-group upload-section">
            <label>Image Submission</label>
            {preview ? (
              <div className="preview-container">
                <img src={preview} alt="Preview" className="image-preview" />
                <button type="button" className="btn-remove" onClick={() => { setPreview(null); setImage(null); }}>
                  Remove & Retake
                </button>
              </div>
            ) : (
              <div className="upload-options">
                <button type="button" className="upload-btn camera" onClick={() => {
                  fileInputRef.current.setAttribute('capture', 'environment');
                  fileInputRef.current.click();
                }}>
                  <div className="text">
                    <strong>Take Photo</strong>
                    <span>Use camera</span>
                  </div>
                </button>
                
                <button type="button" className="upload-btn gallery" onClick={() => {
                  fileInputRef.current.removeAttribute('capture');
                  fileInputRef.current.click();
                }}>
                  <div className="text">
                    <strong>Upload</strong>
                    <span>From gallery</span>
                  </div>
                </button>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              ref={fileInputRef}
              hidden
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="spinner"></span>
            ) : (
              'Submit Data'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
