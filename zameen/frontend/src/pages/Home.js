import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PROPERTIES } from '../data/localData';
import PropertyCard from '../components/PropertyCard';
import './Home.css';

const CITIES = ['Bangalore', 'Mumbai', 'Gurgaon', 'Hyderabad'];

const FEATURES = [
  { icon:'🤖', title:'AI Price Estimator',    desc:'Instant AI-powered property valuations with confidence score — no API key, 100% free.' },
  { icon:'📊', title:'Price History Analytics', desc:'5-year price trends for any locality. Know if a price is fair before you buy or rent.' },
  { icon:'✅', title:'Verified Listings',       desc:'Every listing manually verified. No duplicates, no fake ads, no paid promotions.' },
  { icon:'⭐', title:'Area Ratings',            desc:'Community-driven scores for safety, transport, schools, hospitals and 5 more parameters.' },
  { icon:'📈', title:'Investment Score',        desc:'AI-calculated 0–100 score based on rental yield, growth rate and infrastructure data.' },
  { icon:'🔍', title:'Locality Comparison',     desc:'Compare 2–3 areas side by side — price, growth, yield, rating and investment score.' },
];

const STATS = [
  { n:'15,000+', l:'Verified Listings' },
  { n:'4',       l:'Major Cities' },
  { n:'₹0',      l:'Platform Cost' },
  { n:'8+',      l:'Intelligence Parameters' },
];

export default function Home() {
  const [query, setQuery]   = useState('');
  const [error, setError]   = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) { setError('Please enter a city name'); return; }
    const ok = CITIES.some(c => c.toLowerCase() === query.toLowerCase());
    if (!ok) { setError(`Try: ${CITIES.join(', ')}`); return; }
    setError('');
    navigate(`/properties?city=${query}`);
  };

  const featured = PROPERTIES.slice(0, 6);

  return (
    <div className="home">

      {/* ── Hero ─────────────────────────────── */}
      <section className="hero">
        <div className="hero-content fade-up">
          <div className="hero-tag">🏆 India's #1 Smart Property Intelligence Platform</div>
          <h1 className="hero-h1">
            <span className="h1-white">Smart Property</span>
            <span className="h1-green">Intelligence Platform</span>
          </h1>
          <p className="hero-desc">
            AI-powered price estimates, transparent market trends, and verified listings.
            Make data-driven property decisions.
          </p>

          <div className="hero-search">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              value={query}
              onChange={e => { setQuery(e.target.value); setError(''); }}
              placeholder="Enter city name — Bangalore, Mumbai, Gurgaon, Hyderabad"
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-btn" onClick={handleSearch}>Search</button>
          </div>
          {error && <p className="search-error">⚠ {error}</p>}

          <div className="city-pills">
            {CITIES.map(c => (
              <button key={c} className="city-pill" onClick={() => navigate(`/properties?city=${c}`)}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="hero-img-wrap">
          <img
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=580&auto=format&fit=crop"
            alt="Property"
            className="hero-img"
          />
          <div className="hero-badge">
            <span className="live-dot" /><span>Live Market Data</span>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────── */}
      <div className="stats-bar">
        {STATS.map((s, i) => (
          <div key={i} className="stat-item">
            <div className="stat-num">{s.n}</div>
            <div className="stat-lbl">{s.l}</div>
          </div>
        ))}
      </div>

      {/* ── Why choose ───────────────────────── */}
      <section className="why-section page-wrap">
        <div className="section-head">
          <h2 className="page-title">Why Choose Zameen?</h2>
          <p className="page-sub">We combine technology with transparency for data-driven property insights</p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card card fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Properties ───────────────── */}
      <section className="featured-section">
        <div className="page-wrap">
          <div className="featured-head">
            <div>
              <h2 className="page-title">Featured Properties</h2>
              <p className="page-sub">Hand-picked listings across India's top cities</p>
            </div>
            <Link to="/properties" className="btn-outline">View All →</Link>
          </div>
          <div className="grid-2">
            {featured.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        </div>
      </section>

      {/* ── Tools row ────────────────────────── */}
      <section className="tools-section page-wrap">
        <h2 className="section-title">Intelligence Tools</h2>
        <div className="tools-grid">
          {[
            { icon:'📊', title:'Price History',   desc:'5-year trends',     link:'/price-history' },
            { icon:'⭐', title:'Area Ratings',    desc:'8-parameter scores', link:'/area-ratings' },
            { icon:'📈', title:'Investment Score',desc:'AI analytics',       link:'/investment' },
            { icon:'🔍', title:'Compare Areas',   desc:'Side-by-side',       link:'/compare' },
          ].map((t, i) => (
            <Link key={i} to={t.link} className="tool-card card">
              <span className="tool-icon">{t.icon}</span>
              <div>
                <div className="tool-title">{t.title}</div>
                <div className="tool-desc">{t.desc}</div>
              </div>
              <span className="tool-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────── */}
      <section className="cta-banner">
        <h2>Ready to Find Your Dream Property?</h2>
        <p>Join thousands of Zameen users making data-driven decisions</p>
        <div className="cta-btns">
          <Link to="/properties" className="cta-primary">Browse Properties</Link>
          <Link to="/estimate"   className="cta-secondary">Estimate Price with AI</Link>
        </div>
      </section>

    </div>
  );
}
