"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDarkContext, setIsDarkContext] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide/Show logic
      // Only show on scroll-up IF we are near the top (within 200px)
      // Otherwise, keep it hidden while scrolling down or halfway
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY && currentScrollY < 200) {
        setIsVisible(true);
      } else if (currentScrollY <= 0) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);

      // Adaptive color logic
      const darkSections = document.querySelectorAll('.dark-context');
      let found = false;
      darkSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 50 && rect.bottom >= 50) {
          found = true;
        }
      });
      setIsDarkContext(found);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`navbar ${isVisible ? 'visible' : 'hidden'} ${isDarkContext ? 'is-dark-context' : ''}`}>
      <div className="nav-container">
        <Link href="/" className="logo">
          <strong>Estrax</strong>
        </Link>
        
        <div className="nav-links">
          <Link href="/#platform">Platform</Link>
          <Link href="/#solutions">Solutions</Link>
          <Link href="/#company">Company</Link>
        </div>
        
        <Link href="/submit" className="btn-nav">
          Get Started
        </Link>
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s, color 0.4s;
          padding: 1.5rem 0;
        }

        .navbar.hidden {
          transform: translateY(-100%);
          opacity: 0;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
        }

        .logo {
          font-size: 1.15rem;
          color: #000;
          font-weight: 700;
          letter-spacing: -0.03em;
          transition: color 0.4s;
        }

        .nav-links {
          display: flex;
          gap: 3rem;
          align-items: center;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: color 0.4s;
        }

        .nav-links a:hover {
          color: #000;
        }

        .btn-nav {
          font-size: 0.9rem;
          font-weight: 600;
          color: #000;
          border: 1px solid var(--border);
          padding: 0.5rem 1.25rem;
          border-radius: 100px;
          transition: all 0.4s;
        }

        .btn-nav:hover {
          background: #000;
          color: #fff;
          border-color: #000;
        }

        /* Dark Context Styles */
        .is-dark-context .logo { color: #fff; }
        .is-dark-context .nav-links { color: rgba(255, 255, 255, 0.6); }
        .is-dark-context .nav-links a:hover { color: #fff; }
        .is-dark-context .btn-nav { 
          color: #fff; 
          border-color: rgba(255, 255, 255, 0.1); 
        }
        .is-dark-context .btn-nav:hover {
          background: #fff;
          color: #000;
          border-color: #fff;
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
