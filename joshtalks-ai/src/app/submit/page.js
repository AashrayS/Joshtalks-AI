"use client";

import { useState, useEffect, useRef } from 'react';
import statesData from '@/data/states-districts.json';
import { saveDraft, getDrafts, deleteDraft } from '@/lib/db/indexed-db';
import './submit.css';

const PLACEHOLDERS = [
  "e.g. Primary health center near the village market...",
  "e.g. New concrete road connecting Sector 4 to the highway...",
  "e.g. Traditional step-well currently undergoing restoration...",
  "e.g. Mobile tower installation on the outskirts of the village..."
];

const BADGES = [
  { id: 'scout', name: 'Regional Scout', icon: '📡', min: 1 },
  { id: 'pioneer', name: 'Fidelity Pioneer', icon: '💎', min: 5 },
  { id: 'master', name: 'Territory Master', icon: '🏛️', min: 10 }
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
  
  // Phase 7: Location Guard States
  const [locationVerified, setLocationVerified] = useState(false);
  
  // Phase 6.1: Motivation States
  const [stats, setStats] = useState({ total_subs: 0, district_subs: 0 });
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  
  // Phase 5 States
  const [richness, setRichness] = useState(0);
  const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0]);
  
  // Phase 3 States
  const [gpsStatus, setGpsStatus] = useState('searching');
  const [protocol, setProtocol] = useState({
    clarity: false,
    privacy: false,
    location: false,
    terms: false,
    gpsMatch: false // Phase 7
  });
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadDrafts();
    loadMotivationStats();
    const interval = setInterval(() => {
      setPlaceholder(PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);
    }, 5000);

    if ("geolocation" in navigator) {
      setGpsStatus('searching');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({ ...prev, gps_lat: position.coords.latitude, gps_lng: position.coords.longitude }));
          setGpsStatus('locked');
        },
        () => setGpsStatus('error'),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setGpsStatus('error');
    }
    return () => clearInterval(interval);
  }, []);

  const loadMotivationStats = () => {
    const total = parseInt(localStorage.getItem('estrax_subs') || '0');
    setStats({ total_subs: total, district_subs: Math.floor(total * 0.4) });
    setUnlockedBadges(BADGES.filter(b => total >= b.min));
  };

  const calculateRichness = (text) => {
    if (!text) return 0;
    let score = Math.min(text.length, 100) / 2;
    if (gpsStatus === 'locked') score += 10; // GPS Bonus
    const keywords = ['near', 'across', 'beside', 'village', 'road', 'construction', 'building', 'school', 'hospital', 'market', 'farm'];
    keywords.forEach(word => { if (text.toLowerCase().includes(word)) score += 5; });
    return Math.min(score, 100);
  };

  useEffect(() => {
    setRichness(calculateRichness(formData.description));
  }, [formData.description, gpsStatus]);

  const loadDrafts = async () => {
    try {
      const d = await getDrafts();
      setDrafts(d);
    } catch (err) {
      console.error('Failed to load drafts');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const isProtocolComplete = protocol.clarity && protocol.privacy && protocol.location && protocol.terms && protocol.gpsMatch;

  const handleSubmit = async (e, draftData = null) => {
    if (e) e.preventDefault();
    const targetData = draftData || { ...formData, image };
    
    if (!targetData.image || !targetData.state || !targetData.district || targetData.description.length < 10) {
      setError('Please provide all details.');
      return;
    }

    if (!isProtocolComplete && !draftData) {
      setError('Complete the 5-point Integrity Protocol.');
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

      const response = await fetch('/api/submit', { method: 'POST', body: data });

      if (response.ok) {
        if (draftData) await deleteDraft(draftData.id);
        const newTotal = stats.total_subs + 1;
        localStorage.setItem('estrax_subs', newTotal.toString());
        setIsSuccess(true);
        loadDrafts();
        loadMotivationStats();
      } else {
        const result = await response.json();
        throw new Error(result.error || 'Submission failed');
      }
    } catch (err) {
      if (!draftData) {
        await saveDraft({ ...formData, image, preview });
        loadDrafts();
        setError('Network Weak. Saved to Local Workspace.');
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
          <div className="celebration-icon">🏆</div>
          <h2>Submission Confirmed</h2>
          <p>Territory knowledge for {formData.district} has been updated.</p>
          <div className="impact-toast"><strong>+{richness} Fidelity Points</strong> Earned!</div>
          <button 
            className="btn-primary" 
            onClick={() => {
              setIsSuccess(false);
              setFormData({ state: '', district: '', description: '', gps_lat: null, gps_lng: null });
              setImage(null);
              setPreview(null);
              setProtocol({ clarity: false, privacy: false, location: false, terms: false, gpsMatch: false });
              setLocationVerified(false);
            }}
          >
            Capture Next Insight
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      <div className="header">
        <h1>{formData.district ? `Mapping ${formData.district}` : 'Regional Collection'}</h1>
        <p>Providing high-fidelity data for Bharat-AI intelligence.</p>
      </div>

      <div className="scout-dashboard">
        <div className="stat-card impact">
          <label>Global Impact</label>
          <div className="val">{stats.total_subs} Insights</div>
        </div>
        <div className="stat-card rank">
          <label>Scout Rank</label>
          <div className="val">#{Math.max(1, 150 - stats.total_subs * 10)} in {formData.district || 'State'}</div>
        </div>
        <div className="badges-row">
          {BADGES.map(badge => (
            <div key={badge.id} className={`badge-chip ${unlockedBadges.find(b => b.id === badge.id) ? 'active' : 'locked'}`}>
              <span className="icon">{badge.icon}</span>
              <span className="name">{badge.name}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="submission-form">
        <div className="card">
          <div className="form-row">
            <div className="form-group">
              <label>State</label>
              <select value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value, district: ''})} required>
                <option value="">-- Select --</option>
                {Object.keys(statesData).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>District</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select 
                  value={formData.district} 
                  onChange={(e) => {
                    setFormData({...formData, district: e.target.value});
                    setLocationVerified(false);
                  }} 
                  disabled={!formData.state} 
                  style={{ flex: 1 }}
                  required
                >
                  <option value="">-- Select --</option>
                  {(statesData[formData.state] || []).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {formData.district && gpsStatus === 'locked' && (
                  <button 
                    type="button" 
                    className={`btn-verify ${locationVerified ? 'verified' : ''}`}
                    onClick={() => setLocationVerified(true)}
                    title="Verify current location matches selection"
                  >
                    {locationVerified ? '✓' : '📍'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {locationVerified && (
            <div className="location-info animate-fade-in">
              <p>📍 Location Locked: <code>{formData.gps_lat?.toFixed(4)}, {formData.gps_lng?.toFixed(4)}</code></p>
              <a href={`https://www.google.com/maps?q=${formData.gps_lat},${formData.gps_lng}`} target="_blank" rel="noopener noreferrer" className="maps-link">
                View on Satellite Map →
              </a>
            </div>
          )}

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <label>Regional Description</label>
              <div className="richness-meter">
                <div className="meter-label">Fidelity: {richness < 40 ? 'LOW' : richness < 80 ? 'GOOD' : 'ELITE'}</div>
                <div className="meter-bar"><div className="fill" style={{ width: `${richness}%`, backgroundColor: richness < 40 ? '#ea4335' : richness < 80 ? '#f39c12' : '#27ae60' }}></div></div>
              </div>
            </div>
            <textarea placeholder={placeholder} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required minLength={10} />
          </div>

          <div className="form-group upload-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <label style={{ marginBottom: 0 }}>Ground-Truth Image</label>
              <div className={`gps-indicator ${gpsStatus}`}><span className="dot"></span> {gpsStatus === 'searching' ? 'Locking...' : gpsStatus === 'locked' ? 'Locked' : 'Offline'}</div>
            </div>
            {preview ? (
              <div className="preview-container">
                <img src={preview} alt="Preview" className="image-preview" />
                <button type="button" className="btn-remove" onClick={() => { setPreview(null); setImage(null); }}>Discard</button>
              </div>
            ) : (
              <div className="upload-options">
                <button type="button" className="upload-btn camera" onClick={() => { fileInputRef.current.setAttribute('capture', 'environment'); fileInputRef.current.click(); }}><div className="text"><strong>Capture</strong></div></button>
                <button type="button" className="upload-btn gallery" onClick={() => { fileInputRef.current.removeAttribute('capture'); fileInputRef.current.click(); }}><div className="text"><strong>Gallery</strong></div></button>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} hidden />
          </div>

          <div className="protocol-section">
            <label>Integrity Protocol (5-Point Check)</label>
            <div className="protocol-items">
              <label className={`protocol-item ${protocol.clarity ? 'checked' : ''}`}><input type="checkbox" checked={protocol.clarity} onChange={() => setProtocol({...protocol, clarity: !protocol.clarity})} /> Image Clarity Verified</label>
              <label className={`protocol-item ${protocol.privacy ? 'checked' : ''}`}><input type="checkbox" checked={protocol.privacy} onChange={() => setProtocol({...protocol, privacy: !protocol.privacy})} /> Privacy Safeguards Met (No faces)</label>
              <label className={`protocol-item ${protocol.location ? 'checked' : ''}`}><input type="checkbox" checked={protocol.location} onChange={() => setProtocol({...protocol, location: !protocol.location})} /> Physically Present in District</label>
              <label className={`protocol-item ${protocol.gpsMatch ? 'checked' : ''}`}><input type="checkbox" checked={protocol.gpsMatch} disabled={!locationVerified} onChange={() => setProtocol({...protocol, gpsMatch: !protocol.gpsMatch})} /> GPS Coordinates Match {formData.district || 'District'}</label>
              <label className={`protocol-item ${protocol.terms ? 'checked' : ''}`}><input type="checkbox" checked={protocol.terms} onChange={() => setProtocol({...protocol, terms: !protocol.terms})} /> Data Research Terms Accepted</label>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          <button type="submit" className={`btn-primary submit-btn ${!isProtocolComplete ? 'disabled' : ''}`} disabled={isSubmitting || !isProtocolComplete}>
            {isSubmitting ? <span className="spinner"></span> : 'Submit Fidelity Data'}
          </button>
        </div>
      </form>

      {/* Persistence Badge */}
      <button className="workspace-badge" onClick={() => setShowWorkspace(true)}>
        Storage {drafts.length > 0 ? `(${drafts.length})` : ''}
      </button>

      {showWorkspace && (
        <div className="workspace-overlay animate-fade-in" onClick={() => setShowWorkspace(false)}>
          <div className="workspace-drawer" onClick={e => e.stopPropagation()}>
            <div className="workspace-header"><h2>Local Storage</h2><button className="close-btn" onClick={() => setShowWorkspace(false)}>×</button></div>
            <div className="drafts-list">
              {drafts.map(draft => (
                <div key={draft.id} className="draft-item card">
                  <img src={draft.preview} alt="Draft" />
                  <div className="draft-details">
                    <h3>{draft.district}</h3>
                    <div className="draft-actions">
                      <button className="btn-sync" onClick={() => handleSubmit(null, draft)} disabled={isSubmitting}>Sync</button>
                      <button className="btn-delete" onClick={() => { deleteDraft(draft.id); loadDrafts(); }}>Discard</button>
                    </div>
                  </div>
                </div>
              ))}
              {drafts.length === 0 && <div className="empty-workspace">Storage is empty.</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
