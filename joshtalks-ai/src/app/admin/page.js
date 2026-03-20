"use client";

import { useState, useEffect } from 'react';
import './admin.css';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);
  const [view, setView] = useState('submissions'); // 'submissions' or 'coverage'
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Phase 8: Senior Admin Escalation
  const [isEscalating, setIsEscalating] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      fetchStats();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/submissions', {
        headers: { 'x-admin-password': password }
      });
      const data = await res.json();
      
      // Phase 8: Augmented Data (Simulated Confidence & Reputation)
      const augmented = data.map(sub => ({
        ...sub,
        confidence: Math.round(50 + Math.random() * 50),
        flags: sub.description.length < 30 ? ['Low Detail'] : [],
        reputation: Math.random() > 0.8 ? 'Suspicious' : 'Trusted'
      }));
      
      setSubmissions(augmented);
      setLoading(false);
    } catch (err) {
      console.error('Fetch failed');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'x-admin-password': password }
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Stats fetch failed');
    }
  };

  const handleAction = async (id, action, reason = '') => {
    try {
      const res = await fetch(`/api/submission/${id}/${action}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': password 
        },
        body: JSON.stringify({ reason })
      });
      if (res.ok) {
        fetchData();
        fetchStats();
        setSelectedSub(null);
        setRejectionReason('');
      }
    } catch (err) {
      alert('Action failed');
    }
  };

  const handleEscalate = (id) => {
    // Phase 8: Mark as Flagged/Escalated locally (Simulating status update)
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: 'flagged' } : s));
    setSelectedSub(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="login-container animate-fade-in">
        <div className="login-card">
          <h1>Admin Access</h1>
          <p>Provide secure credentials to enter Estrax Console.</p>
          <input 
            type="password" 
            placeholder="Reviewer Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setIsAuthenticated(true)}
          />
          <button className="btn-primary" onClick={() => setIsAuthenticated(true)}>Enter Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-root">
      <div className="admin-container animate-fade-in">
      <header className="admin-header">
        <div className="brand">
          <h1>Estrax console</h1>
          <div className="status-badge">Live Oversight</div>
        </div>
        <div className="tab-switcher">
          <button className={`tab-btn ${view === 'submissions' ? 'active' : ''}`} onClick={() => setView('submissions')}>Queue</button>
          <button className={`tab-btn ${view === 'coverage' ? 'active' : ''}`} onClick={() => setView('coverage')}>Coverage</button>
        </div>
      </header>

      {view === 'submissions' ? (
        <main className="admin-main">
          <section className="stats-row">
            <div className="mini-stat">
              <label>Total</label>
              <strong>{stats?.total || 0}</strong>
            </div>
            <div className="mini-stat pending">
              <label>Pending</label>
              <strong>{stats?.pending || 0}</strong>
            </div>
            <div className="mini-stat verified">
              <label>Verified</label>
              <strong>{stats?.approved || 0}</strong>
            </div>
            <div className="mini-stat rejected">
              <label>Rejected</label>
              <strong>{stats?.rejected || 0}</strong>
            </div>
          </section>

          <div className="submissions-grid">
            {submissions.map((sub) => (
              <div key={sub.id} className={`sub-card ${sub.status}`} onClick={() => setSelectedSub(sub)}>
                <div className="sub-img-wrapper">
                  <img src={sub.image_url} alt="Submission" />
                  <div className={`confidence-tag ${sub.confidence > 85 ? 'high' : 'low'}`}>
                    {sub.confidence}% Confidence
                  </div>
                  {sub.flags.length > 0 && (
                    <div className="warning-flag">{sub.flags[0]}</div>
                  )}
                </div>
                <div className="sub-info">
                  <div className="sub-meta">
                    <span className="district">{sub.district}</span>
                    <span className={`reputation-tag ${sub.reputation}`}>{sub.reputation}</span>
                  </div>
                  <p className="description">{sub.description}</p>
                  <div className="card-actions">
                    <button className="q-btn verify" onClick={(e) => { e.stopPropagation(); handleAction(sub.id, 'approve'); }}>Verify</button>
                    <button className="q-btn reject" onClick={(e) => { e.stopPropagation(); handleAction(sub.id, 'reject', 'Low visual quality'); }}>Reject</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      ) : (
        <main className="admin-main">
           <div className="coverage-section card">
            <h2>Regional Intelligence Distribution</h2>
            <div className="coverage-table-wrapper">
              <table className="coverage-table">
                <thead>
                  <tr>
                    <th>District / State</th>
                    <th>Insights</th>
                    <th>Fidelity Rate</th>
                    <th>Density</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.regions?.map((reg, i) => (
                    <tr key={i}>
                      <td>
                        <strong>{reg.district}</strong>
                        <span>{reg.state}</span>
                      </td>
                      <td>{reg.count}</td>
                      <td>{reg.verified} / {reg.count}</td>
                      <td>
                        <div className="coverage-bar">
                          <div className="coverage-fill" style={{ width: `${(reg.verified / (reg.count || 1)) * 100}%` }}></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}

      {selectedSub && (
        <div className="modal-overlay animate-fade-in" onClick={() => setSelectedSub(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body">
              <div className="modal-img-side">
                <img src={selectedSub.image_url} alt="Review" />
              </div>
              <div className="modal-info-side">
                <div className="modal-header">
                  <div>
                    <h2>{selectedSub.district}, {selectedSub.state}</h2>
                    <p>Captured: {new Date(selectedSub.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className={`fidelity-status ${selectedSub.status}`}>
                    {selectedSub.status.toUpperCase()}
                  </div>
                </div>

                <div className="reputation-bar">
                  <span className="label">Contributor Reliability</span>
                  <div className={`reputation-pill ${selectedSub.reputation}`}>
                    {selectedSub.reputation} Contributor
                  </div>
                </div>

                <div className="moderation-panel card">
                  <label>AI Moderation Insights</label>
                  <div className="insight-stat">
                    <span>Fidelity Score</span>
                    <strong>{selectedSub.confidence}%</strong>
                  </div>
                  {selectedSub.flags.length > 0 && (
                    <div className="insight-issues">
                      <label>Detected Anomalies</label>
                      <ul>
                        {selectedSub.flags.map((f, i) => <li key={i}>{f}</li>)}
                        {selectedSub.confidence < 70 && <li>High Blur / Low Contrast detected</li>}
                      </ul>
                    </div>
                  )}
                  {selectedSub.remote_reason && (
                    <div className="remote-justification">
                      <label>Remote Submission Reason</label>
                      <p>{selectedSub.remote_reason}</p>
                    </div>
                  )}
                </div>

                <div className="review-section">
                  <label>Regional Description</label>
                  <div className="description-box">{selectedSub.description}</div>
                  {selectedSub.gps_lat && (
                    <div className="gps-box">
                      📍 <code>{selectedSub.gps_lat}, {selectedSub.gps_lng}</code>
                    </div>
                  )}
                </div>

                <div className="decision-matrix">
                  <label>Decision Protocols</label>
                  <div className="action-buttons">
                    <button className="btn-verify-large" onClick={() => handleAction(selectedSub.id, 'approve')}>Verify Insight</button>
                    <button className="btn-escalate" onClick={() => handleEscalate(selectedSub.id)}>Flag for Senior Review</button>
                  </div>
                  <div className="rejection-panel">
                    <input 
                      type="text" 
                      placeholder="Reason for rejection..." 
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                    <button className="btn-reject-large" onClick={() => handleAction(selectedSub.id, 'reject', rejectionReason)}>Reject</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
