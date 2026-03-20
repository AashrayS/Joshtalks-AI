"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './home.css';

export default function Home() {
  const [activeMode, setActiveMode] = useState('contributor');
  const [typewriterText, setTypewriterText] = useState('');
  const fullText = "Experience liftoff with India's Next-Gen Data";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypewriterText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 5000 / fullText.length);
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
          <Link href="#solutions" className="btn-secondary">
            Explore use cases
          </Link>
        </div>
      </section>

      {/* Panoramic Icon Curve - DARK Section */}
      <section className="icon-curve-section dark-context animate-fade-in">
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

      {/* Mode Toggle - Light Section */}
      <section className="mode-section container">
        <div className="section-text centered">
          <h2 style={{ fontSize: '2.2rem', marginBottom: '3rem' }}>The Future of Collection</h2>
        </div>
        
        <div className="mode-toggle-wrapper">
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

        <div className="mode-display animate-fade-in" key={activeMode}>
          <div className="card mode-card glass-card">
            {activeMode === 'contributor' ? (
              <div className="mode-content">
                <h2>Join the rural data revolution</h2>
                <p>Help us bridge the regional AI gap by contributing high-quality imagery from your village.</p>
                <Link href="/submit" className="btn-primary">Get Started</Link>
              </div>
            ) : (
              <div className="mode-content">
                <h2>Validation at scale</h2>
                <p>Review and validate ground-truth data with our advanced administrative dashboard.</p>
                <Link href="/admin" className="btn-primary">Open Dashboard</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* High-Fidelity Editor Preview - DARK Section */}
      <section className="editor-preview-section dark-context">
        <div className="editor-window-container">
          <div className="editor-glow-backdrop"></div>
          <div className="editor-window">
            <aside className="editor-sidebar">
              <div className="sidebar-icon active">❏</div>
              <div className="sidebar-icon">⚬</div>
              <div className="sidebar-icon">▣</div>
              <div className="sidebar-icon">↺</div>
            </aside>
            <div className="editor-main">
              <div className="editor-header">
                <div className="editor-dots">
                  <span></span><span></span><span></span>
                </div>
                <div className="editor-tabs">
                  <div className="editor-tab">Implementation_plan.md</div>
                  <div className="editor-tab active">LoginButton.tsx 1</div>
                </div>
              </div>
              <div className="editor-breadcrumbs">
                app &gt; components &gt; LoginButton.tsx
              </div>
              <div className="editor-code-row">
                <div className="line-numbers">
                  1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9<br />10<br />11<br />12
                </div>
                <div className="code-field">
                  <span className="st-purple">import</span> Link <span className="st-purple">from</span> <span className="st-orange">'next/link'</span>;<br /><br />
                  <span className="st-purple">export default function</span> <span className="st-pink">LoginButton</span>(): <span className="st-blue">React.ReactElement</span><span className="st-bracket">{"{"}</span><br />
                  &nbsp;&nbsp;<span className="st-purple">return</span> (<br /><br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&lt;Link<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;href=<span className="st-orange">"/api/auth/strava/login"</span><br />
                  <span className="code-line-active">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;className=<span className="st-orange">"rounded-md bg-orange-500 px-4 py-2 font-semibold"</span>&gt;
                  </span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Login with Strava<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&lt;/Link&gt;<br />
                  &nbsp;&nbsp;);<br />
                  <span className="st-bracket">{"}"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="section-text">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>An AI IDE Core</h2>
          <p>Estrax's Editor view offers tab autocompletion, natural language code commands, and a configurable, and context-aware configurable agent.</p>
        </div>
      </section>
    </div>
  );
}
