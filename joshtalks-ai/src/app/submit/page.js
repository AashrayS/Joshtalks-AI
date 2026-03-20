"use client";

import { useState, useEffect, useRef } from 'react';
import statesData from '@/data/states-districts.json';
import { saveDraft, getDrafts, deleteDraft } from '@/lib/db/indexed-db';
import './submit.css';

const PLACEHOLDERS = [
  "e.g. Primary health center near the village market with solar panels...",
  "e.g. New concrete road construction connecting Sector 4 to the highway...",
  "e.g. Traditional step-well (Baoli) currently undergoing restoration...",
  "e.g. Mobile tower installation on the outskirts of the farming zone..."
];

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
  const [drafts, setDrafts] = useState([]);
  const [showWorkspace, setShowWorkspace] = useState(false);
  
  // Phase 5 States
  const [richness, setRichness] = useState(0);
  const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0]);
  
  // Phase 3 States
  const [gpsStatus, setGpsStatus] = useState('searching');
  const [protocol, setProtocol] = useState({
    clarity: false,
    privacy: false,
    location: false,
    terms: false
  });
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadDrafts();
    // Rotate placeholder
    const interval = setInterval(() => {
      setPlaceholder(PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);
    }, 5000);

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
    return () => clearInterval(interval);
  }, []);

  const calculateRichness = (text) => {
    if (!text) return 0;
    let score = Math.min(text.length, 100) / 2; // Up to 50 points for length
    const keywords = ['near', 'across', 'beside', 'village', 'road', 'construction', 'building', 'school', 'hospital', 'market', 'farm'];
    keywords.forEach(word => {
      if (text.toLowerCase().includes(word)) score += 5; // 5 points per keyword
    });
    return Math.min(score, 100);
  };

  useEffect(() => {
    setRichness(calculateRichness(formData.description));
  }, [formData.description]);

  const loadDrafts = async () => {
    try {
      const d = await getDrafts();
      setDrafts(d);
    } catch (err) {
      console.error('Failed to load drafts');
    }
  };

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

  const handleSubmit = async (e, draftData = null) => {
    if (e) e.preventDefault();
    const targetData = draftData || { ...formData, image };
    
    if (!targetData.image || !targetData.state || !targetData.district || targetData.description.length < 10) {
      setError('Please fill all fields and provide a detailed description.');
      return;
    }

    if (!isProtocolComplete && !draftData) {
      setError('Please verify all protocol items before submitting.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      data.append('image', targetData.image);
      data.append('description', targetData.description);
      data.append('state', targetData.state);
      data.append('district', targetData.district);
      if (targetData.gps_lat) data.append('gps_lat', targetData.gps_lat);
      if (targetData.gps_lng) data.append('gps_lng', targetData.gps_lng);

      const response = await fetch('/api/submit', {
        method: 'POST',
        body: data
      });

      if (response.ok) {
        if (draftData) await deleteDraft(draftData.id);
        setIsSuccess(true);
        loadDrafts();
      } else {
        const result = await response.json();
        throw new Error(result.error || 'Submission failed');
      }
    } catch (err) {
      if (!draftData) {
        await saveDraft({ ...formData, image, preview });
        loadDrafts();
        setError('Network Connection Weak. Submission saved to Local Workspace.');
      } else {
        setError(`Sync failed: ${err.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container animate-fade-in">
        <div className="card success-card">
          <div className="success-badge">SUCCESS</div>
          <h2>Reviewing Data</h2>
          <p>Your regional contribution is now in the Estrax verified pipeline.</p>
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
        <h1>Estrax Collection</h1>
        <p>Providing high-fidelity data for regional AI intelligence.</p>
        {drafts.length > 0 && (
          <button className="workspace-toggle" onClick={() => setShowWorkspace(true)}>
            Storage Workspace ({drafts.length})
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="submission-form">
        <div className="card">
          <div className="form-row">
            <div className="form-group">
              <label>State</label>
              <select value={formData.state} onChange={handleStateChange} required>
                <option value="">-- Select --</option>
                {Object.keys(statesData).map(state => <option key={state} value={state}>{state}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>District</label>
              <select value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} disabled={!formData.state} required>
                <option value="">-- Select --</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <label>Regional Description</label>
              <div className="richness-meter">
                <div className="meter-label">Richness: {richness < 40 ? 'Sparse' : richness < 80 ? 'Good' : 'High Fidelity'}</div>
                <div className="meter-bar"><div className="fill" style={{ width: `${richness}%`, backgroundColor: richness < 40 ? '#ea4335' : richness < 80 ? '#f39c12' : '#27ae60' }}></div></div>
              </div>
            </div>
            <textarea 
              placeholder={placeholder}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              minLength={10}
            />
            {richness < 40 && formData.description.length > 5 && (
              <div className="input-hint">💡 Tip: Try mentioning nearby landmarks or the specific street name for better data fidelity.</div>
            )}
          </div>

          <div className="form-group upload-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <label style={{ marginBottom: 0 }}>Ground-Truth Image</label>
              <div className={`gps-indicator ${gpsStatus}`}>
                <span className="dot"></span>
                {gpsStatus === 'searching' ? 'Locking...' : gpsStatus === 'locked' ? 'Locked' : 'Offline'}
              </div>
            </div>
            {preview ? (
              <div className="preview-container">
                <img src={preview} alt="Preview" className="image-preview" />
                <button type="button" className="btn-remove" onClick={() => { setPreview(null); setImage(null); }}>Remove</button>
              </div>
            ) : (
              <div className="upload-options">
                <button type="button" className="upload-btn camera" onClick={() => { fileInputRef.current.setAttribute('capture', 'environment'); fileInputRef.current.click(); }}><div className="text"><strong>Take Photo</strong></div></button>
                <button type="button" className="upload-btn gallery" onClick={() => { fileInputRef.current.removeAttribute('capture'); fileInputRef.current.click(); }}><div className="text"><strong>Gallery</strong></div></button>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} hidden />
          </div>

          <div className="protocol-section">
            <label>Integrity Protocol</label>
            <div className="protocol-items">
              <label className={`protocol-item ${protocol.clarity ? 'checked' : ''}`}><input type="checkbox" checked={protocol.clarity} onChange={() => setProtocol({...protocol, clarity: !protocol.clarity})} /> Image is Clear</label>
              <label className={`protocol-item ${protocol.privacy ? 'checked' : ''}`}><input type="checkbox" checked={protocol.privacy} onChange={() => setProtocol({...protocol, privacy: !protocol.privacy})} /> No Faces Visible</label>
              <label className={`protocol-item ${protocol.location ? 'checked' : ''}`}><input type="checkbox" checked={protocol.location} onChange={() => setProtocol({...protocol, location: !protocol.location})} /> Physically Present</label>
              <label className={`protocol-item ${protocol.terms ? 'checked' : ''}`}><input type="checkbox" checked={protocol.terms} onChange={() => setProtocol({...protocol, terms: !protocol.terms})} /> Terms Accepted</label>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          <button type="submit" className={`btn-primary submit-btn ${!isProtocolComplete ? 'disabled' : ''}`} disabled={isSubmitting || !isProtocolComplete}>
            {isSubmitting ? <span className="spinner"></span> : 'Submit Fidelity Data'}
          </button>
        </div>
      </form>

      {showWorkspace && (
        <div className="workspace-overlay animate-fade-in" onClick={() => setShowWorkspace(false)}>
          <div className="workspace-drawer" onClick={e => e.stopPropagation()}>
            <div className="workspace-header">
              <h2>Workspace</h2>
              <button className="close-btn" onClick={() => setShowWorkspace(false)}>×</button>
            </div>
            <p className="workspace-hint">Stored locally due to connection issues.</p>
            <div className="drafts-list">
              {drafts.map(draft => (
                <div key={draft.id} className="draft-item card">
                  <img src={draft.preview} alt="Draft" />
                  <div className="draft-details">
                    <h3>{draft.district}</h3>
                    <p>{draft.description.substring(0, 40)}...</p>
                    <div className="draft-actions">
                      <button className="btn-sync" onClick={() => handleSubmit(null, draft)} disabled={isSubmitting}>Sync</button>
                      <button className="btn-delete" onClick={() => { deleteDraft(draft.id); loadDrafts(); }}>Discard</button>
                    </div>
                  </div>
                </div>
              ))}
              {drafts.length === 0 && <div className="empty-workspace">Workspace is empty.</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
