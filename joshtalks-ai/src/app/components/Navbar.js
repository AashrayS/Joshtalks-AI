"use client";

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar glass-card">
      <div className="nav-container">
        <Link href="/" className="logo">
          <div className="logo-symbol">A</div>
          <strong>Village Data</strong>
        </Link>
        
        <div className="nav-links">
          <Link href="#product">Product</Link>
          <Link href="#cases">Use Cases</Link>
          <Link href="#pricing">Pricing</Link>
          <Link href="#blog">Blog</Link>
          <div className="nav-dropdown">
            <span>Resources ▾</span>
          </div>
        </div>
        
        <Link href="/submit" className="btn-primary btn-nav">
          Get Started
          <span className="arrow">→</span>
        </Link>
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 1200px;
          z-index: 1000;
          padding: 0.75rem 2rem;
          border-radius: 100px;
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.1rem;
          color: #000;
          font-weight: 700;
        }

        .logo-symbol {
          width: 32px;
          height: 32px;
          background: #000;
          color: #fff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          font-weight: 800;
        }

        .logo-symbol.small {
          width: 24px;
          height: 24px;
          font-size: 0.8rem;
          border-radius: 6px;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .nav-links a:hover, .nav-dropdown:hover {
          color: var(--primary-color);
        }

        .nav-dropdown {
          cursor: pointer;
        }

        .btn-nav {
          padding: 0.6rem 1.5rem;
          font-size: 0.9rem;
        }

        .arrow {
          margin-left: 0.25rem;
        }

        @media (max-width: 900px) {
          .nav-links {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}
