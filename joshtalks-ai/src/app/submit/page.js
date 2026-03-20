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
  
  // Phase 3 States
  const [gpsStatus, setGpsStatus] = useState('searching'); // 'searching', 'locked', 'error'
  const [protocol, setProtocol] = useState({
    clarity: false,
    privacy: false,
    location: false,
    terms: false
  });
  
  const fileInputRef = useRef(null);

  // Auto-capture GPS
  useEffect(() => {
    if ("geolocation" in navigator) {
      setGpsStatus('searching');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            gps_lat: position.coords.latitude,
            gps_lng: position.coords.longitude
          }));
          setGpsStatus('locked');
        },
        (error) => {
          console.warn("GPS error:", error.message);
          setGpsStatus('error');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setGpsStatus('error');
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

  const isProtocolComplete = protocol.clarity && protocol.privacy && protocol.location && protocol.terms;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !formData.state || !formData.district || formData.description.length < 10) {
      setError('Please fill all fields and provide a detailed description.');
      return;
    }

    if (!isProtocolComplete) {
      setError('Please verify all protocol items before submitting.');
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
          <p>Thank you for contributing to the Estrax regional intelligence core.</p>
          <button 
            className="btn-primary" 
            onClick={() => {
              setIsSuccess(false);
              setFormData({ state: '', district: '', description: '', gps_lat: null, gps_lng: null });
              setImage(null);
              setPreview(null);
              setProtocol({ clarity: false, privacy: false, location: false, terms: false });
            }}
          >
            Submit Another Data Point
          </button>
        </div>
      </div>
    );
  }

  const districts = statesData[formData.state] || [];

  return (
    <div className="container animate-fade-in">
      <div className="header">
        <h1>Estrax Collection</h1>
        <p>Providing high-fidelity data for regional AI intelligence.</p>
      </div>

      <form onSubmit={handleSubmit} className="submission-form">
        <div className="card">
          <div className="form-row">
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
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              placeholder="Describe the image (village name, landmarks, regional context...)"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              minLength={10}
            />
          </div>

          <div className="form-group upload-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <label style={{ marginBottom: 0 }}>Image Submission</label>
              <div className={`gps-indicator ${gpsStatus}`}>
                <span className="dot"></span>
                {gpsStatus === 'searching' ? 'Locking Location...' : gpsStatus === 'locked' ? 'GPS Locked' : 'GPS Offline'}
              </div>
            </div>
            
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

          {/* Data Integrity Protocol */}
          <div className="protocol-section">
            <label>Data Integrity Protocol</label>
            <div className="protocol-items">
              <label className={`protocol-item ${protocol.clarity ? 'checked' : ''}`}>
                <input type="checkbox" checked={protocol.clarity} onChange={() => setProtocol({...protocol, clarity: !protocol.clarity})} />
                I confirm the image is clear and sharp.
              </label>
              <label className={`protocol-item ${protocol.privacy ? 'checked' : ''}`}>
                <input type="checkbox" checked={protocol.privacy} onChange={() => setProtocol({...protocol, privacy: !protocol.privacy})} />
                I confirm no faces or private details are visible.
              </label>
              <label className={`protocol-item ${protocol.location ? 'checked' : ''}`}>
                <input type="checkbox" checked={protocol.location} onChange={() => setProtocol({...protocol, location: !protocol.location})} />
                I confirm I am physically in the selected district.
              </label>
              <label className={`protocol-item ${protocol.terms ? 'checked' : ''}`}>
                <input type="checkbox" checked={protocol.terms} onChange={() => setProtocol({...protocol, terms: !protocol.terms})} />
                I agree to the data research usage terms.
              </label>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className={`btn-primary submit-btn ${!isProtocolComplete ? 'disabled' : ''}`} 
            disabled={isSubmitting || !isProtocolComplete}
          >
            {isSubmitting ? (
              <span className="spinner"></span>
            ) : (
              'Verify & Submit Data'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
