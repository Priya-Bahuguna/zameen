import { useState } from 'react';
import { LOCALITIES } from '../data/localData';
import './AreaRatings.css';

const CITIES  = ['Bangalore','Mumbai','Gurgaon','Hyderabad'];
const PARAMS  = [
  { key:'safetyScore',  label:'Safety',      icon:'🔒' },
  { key:'waterSupply',  label:'Water Supply', icon:'💧' },
  { key:'electricity',  label:'Electricity',  icon:'⚡' },
  { key:'transport',    label:'Transport',    icon:'🚌' },
  { key:'schools',      label:'Schools',      icon:'🏫' },
  { key:'hospitals',    label:'Hospitals',    icon:'🏥' },
  { key:'cleanliness',  label:'Cleanliness',  icon:'✨' },
  { key:'traffic',      label:'Traffic',      icon:'🚦' },
];

function barColor(v) {
  if (v >= 9) return '#16a34a';
  if (v >= 7) return '#2563eb';
  if (v >= 5) return '#f97316';
  return '#dc2626';
}

export default function AreaRatings() {
  const [city,     setCity]     = useState('Bangalore');
  const [selected, setSelected] = useState(null);

  const locs    = LOCALITIES.filter(l => l.city === city).sort((a,b) => b.areaRating - a.areaRating);
  const detail  = selected ? LOCALITIES.find(l => l.name === selected && l.city === city) : null;

  return (
    <div className="ar-page page-wrap">
      <h1 className="page-title">⭐ Area Ratings</h1>
      <p className="page-sub">Community-driven scores across 8 living quality parameters</p>

      <div className="city-pills" style={{marginBottom:28}}>
        {CITIES.map(c => (
          <button key={c} className={`city-pill ${city === c ? 'active' : ''}`} onClick={() => { setCity(c); setSelected(null); }}>{c}</button>
        ))}
      </div>

      <div className="ar-layout">
        {/* List */}
        <div className="ar-list">
          {locs.map((loc, i) => (
            <div key={i} className={`ar-row card ${selected === loc.name ? 'ar-active' : ''}`} onClick={() => setSelected(selected === loc.name ? null : loc.name)}>
              <div className="ar-rank">#{i+1}</div>
              <div className="ar-info">
                <div className="ar-name">{loc.name}</div>
                <div className="ar-sub">{loc.city} · {loc.zone}</div>
              </div>
              <div className="ar-score-col">
                <div className="ar-big-score" style={{color: barColor(loc.areaRating)}}>{loc.areaRating}</div>
                <div className="ar-score-label">/ 10</div>
              </div>
              <div className="ar-mini-bars">
                {PARAMS.slice(0,4).map(p => (
                  <div key={p.key} className="mini-bar-row">
                    <div className="bar-track" style={{width:80}}>
                      <div className="bar-fill" style={{width:`${loc[p.key]*10}%`, background: barColor(loc[p.key])}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div className="ar-detail">
          {!detail ? (
            <div className="card ar-empty">
              <div className="empty-icon">⭐</div>
              <h3>Select a Locality</h3>
              <p>Click any locality from the list to see detailed ratings for all 8 parameters.</p>
            </div>
          ) : (
            <div className="card ar-detail-card">
              <div className="ar-detail-head">
                <div>
                  <h2 className="ar-detail-name">{detail.name}</h2>
                  <div className="ar-detail-city">{detail.city}</div>
                </div>
                <div className="ar-detail-score" style={{color: barColor(detail.areaRating)}}>
                  {detail.areaRating}
                  <span>/10</span>
                </div>
              </div>

              <div className="params-grid">
                {PARAMS.map(p => (
                  <div key={p.key} className="param-row">
                    <div className="param-label">
                      <span>{p.icon}</span>
                      <span>{p.label}</span>
                    </div>
                    <div className="param-bar-wrap">
                      <div className="bar-track" style={{height:10, borderRadius:5}}>
                        <div className="bar-fill" style={{width:`${detail[p.key]*10}%`, background: barColor(detail[p.key]), height:'100%', borderRadius:5}} />
                      </div>
                    </div>
                    <div className="param-val" style={{color: barColor(detail[p.key])}}>{detail[p.key]}</div>
                  </div>
                ))}
              </div>

              <div className="ar-extra-stats">
                <div className="extra-stat">
                  <div className="extra-val">{detail.avgPricePerSqft?.toLocaleString('en-IN')}</div>
                  <div className="extra-lbl">₹/sqft</div>
                </div>
                <div className="extra-stat">
                  <div className="extra-val">{detail.investmentScore}</div>
                  <div className="extra-lbl">Inv. Score</div>
                </div>
                <div className="extra-stat">
                  <div className="extra-val">+{detail.growth5Y}%</div>
                  <div className="extra-lbl">5Y Growth</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
