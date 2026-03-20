"use client";

import { useState } from 'react';
import Link from 'next/link';
import './home.css';

export default function Home() {
  const [activeMode, setActiveMode] = useState('contributor'); // 'contributor' or 'admin'

  return (
    <div className="home-container animate-fade-in">
      {/* Particle Background */}
      <div className="particle-container">
        <div className="particle-burst"></div>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-logo animate-fade-in">
          <div className="logo-symbol small">A</div>
          <span>Village Data Collection</span>
        </div>
        
        <h1>
          Experience liftoff with <br />
          India&apos;s Next-Gen Data
        </h1>
        <p>
          Collecting high-quality image + description pairs from rural India <br />
          to train the next generation of regional AI models.
        </p>

        {/* Mode Toggle */}
        <div className="mode-toggle-container">
          <div className="mode-toggle">
            <button 
              className={activeMode === 'contributor' ? 'active' : ''} 
              onClick={() => setActiveMode('contributor')}
            >
              Contributor
            </button>
            <button 
              className={activeMode === 'admin' ? 'active' : ''} 
              onClick={() => setActiveMode('admin')}
            >
              Admin
            </button>
            <div className={`mode-slider ${activeMode}`}></div>
          </div>
        </div>

        {/* Dynamic CTA */}
        <div className="cta-wrapper animate-fade-in" key={activeMode}>
          {activeMode === 'contributor' ? (
            <div className="mode-content">
              <h3>Bridge the regional AI gap</h3>
              <div className="btn-group">
                <Link href="/submit" className="btn-primary">
                  Start Contributing
                </Link>
                <Link href="#cases" className="btn-secondary">
                  Learn more
                </Link>
              </div>
            </div>
          ) : (
            <div className="mode-content">
              <h3>Validate ground-truth data</h3>
              <div className="btn-group">
                <Link href="/admin" className="btn-primary">
                  Access Dashboard
                </Link>
                <Link href="#metrics" className="btn-secondary">
                  View Metrics
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Feature Section inspired by Image 3 */}
      <section className="features-grid container">
        <div className="feature-card glass-card">
          <div className="feature-text">
            <h2>Data Accuracy First</h2>
            <p>Every submission is tagged with precise district metadata and GPS coordinates for model reliability.</p>
          </div>
          <div className="feature-visual code-preview">
            <div className="glow-circle red"></div>
            <pre>
              <code>{`{
  "state": "Bihar",
  "district": "Madhubani",
  "gps": [26.34, 86.07],
  "verified": true
}`}</code>
            </pre>
          </div>
        </div>
        
        <div className="feature-card glass-card reverse">
          <div className="feature-text">
            <h2>Seamless Review</h2>
            <p>Admin tools built for scale. Approve, reject, or request changes with one click from our dashboard.</p>
          </div>
          <div className="feature-visual dashboard-preview">
            <div className="glow-circle blue"></div>
            <div className="mock-ui">
              <div className="bar"></div>
              <div className="bar short"></div>
              <div className="dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
