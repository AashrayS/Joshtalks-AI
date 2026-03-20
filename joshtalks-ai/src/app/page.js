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
          <div className="icon-bubble"><span className="symbol">✓</span></div>
          <div className="icon-bubble"><span className="symbol">⁝</span></div>
          <div className="icon-bubble"><span className="symbol">❏</span></div>
          <div className="icon-bubble"><span className="symbol">⚬</span></div>
          <div className="icon-bubble"><span className="symbol">⚀</span></div>
          <div className="icon-bubble active"><span className="symbol">立方</span></div>
          <div className="icon-bubble"><span className="symbol">↺</span></div>
          <div className="icon-bubble"><span className="symbol">↻</span></div>
          <div className="icon-bubble"><span className="symbol">▣</span></div>
          <div className="icon-bubble"><span className="symbol">▦</span></div>
          <div className="icon-bubble"><span className="symbol">◰</span></div>
        </div>
        <div className="section-text centered">
          <h2>An AI-First Ecosystem</h2>
          <p>Designed for high-fidelity regional data harvesting.</p>
        </div>
      </section>

      {/* Mode Toggle - Light Section */}
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

      {/* Editor Preview Section - DARK Section */}
      <section className="editor-preview-section dark-context">
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
                <code>
<span className="st-comment">// Estrax Data Protocol v1.0</span>{"\n"}
<span className="st-import">import</span> <span className="st-bracket">{"{"}</span> <span className="st-prop">Collector</span> <span className="st-bracket">{"}"}</span> <span className="st-import">from</span> <span className="st-string">"@estrax/core"</span>;{"\n\n"}
<span className="st-keyword">export default function</span> <span className="st-func">DataNode</span><span className="st-bracket">() {"{"}</span>{"\n"}
{"  "}<span className="st-keyword">const</span> <span className="st-prop">data</span> = <span className="st-prop">Collector</span>.<span className="st-func">useRegion</span><span className="st-bracket">(</span><span className="st-string">"Bihar"</span><span className="st-bracket">)</span>;{"\n"}
{"  "}
{"  "}<span className="st-keyword">return</span> <span className="st-bracket">(</span>{"\n"}
{"    "}<span className="st-bracket">&lt;</span><span className="st-keyword">div</span> <span className="st-prop">className</span>=<span className="st-string">"rounded-md bg-orange-500 p-4"</span><span className="st-bracket">&gt;</span>{"\n"}
{"      "}Regional Intelligence Active{"\n"}
{"    "}<span className="st-bracket">&lt;/</span><span className="st-keyword">div</span><span className="st-bracket">&gt;</span>{"\n"}
{"  "}<span className="st-bracket">)</span>;{"\n"}
<span className="st-bracket">{"}"}</span>
                </code>
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
