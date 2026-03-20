"use client";

import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="company" className="footer dark-context">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="logo">Estrax</Link>
            <p>Architecting India's Next-Gen Regional Intelligence Layer.</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Platform</h4>
              <Link href="#platform">Technology</Link>
              <Link href="#solutions">Solutions</Link>
              <Link href="/admin">Developer Console</Link>
            </div>
            <div className="link-group">
              <h4>Company</h4>
              <Link href="/">About</Link>
              <Link href="/">Careers</Link>
              <Link href="/">Contact</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Estrax AI Platform. All rights reserved.</p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: #000;
          color: #fff;
          padding: 8rem 0 4rem 0;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .footer-grid {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6rem;
        }
        .footer-brand .logo {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.05em;
          margin-bottom: 1.5rem;
          display: block;
        }
        .footer-brand p {
          color: rgba(255,255,255,0.5);
          font-size: 0.9rem;
          max-width: 300px;
          line-height: 1.6;
        }
        .footer-links {
          display: flex;
          gap: 6rem;
        }
        h4 {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 2rem;
          color: #fff;
        }
        .link-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .link-group :global(a) {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.5);
          transition: 0.3s;
        }
        .link-group :global(a:hover) {
          color: #fff;
        }
        .footer-bottom {
          padding-top: 4rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          text-align: center;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.3);
        }
        @media (max-width: 768px) {
          .footer-grid { flex-direction: column; gap: 4rem; }
          .footer-links { gap: 3rem; }
        }
      `}</style>
    </footer>
  );
}
