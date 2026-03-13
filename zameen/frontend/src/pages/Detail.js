import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PROPERTIES } from '../data/localData';
import BarChart from '../components/BarChart';
import PropertyCard from '../components/PropertyCard';
import { formatPrice, scoreColor, scoreLabel } from '../utils/helpers';
import './Detail.css';

export default function Detail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [imgIdx, setImgIdx] = useState(0);
  const [showContact, setShowContact] = useState(false);

  const prop = PROPERTIES.find(p => p.id === parseInt(id));
  if (!prop) return (
    <div className="page-wrap empty-state">
      <div className="empty-icon">🏠</div>
      <h3>Property not found</h3>
      <button className="btn-green" onClick={() => navigate('/properties')} style={{marginTop:16}}>Back to Browse</button>
    </div>
  );

  const { title, price, city, location, bhk, area, description, amenities,
          contact, ownerName, totalFloors, floor, age, furnished, facing,
          possession, pricePerSqft, rentalYield, investmentScore, areaRating,
          priceHistory, image, type, verified } = prop;

  const images  = prop.images && prop.images.length ? prop.images : [image];
  const similar = PROPERTIES.filter(p => p.city === city && p.id !== parseInt(id)).slice(0, 3);

  return (
    <div className="detail-page page-wrap">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/properties">Properties</Link> / <span>{title}</span>
      </div>

      <div className="detail-layout">

        {/* ── LEFT ─────────────────────────── */}
        <div className="detail-left">

          {/* Image gallery */}
          <div className="img-main-wrap">
            <img src={images[imgIdx] || image} alt={title} className="img-main" />
            <span className={`type-badge ${type}`}>{type === 'buy' ? 'For Sale' : 'For Rent'}</span>
            {verified && <span className="ver-badge">✓ Verified</span>}
          </div>
          {images.length > 1 && (
            <div className="thumb-row">
              {images.map((img, i) => (
                <img key={i} src={img} alt="" className={`thumb ${i === imgIdx ? 'active' : ''}`} onClick={() => setImgIdx(i)} />
              ))}
            </div>
          )}

          {/* Title + price */}
          <div className="title-row">
            <div>
              <h1 className="det-title">{title}</h1>
              <p className="det-loc">📍 {location}, {city}</p>
            </div>
            <div className="price-block">
              <div className="big-price">{formatPrice(price, type)}</div>
              <div className="price-psf">₹{(pricePerSqft || Math.round(price/area)).toLocaleString('en-IN')}/sqft</div>
            </div>
          </div>

          {/* Specs grid */}
          <div className="specs-grid">
            {[
              ['BHK',       `${bhk} BHK`],
              ['Area',      `${area} sqft`],
              ['Floor',     `${floor} of ${totalFloors}`],
              ['Age',       `${age} yrs`],
              ['Furnished', furnished],
              ['Facing',    facing],
              ['Possession',possession],
              ['City',      city],
            ].map(([l, v], i) => (
              <div key={i} className="spec-box">
                <div className="spec-label">{l}</div>
                <div className="spec-val">{v}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="det-section">
            <h2 className="section-title">About This Property</h2>
            <p className="det-desc">{description}</p>
          </div>

          {/* Amenities */}
          <div className="det-section">
            <h2 className="section-title">Amenities</h2>
            <div className="amenities">
              {(amenities || []).map((a, i) => <span key={i} className="amenity">✓ {a}</span>)}
            </div>
          </div>

          {/* Price history chart */}
          <div className="det-section">
            <h2 className="section-title">📊 Price History</h2>
            <BarChart data={priceHistory} color="#16a34a" height={140} />
          </div>

          {/* Similar */}
          {similar.length > 0 && (
            <div className="det-section">
              <h2 className="section-title">Similar in {city}</h2>
              <div className="similar-grid">
                {similar.map(p => <PropertyCard key={p.id} property={p} />)}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT ────────────────────────── */}
        <div className="detail-right">

          {/* Contact card */}
          <div className="contact-card card">
            <div className="owner-row">
              <div className="owner-avatar">{ownerName?.[0]}</div>
              <div>
                <div className="owner-name">{ownerName}</div>
                <div className="owner-lbl">Property Owner</div>
              </div>
            </div>
            {!showContact ? (
              <button className="btn-green" style={{width:'100%',justifyContent:'center',marginBottom:10}} onClick={() => setShowContact(true)}>
                📞 Show Contact
              </button>
            ) : (
              <div className="contact-reveal">
                <a href={`tel:${contact}`}   className="contact-btn call-btn">📞 {contact}</a>
                <a href={`https://wa.me/91${contact}?text=Hi, I am interested in: ${title}`} target="_blank" rel="noopener noreferrer" className="contact-btn wa-btn">💬 WhatsApp</a>
              </div>
            )}
          </div>

          {/* Intelligence card */}
          <div className="score-card card">
            <h3>🧠 Property Intelligence</h3>
            <div className="scores-row">
              <div className="score-item">
                <svg width="72" height="72" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r="28" fill="none" stroke="#f1f5f9" strokeWidth="7"/>
                  <circle cx="36" cy="36" r="28" fill="none" stroke={scoreColor(investmentScore||75)} strokeWidth="7"
                    strokeDasharray={`${(investmentScore||75)/100*175.9} 175.9`} strokeLinecap="round" transform="rotate(-90 36 36)"/>
                </svg>
                <div className="score-num" style={{color:scoreColor(investmentScore||75)}}>{investmentScore||75}</div>
                <div className="score-lbl">Investment Score</div>
                <div className="score-tag" style={{color:scoreColor(investmentScore||75)}}>{scoreLabel(investmentScore||75)}</div>
              </div>
              <div className="score-item">
                <svg width="72" height="72" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r="28" fill="none" stroke="#f1f5f9" strokeWidth="7"/>
                  <circle cx="36" cy="36" r="28" fill="none" stroke="#2563eb" strokeWidth="7"
                    strokeDasharray={`${(areaRating||8)/10*175.9} 175.9`} strokeLinecap="round" transform="rotate(-90 36 36)"/>
                </svg>
                <div className="score-num" style={{color:'#2563eb'}}>{((areaRating||8)*10).toFixed(0)}</div>
                <div className="score-lbl">Area Rating</div>
                <div className="score-tag" style={{color:'#2563eb'}}>{areaRating||8}/10</div>
              </div>
            </div>
            <div className="yields-row">
              <div className="yield-item">
                <div className="yield-val">{rentalYield||3.5}%</div>
                <div className="yield-lbl">Rental Yield</div>
              </div>
              <div className="yield-item">
                <div className="yield-val">₹{(pricePerSqft||Math.round(price/area)).toLocaleString('en-IN')}</div>
                <div className="yield-lbl">Per Sqft</div>
              </div>
            </div>
          </div>

          {/* AI Analysis card */}
          <div className="ai-card card">
            <h3>🤖 AI Analysis</h3>
            <div className="ai-row"><span>Market Value</span><strong>{formatPrice(price,type)}</strong></div>
            {type === 'buy' && <div className="ai-row"><span>5-Year Projection</span><strong style={{color:'#16a34a'}}>{formatPrice(Math.round(price*1.48))}</strong></div>}
            <div className="ai-row"><span>Possession</span><strong>{possession}</strong></div>
            <div className="ai-row"><span>Fraud Check</span><strong style={{color:'#16a34a'}}>✓ Clean</strong></div>
            <Link to="/estimate" className="ai-link">Get AI Estimate for similar →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
