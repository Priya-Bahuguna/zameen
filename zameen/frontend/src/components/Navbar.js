import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const loc      = useLocation();
  const navigate = useNavigate();
  const [open, setOpen]   = useState(false);
  const [drop, setDrop]   = useState(false);

  const user  = JSON.parse(localStorage.getItem('zameenUser') || 'null');
  const is    = (p) => loc.pathname === p;

  const logout = () => {
    localStorage.removeItem('zameenToken');
    localStorage.removeItem('zameenUser');
    setDrop(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">

        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={() => setOpen(false)}>
          <div className="logo-box">Z</div>
          <div className="logo-text">
            <span className="logo-name">Zameen</span>
            <span className="logo-tag">Smart Property Intelligence</span>
          </div>
        </Link>

        {/* Links */}
        <div className={`nav-links ${open ? 'open' : ''}`}>
          <Link to="/"              className={`nav-link ${is('/') ? 'active' : ''}`}              onClick={() => setOpen(false)}>Home</Link>
          <Link to="/properties"    className={`nav-link ${is('/properties') ? 'active' : ''}`}    onClick={() => setOpen(false)}>Properties</Link>
          <Link to="/estimate"      className={`nav-link ${is('/estimate') ? 'active' : ''}`}      onClick={() => setOpen(false)}>AI Estimator</Link>
          <Link to="/price-history" className={`nav-link ${is('/price-history') ? 'active' : ''}`} onClick={() => setOpen(false)}>Price History</Link>
          <Link to="/area-ratings"  className={`nav-link ${is('/area-ratings') ? 'active' : ''}`}  onClick={() => setOpen(false)}>Area Ratings</Link>
          <Link to="/investment"    className={`nav-link ${is('/investment') ? 'active' : ''}`}    onClick={() => setOpen(false)}>Investment</Link>
          <Link to="/compare"       className={`nav-link ${is('/compare') ? 'active' : ''}`}       onClick={() => setOpen(false)}>Compare</Link>

          <div className="nav-actions">
            {user ? (
              <div className="user-menu" onMouseLeave={() => setDrop(false)}>
                <button className="user-btn" onClick={() => setDrop(!drop)}>
                  <div className="user-avatar">{user.name?.[0]?.toUpperCase()}</div>
                  <span>{user.name?.split(' ')[0]}</span>
                  <span className="chevron">{drop ? '▲' : '▼'}</span>
                </button>
                {drop && (
                  <div className="user-drop">
                    <Link to="/dashboard" onClick={() => { setDrop(false); setOpen(false); }}>📊 Dashboard</Link>
                    <Link to="/list"      onClick={() => { setDrop(false); setOpen(false); }}>➕ List Property</Link>
                    <button className="logout-btn" onClick={logout}>🚪 Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login"    className="btn-login"    onClick={() => setOpen(false)}>Login</Link>
                <Link to="/register" className="btn-register" onClick={() => setOpen(false)}>Register</Link>
              </>
            )}
            <Link to="/list" className="btn-list" onClick={() => setOpen(false)}>+ List Property</Link>
          </div>
        </div>

        {/* Burger */}
        <button className={`burger ${open ? 'open' : ''}`} onClick={() => setOpen(!open)} aria-label="menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
