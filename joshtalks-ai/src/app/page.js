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
    }, 5000 / fullText.length); // 5 seconds for full text
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

      {/* Icon Curve Section (Image 1 inspiraton) */}
      <section className="icon-curve-section animate-fade-in">
        <div className="icon-curve-container">
          <div className="icon-bubble"><span className="symbol">✓</span></div>
          <div className="icon-bubble"><span className="symbol">⁝</span></div>
          <div className="icon-bubble"><span className="symbol">❏</span></div>
          <div className="icon-bubble"><span className="symbol">⚬</span></div>
          <div className="icon-bubble active"><span className="symbol">立方</span></div>
          <div className="icon-bubble"><span className="symbol">↻</span></div>
          <div className="icon-bubble"><span className="symbol">▣</span></div>
        </div>
        <div className="section-text centered">
          <h2>An AI-First Ecosystem</h2>
          <p>Designed for high-fidelity regional data harvesting.</p>
        </div>
      </section>

      {/* Mode Toggle */}
      <section className="mode-section container">
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

      {/* Editor Preview Section (Image 2 inspiration) */}
      <section className="editor-preview-section container">
        <div className="editor-glow-container">
          <div className="glow glow-red"></div>
          <div className="glow glow-blue"></div>
          <div className="editor-window glass-card">
            <div className="editor-header">
              <div className="editor-dots"><span></span><span></span><span></span></div>
              <div className="editor-tab">Implementation_plan.md</div>
            </div>
            <div className="editor-content">
              <pre>
                <code>{`// Estrax Data Protocol v1.0
import { Collector } from "@estrax/core";

export default function DataNode() {
  const data = Collector.useRegion("Bihar");
  
  return (
    <div className="rounded-md bg-orange-500 p-4">
      Regional Intelligence Active
    </div>
  );
}`}</code>
              </pre>
            </div>
          </div>
        </div>
        <div className="section-text">
          <h2>Precision Core</h2>
          <p>Estrax offers tab autocompletion, natural language commands, and a context-aware configurable agent.</p>
        </div>
      </section>
    </div>
  );
}
