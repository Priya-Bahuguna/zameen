import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PROPERTIES } from '../data/localData';
import { formatPrice } from '../utils/helpers';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [tab,  setTab]  = useState('overview');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem('zameenUser');
    if (!u) { navigate('/login'); return; }
    setUser(JSON.parse(u));
  }, [navigate]);

  if (!user) return null;

  // Demo data
  const saved    = PROPERTIES.slice(0, 3);
  const myListings = PROPERTIES.slice(3, 6).map(p => ({ ...p, ownerName: user.name }));
  const inquiries = [
    { id:1, property:'Spacious 3BHK in Electronic City', from:'Rahul Kumar', phone:'9876543210', date:'2025-01-20', status:'pending', message:'Interested in site visit this weekend.' },
    { id:2, property:'Cozy 2BHK for Rent in Indiranagar', from:'Priya Singh', phone:'9876543211', date:'2025-01-18', status:'confirmed', message:'Can we schedule a call?' },
  ];

  const stats = [
    { icon:'🏠', label:'Saved Properties', val: saved.length },
    { icon:'📋', label:'My Listings', val: myListings.length },
    { icon:'📨', label:'Inquiries', val: inquiries.length },
    { icon:'✅', label:'Deals Closed', val: 1 },
  ];

  return (
    <div className="dash-page page-wrap">
      {/* Header */}
      <div className="dash-header">
        <div className="dash-welcome">
          <div className="dash-avatar">{user.name?.[0]?.toUpperCase()}</div>
          <div>
            <h1 className="dash-name">Welcome, {user.name?.split(' ')[0]}!</h1>
            <div className="dash-meta">{user.email} · <span className="role-chip">{user.role}</span></div>
          </div>
        </div>
        <div className="dash-header-btns">
          <Link to="/list" className="btn-green">+ List Property</Link>
          <button className="btn-outline" onClick={() => { localStorage.removeItem('zameenToken'); localStorage.removeItem('zameenUser'); navigate('/'); }}>Logout</button>
        </div>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        {stats.map((s, i) => (
          <div key={i} className="dash-stat card">
            <div className="dash-stat-icon">{s.icon}</div>
            <div className="dash-stat-val">{s.val}</div>
            <div className="dash-stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs-bar" style={{marginBottom:22}}>
        {[['overview','📊 Overview'],['saved','❤️ Saved'],['listings','🏠 My Listings'],['inquiries','📨 Inquiries']].map(([t,l]) => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{l}</button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="overview-grid">
          <div className="card overview-section">
            <h3 className="section-title">Recent Saved Properties</h3>
            <div className="dash-prop-list">
              {saved.slice(0,3).map(p => (
                <Link key={p.id} to={`/property/${p.id}`} className="dash-prop-row">
                  <img src={p.image} alt={p.title} className="dash-prop-img" />
                  <div className="dash-prop-info">
                    <div className="dash-prop-title">{p.title}</div>
                    <div className="dash-prop-meta">📍 {p.location} · {p.bhk}BHK</div>
                  </div>
                  <div className="dash-prop-price">{formatPrice(p.price, p.type)}</div>
                </Link>
              ))}
            </div>
            <Link to="/properties" className="view-all-link">View all properties →</Link>
          </div>
          <div className="card overview-section">
            <h3 className="section-title">Quick Tools</h3>
            <div className="quick-tools">
              {[
                { icon:'🤖', label:'AI Estimator', link:'/estimate' },
                { icon:'📊', label:'Price History', link:'/price-history' },
                { icon:'⭐', label:'Area Ratings',  link:'/area-ratings' },
                { icon:'📈', label:'Investment',    link:'/investment' },
                { icon:'🔍', label:'Compare Areas', link:'/compare' },
                { icon:'➕', label:'List Property', link:'/list' },
              ].map((t, i) => (
                <Link key={i} to={t.link} className="quick-tool">
                  <span>{t.icon}</span><span>{t.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Saved */}
      {tab === 'saved' && (
        <div>
          <h2 className="section-title">❤️ Saved Properties ({saved.length})</h2>
          <div className="grid-2">
            {saved.map(p => (
              <div key={p.id} className="card dash-saved-card">
                <img src={p.image} alt={p.title} className="saved-img" />
                <div className="saved-body">
                  <div className="saved-title">{p.title}</div>
                  <div className="saved-meta">📍 {p.location}, {p.city} · {p.bhk}BHK · {p.area}sqft</div>
                  <div className="saved-price">{formatPrice(p.price, p.type)}</div>
                  <div className="saved-actions">
                    <Link to={`/property/${p.id}`} className="btn-green" style={{fontSize:12,padding:'7px 14px'}}>View</Link>
                    <button className="btn-outline" style={{fontSize:12,padding:'6px 14px',color:'#dc2626',borderColor:'#dc2626'}}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Listings */}
      {tab === 'listings' && (
        <div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
            <h2 className="section-title">🏠 My Listings ({myListings.length})</h2>
            <Link to="/list" className="btn-green" style={{fontSize:13}}>+ Add New</Link>
          </div>
          <div className="listing-table card">
            <table className="dash-table">
              <thead><tr><th>Property</th><th>Type</th><th>Price</th><th>Status</th><th>Views</th><th>Action</th></tr></thead>
              <tbody>
                {myListings.map(p => (
                  <tr key={p.id}>
                    <td><div className="listing-name">{p.title}</div><div style={{fontSize:11,color:'#64748b'}}>📍 {p.location}</div></td>
                    <td><span className={p.type === 'buy' ? 'badge-buy' : 'badge-rent'}>{p.type}</span></td>
                    <td style={{fontWeight:700,color:'#16a34a'}}>{formatPrice(p.price, p.type)}</td>
                    <td><span className="status-active">Active</span></td>
                    <td style={{color:'#64748b'}}>{p.views || 0}</td>
                    <td><Link to={`/property/${p.id}`} style={{color:'#16a34a',fontSize:13,fontWeight:600}}>View →</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inquiries */}
      {tab === 'inquiries' && (
        <div>
          <h2 className="section-title">📨 Inquiries ({inquiries.length})</h2>
          <div className="inq-list">
            {inquiries.map(inq => (
              <div key={inq.id} className="inq-card card">
                <div className="inq-top">
                  <div>
                    <div className="inq-property">{inq.property}</div>
                    <div className="inq-from">From: <strong>{inq.from}</strong> · 📞 {inq.phone}</div>
                    <div className="inq-date">{inq.date}</div>
                  </div>
                  <span className={`inq-status ${inq.status}`}>{inq.status}</span>
                </div>
                <div className="inq-message">"{inq.message}"</div>
                <div className="inq-actions">
                  <a href={`tel:${inq.phone}`} className="btn-green" style={{fontSize:12,padding:'7px 14px'}}>📞 Call</a>
                  <a href={`https://wa.me/91${inq.phone}`} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{fontSize:12,padding:'6px 14px',color:'#16a34a',borderColor:'#16a34a'}}>💬 WhatsApp</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
