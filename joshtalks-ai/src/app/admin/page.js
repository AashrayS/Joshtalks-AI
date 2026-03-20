"use client";

import { useState, useEffect } from 'react';
import statesData from '@/data/states-districts.json';
import './admin.css';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ state: '', district: '', status: '' });
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, this would be a server-side check. 
    // For MVP, we'll fetch one list with the password to verify it.
    fetchSubmissions(password);
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
    }
  }, [filters, isAuthenticated]);

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`/api/submission/${id}/approve`, {
        method: 'POST',
        headers: { 'x-admin-password': password }
      });
      if (response.ok) {
        setSelectedSubmission(null);
        fetchSubmissions();
      }
    } catch (err) {
      alert('Failed to approve');
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
      if (response.ok) {
        setIsRejecting(false);
        setRejectionReason('');
        setSelectedSubmission(null);
        fetchSubmissions();
      }
    } catch (err) {
      alert('Failed to reject');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container admin-login animate-fade-in">
        <div className="card login-card">
          <h1>Admin Dashboard</h1>
          <p>Please enter your access password</p>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="error-text">{error}</p>}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Verifying...' : 'Access Dashboard'}
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
          <h1>Admin Dashboard</h1>
          <span>{submissions.length} Submissions</span>
        </div>
        <div className="admin-filters">
          <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select value={filters.state} onChange={(e) => setFilters({...filters, state: e.target.value, district: ''})}>
            <option value="">All States</option>
            {Object.keys(statesData).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn-logout" onClick={() => setIsAuthenticated(false)}>Logout</button>
        </div>
      </header>

      {loading && <div className="loading-state">Updating data...</div>}

      <div className="submissions-grid">
        {submissions.map(sub => (
          <div key={sub.id} className="card sub-card" onClick={() => setSelectedSubmission(sub)}>
            <div className="sub-image">
              <img src={sub.image_url} alt="Submission" />
              <span className={`status-badge ${sub.status}`}>{sub.status}</span>
            </div>
            <div className="sub-info">
              <h3>{sub.district}, {sub.state}</h3>
              <p className="description-preview">{sub.description.substring(0, 100)}...</p>
              <span className="timestamp">{new Date(sub.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedSubmission && (
        <div className="modal-overlay" onClick={() => { setSelectedSubmission(null); setIsRejecting(false); }}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => { setSelectedSubmission(null); setIsRejecting(false); }}>×</button>
            <div className="modal-content">
              <div className="modal-image">
                <img src={selectedSubmission.image_url} alt="Full view" />
              </div>
              <div className="modal-details">
                <span className={`status-badge ${selectedSubmission.status}`}>{selectedSubmission.status}</span>
                <h2>{selectedSubmission.district}, {selectedSubmission.state}</h2>
                <div className="metadata-row">
                  <span>GPS: {selectedSubmission.gps_lat || 'N/A'}, {selectedSubmission.gps_lng || 'N/A'}</span>
                  <span>Date: {new Date(selectedSubmission.created_at).toLocaleString()}</span>
                </div>
                <p className="full-description">{selectedSubmission.description}</p>
                
                {selectedSubmission.status === 'rejected' && (
                  <div className="rejection-info">
                    <strong>Rejection Reason:</strong>
                    <p>{selectedSubmission.rejection_reason}</p>
                  </div>
                )}

                {selectedSubmission.status === 'pending' && !isRejecting && (
                  <div className="admin-actions">
                    <button className="btn-approve" onClick={() => handleApprove(selectedSubmission.id)}>Approve</button>
                    <button className="btn-reject" onClick={() => setIsRejecting(true)}>Reject</button>
                  </div>
                )}

                {isRejecting && (
                  <div className="rejection-form animate-fade-in">
                    <textarea 
                      placeholder="Reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                    <div className="admin-actions">
                      <button className="btn-reject" onClick={() => handleReject(selectedSubmission.id)}>Confirm Reject</button>
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
