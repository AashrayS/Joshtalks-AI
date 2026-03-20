"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './home.css';

export default function Home() {
  const [typewriterText, setTypewriterText] = useState('');
  const fullText = "Experience liftoff with India's Next-Gen Data";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypewriterText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 2000 / fullText.length);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="brand-badge animate-fade-in">Estrax Platform</div>
        
        <h1 className="typewriter-h1">
          {typewriterText}
          <span className="typewriter-cursor"></span>
        </h1>
        
        <p className="hero-subtext animate-fade-in">
          Estrax is our agentic data platform, evolving regional intelligence <br />
          into the agent-first era.
        </p>

        <div className="btn-group animate-fade-in">
          <Link href="/submit" className="btn-primary">
            Start Contributing
          </Link>
          <Link href="#future" className="btn-primary secondary-style">
            Explore use cases
          </Link>
        </div>
      </section>

      {/* Panoramic Icon Curve - DARK Section */}
      <section id="platform" className="icon-curve-section dark-context animate-fade-in">
        <div className="icon-curve-container">
          {[
            {s: "✓", a: false}, {s: "⁝", a: false}, {s: "❏", a: false}, 
            {s: "⚬", a: false}, {s: "⚀", a: false}, {s: "立方", a: true}, 
            {s: "↺", a: false}, {s: "↻", a: false}, {s: "▣", a: false}, 
            {s: "▦", a: false}, {s: "◰", a: false}
          ].map((item, idx) => (
            <div key={idx} className={`icon-bubble ${item.a ? 'active' : ''}`}>
              <span className="symbol">{item.s}</span>
            </div>
          ))}
        </div>
        <div className="section-text centered">
          <h2>An AI-First Ecosystem</h2>
          <p>Designed for high-fidelity regional data harvesting.</p>
        </div>
      </section>

      {/* Mode Section - Direct Join */}
      <section id="future" className="mode-section container">
        <div className="section-text centered">
          <h2>The Future of Collection</h2>
        </div>
        
        <div className="mode-grid animate-fade-in">
          <div className="mode-card glass-card">
            <h3>Contributor</h3>
            <p>Join the rural data revolution. Bridge the AI gap by contributing high-quality regional imagery.</p>
            <Link href="/submit" className="btn-primary">Start Contributing</Link>
          </div>

          <div className="mode-card glass-card">
            <h3>Administrator</h3>
            <p>Validation at scale. Review and validate ground-truth data with our advanced dashboard.</p>
            <Link href="/admin" className="btn-primary">Open Dashboard</Link>
          </div>
        </div>
      </section>

      {/* Regional Intelligence Core - DARK Section */}
      <section id="solutions" className="editor-preview-section dark-context">
        <div className="editor-window-container">
          <div className="editor-glow-backdrop"></div>
          <div className="editor-window">
            <aside className="editor-sidebar">
              <div className="sidebar-icon active">📊</div>
              <div className="sidebar-icon">📍</div>
              <div className="sidebar-icon">🛡️</div>
              <div className="sidebar-icon">⚙️</div>
            </aside>
            <div className="editor-main">
              <div className="editor-header">
                <div className="editor-dots">
                  <span></span><span></span><span></span>
                </div>
                <div className="editor-tabs">
                  <div className="editor-tab">metadata_stream.log</div>
                  <div className="editor-tab active">regional_insight.json</div>
                </div>
              </div>
              <div className="editor-breadcrumbs">
                estax &gt; intelligence &gt; regional_insight.json
              </div>
              <div className="editor-code-row">
                <div className="line-numbers">
                  1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9<br />10<br />11<br />12<br />13
                </div>
                <div className="code-field">
                  <span className="st-bracket">{"{"}</span><br />
                  &nbsp;&nbsp;<span className="st-pink">"region"</span>: <span className="st-orange">"North Rural Delta"</span>,<br />
                  &nbsp;&nbsp;<span className="st-pink">"village_id"</span>: <span className="st-orange">"ESTX-77LK"</span>,<br />
                  &nbsp;&nbsp;<span className="st-pink">"metadata"</span>: <span className="st-bracket">{"{"}</span><br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="st-pink">"gps"</span>: <span className="st-orange">"28.6139° N, 77.2090° E"</span>,<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="st-pink">"confidence"</span>: <span className="st-blue">0.985</span>,<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="st-pink">"validation_status"</span>: <span className="st-orange">"VERIFIED"</span><br />
                  &nbsp;&nbsp;<span className="st-bracket">{"}"}</span>,<br />
                  <span className="code-line-active">
                  &nbsp;&nbsp;<span className="st-pink">"agent_insight"</span>: <span className="st-orange">"High-fidelity crop data detected. Proceeding to tagging."</span>
                  </span><br />
                  &nbsp;&nbsp;<span className="st-pink">"timestamp"</span>: <span className="st-orange">"2026-03-20T17:16:05Z"</span><br />
                  <span className="st-bracket">{"}"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="section-text">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Regional Data Core</h2>
          <p>Estrax processes decentralized regional data in real-time. Our agentic pipeline validates ground-truth imagery, tags metadata with high confidence, and generates actionable intelligence for the next generation of AI.</p>
        </div>
      </section>
    </div>
  );
}
