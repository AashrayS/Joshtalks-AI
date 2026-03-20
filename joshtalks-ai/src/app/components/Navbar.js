"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`navbar ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="nav-container glass-card">
        <Link href="/" className="logo">
          <strong>Estrax</strong>
        </Link>
        
        <div className="nav-links">
          <Link href="#platform">Platform</Link>
          <Link href="#solutions">Solutions</Link>
          <Link href="#company">Company</Link>
        </div>
        
        <Link href="/submit" className="btn-nav">
          Get Started
        </Link>
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 1000px;
          z-index: 1000;
          transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s;
        }

        .navbar.hidden {
          transform: translate(-50%, -100%);
          opacity: 0;
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 2rem;
          border-radius: 100px;
        }

        .logo {
          font-size: 1.25rem;
          color: #000;
          letter-spacing: -0.02em;
        }

        .nav-links {
          display: flex;
          gap: 2.5rem;
          align-items: center;
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .nav-links a {
          transition: color 0.3s;
        }

        .nav-links a:hover {
          color: #000;
        }

        .btn-nav {
          background: #000;
          color: #fff;
          padding: 0.6rem 1.5rem;
          border-radius: 100px;
          font-size: 0.9rem;
          font-weight: 600;
          transition: transform 0.3s;
        }

        .btn-nav:hover {
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}
