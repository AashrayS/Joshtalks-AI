import Link from 'next/link';
import './home.css';

export default function Home() {
  return (
    <div className="container home-container animate-fade-in">
      <div className="hero">
        <h1>India Village Image Collection</h1>
        <p>
          Bridging the gap in AI model understanding with high-quality, district-aware visual data from rural India.
        </p>
        
        <div className="cta-group">
          <Link href="/submit" className="btn-primary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem' }}>
            Contributor Portal
          </Link>
          <Link href="/admin" className="btn-secondary">
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
