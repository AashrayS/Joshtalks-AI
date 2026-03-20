"use client";

import { useState, useEffect } from 'react';
import statesData from '@/data/states-districts.json';
import './admin.css';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [coverage, setCoverage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ state: '', district: '', status: '' });
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [view, setView] = useState('submissions'); // 'submissions' or 'coverage'

  // Quality Checklist State
  const [qc, setQc] = useState({
    clarity: false,
    location: false,
    content: false,
    metadata: false
  });

  const handleLogin = (e) => {
    e.preventDefault();
    fetchStats(password);
    fetchSubmissions(password);
  };

  const fetchStats = async (pwd = password) => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: { 'x-admin-password': pwd }
      });
      const result = await response.json();
      if (response.ok) {
        setStats(result.stats);
        setCoverage(result.coverage);
      }
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  const fetchSubmissions = async (pwd = password) => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(`/api/submissions?${query}`, {
        headers: { 'x-admin-password': pwd }
      });
      const result = await response.json();
      
      if (response.ok) {
        setSubmissions(result.submissions);
        setIsAuthenticated(true);
      } else {
        throw new Error(result.error || 'Authentication failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
      fetchStats();
    }
  }, [filters, isAuthenticated]);

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`/api/submission/${id}/approve`, {
        method: 'POST',
        headers: { 'x-admin-password': password }
      });
      const result = await response.json();
      if (response.ok) {
        setSelectedSubmission(null);
        fetchSubmissions();
        fetchStats();
      } else {
        alert(`Error: ${result.error || 'Failed to approve'}`);
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  const handleReject = async (id) => {
    if (!rejectionReason) return;
    try {
      const response = await fetch(`/api/submission/${id}/reject`, {
        method: 'POST',
        headers: { 
          'x-admin-password': password,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: rejectionReason })
      });
      const result = await response.json();
      if (response.ok) {
        setIsRejecting(false);
        setRejectionReason('');
        setSelectedSubmission(null);
        fetchSubmissions();
        fetchStats();
      } else {
        alert(`Error: ${result.error || 'Failed to reject'}`);
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-container admin-login animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card login-card" style={{ maxWidth: '450px', width: '100%', padding: '4rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.05em' }}>Estrax Admin</h1>
          <p style={{ color: '#666', marginBottom: '2.5rem' }}>Secure access for regional intelligence management.</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <input 
              type="password" 
              placeholder="Admin Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: '1rem 1.5rem',
                borderRadius: '100px',
                border: '1px solid #eee',
                fontSize: '1rem',
                backgroundColor: '#f9f9f9'
              }}
            />
            {error && <p className="error-text" style={{ color: '#ea4335', fontSize: '0.9rem' }}>{error}</p>}
            <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '1.1rem' }}>
              {loading ? 'Authenticating...' : 'Enter Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container animate-fade-in">
      <header className="admin-header">
        <div className="branding">
          <h1>Admin Console</h1>
          <div className="tab-switcher">
            <button className={view === 'submissions' ? 'active' : ''} onClick={() => setView('submissions')}>Submissions</button>
            <button className={view === 'coverage' ? 'active' : ''} onClick={() => setView('coverage')}>District Coverage</button>
          </div>
        </div>
        <div className="admin-filters">
          <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
            <option value="">Status: All</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
          <select value={filters.state} onChange={(e) => setFilters({...filters, state: e.target.value, district: ''})}>
            <option value="">Region: All India</option>
            {Object.keys(statesData).sort().map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn-logout" onClick={() => setIsAuthenticated(false)}>Logout</button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="stats-dashboard grid-3 animate-fade-in">
        <div className="stats-card">
          <label>Total Collected</label>
          <span className="value">{stats.total}</span>
          <span className="trend">Across {coverage.length} Districts</span>
        </div>
        <div className="stats-card">
          <label>Awaiting Review</label>
          <span className="value" style={{ color: '#f39c12' }}>{stats.pending}</span>
          <span className="trend">{Math.round((stats.pending / stats.total) * 100) || 0}% backlog</span>
        </div>
        <div className="stats-card">
          <label>Verified Pipeline</label>
          <span className="value" style={{ color: '#27ae60' }}>{stats.approved}</span>
          <span className="trend">Ready for Intelligence Train</span>
        </div>
      </div>

      {view === 'submissions' ? (
        <>
          {loading && <div className="loading-state" style={{ marginBottom: '2rem', color: '#666', fontStyle: 'italic' }}>Syncing regional data...</div>}
          <div className="submissions-grid">
            {submissions.map(sub => (
              <div key={sub.id} className="card sub-card animate-fade-in">
                <div className="sub-image" onClick={() => { setSelectedSubmission(sub); setQc({ clarity: false, location: false, content: false, metadata: false }); }}>
                  <img src={sub.image_url} alt="Submission" />
                  <span className={`status-badge ${sub.status}`}>
                     {sub.status === 'pending' ? 'Review Needed' : sub.status}
                  </span>
                </div>
                <div className="sub-info">
                  <div onClick={() => { setSelectedSubmission(sub); setQc({ clarity: false, location: false, content: false, metadata: false }); }} style={{ cursor: 'pointer' }}>
                    <h3>{sub.district}, {sub.state}</h3>
                    <p className="description-preview">{sub.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                      <span className="timestamp">{new Date(sub.created_at).toLocaleDateString()}</span>
                      <span style={{ fontSize: '0.8rem', color: '#000', fontWeight: '700' }}>Review Details →</span>
                    </div>
                  </div>
                  
                  {sub.status === 'pending' && (
                    <div className="quick-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #eee' }}>
                      <button 
                        className="btn-approve" 
                        onClick={(e) => { e.stopPropagation(); handleApprove(sub.id); }}
                        style={{ padding: '0.6rem', fontSize: '0.8rem' }}
                      >
                        Quick Verify
                      </button>
                      <button 
                        className="btn-reject" 
                        onClick={(e) => { e.stopPropagation(); setSelectedSubmission(sub); setIsRejecting(true); }}
                        style={{ padding: '0.6rem', fontSize: '0.8rem' }}
                      >
                        Quick Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {submissions.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '10rem 0', color: '#888' }}>
              <h2>No regional data found for this filter.</h2>
              <p>Try broadening your search or check again later.</p>
            </div>
          )}
        </>
      ) : (
        <div className="coverage-section animate-fade-in">
          <div className="coverage-table-card card">
            <h2>Regional Coverage Leaderboard</h2>
            <div className="coverage-table">
              <div className="table-header">
                <span>District</span>
                <span>State</span>
                <span>Submissions</span>
                <span>Verification Rate</span>
                <span>Coverage %</span>
              </div>
              {coverage.map((c, i) => (
                <div key={i} className="table-row">
                  <span className="bold">{c.district}</span>
                  <span>{c.state}</span>
                  <span className="count-badge">{c.count}</span>
                  <span>{Math.round((c.verified / c.count) * 100)}%</span>
                  <div className="coverage-bar-cell">
                    <div className="coverage-bar-container">
                      <div className="coverage-bar" style={{ width: `${Math.min((c.count / 20) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedSubmission && (
        <div className="modal-overlay animate-fade-in" onClick={() => { setSelectedSubmission(null); setIsRejecting(false); }}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => { setSelectedSubmission(null); setIsRejecting(false); }}>×</button>
            <div className="modal-content">
              <div className="modal-image">
                <img src={selectedSubmission.image_url} alt="Full view" />
              </div>
              <div className="modal-details">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`status-badge ${selectedSubmission.status}`} style={{ position: 'static' }}>
                    {selectedSubmission.status}
                  </span>
                  <span className="timestamp">ID: {selectedSubmission.id.substring(0, 8)}</span>
                </div>
                
                <h2>{selectedSubmission.district}, {selectedSubmission.state}</h2>
                
                <div className="metadata-row">
                  <span>📍 GPS: {selectedSubmission.gps_lat || 'N/A'}, {selectedSubmission.gps_lng || 'N/A'}</span>
                  <span>🗓️ Captured: {new Date(selectedSubmission.created_at).toLocaleString()}</span>
                  <span>🔍 Data Type: Ground-Truth Imagery</span>
                </div>

                {/* Quality Checklist */}
                {selectedSubmission.status === 'pending' && (
                  <div className="qc-checklist">
                    <h3>Quality Control Protocol</h3>
                    <div className="qc-items">
                      <label className={`qc-item ${qc.clarity ? 'checked' : ''}`}>
                        <input type="checkbox" checked={qc.clarity} onChange={() => setQc({...qc, clarity: !qc.clarity})} />
                        Image is clear & high-def
                      </label>
                      <label className={`qc-item ${qc.location ? 'checked' : ''}`}>
                        <input type="checkbox" checked={qc.location} onChange={() => setQc({...qc, location: !qc.location})} />
                        Location matches description
                      </label>
                      <label className={`qc-item ${qc.content ? 'checked' : ''}`}>
                        <input type="checkbox" checked={qc.content} onChange={() => setQc({...qc, content: !qc.content})} />
                        No people or private PII
                      </label>
                      <label className={`qc-item ${qc.metadata ? 'checked' : ''}`}>
                        <input type="checkbox" checked={qc.metadata} onChange={() => setQc({...qc, metadata: !qc.metadata})} />
                        GPS metadata is valid
                      </label>
                    </div>
                  </div>
                )}

                <p className="full-description">{selectedSubmission.description}</p>
                
                {selectedSubmission.status === 'rejected' && (
                  <div className="rejection-info">
                    <strong>Rejection Logic Applied:</strong>
                    <p>{selectedSubmission.rejection_reason}</p>
                  </div>
                )}

                {!isRejecting && (
                  <div className="admin-actions">
                    {selectedSubmission.status !== 'approved' && (
                      <button 
                        className="btn-approve" 
                        onClick={() => handleApprove(selectedSubmission.id)}
                        disabled={selectedSubmission.status === 'pending' && (!qc.clarity || !qc.location || !qc.content || !qc.metadata)}
                      >
                        {selectedSubmission.status === 'pending' ? 'Verify & Approve' : 'Re-Approve'}
                      </button>
                    )}
                    <button className="btn-reject" onClick={() => setIsRejecting(true)}>
                      {selectedSubmission.status === 'pending' ? 'Reject' : 'Change to Rejected'}
                    </button>
                  </div>
                )}

                {isRejecting && (
                  <div className="rejection-form animate-fade-in">
                    <textarea 
                      placeholder="Specify the reason for data invalidation..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                    <div className="admin-actions">
                      <button className="btn-reject" onClick={() => handleReject(selectedSubmission.id)}>Confirm Invalidation</button>
                      <button className="btn-cancel" onClick={() => setIsRejecting(false)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
