import { useState } from 'react';
import { LOCALITIES } from '../data/localData';
import { scoreColor, scoreLabel, growthColor, formatPriceShort } from '../utils/helpers';
import './Investment.css';

const CITIES = ['Bangalore','Mumbai','Gurgaon','Hyderabad'];

export default function Investment() {
  const [city, setCity] = useState('Bangalore');
  const [sort, setSort] = useState('score');

  let locs = LOCALITIES.filter(l => l.city === city);
  if (sort === 'score')   locs = [...locs].sort((a,b) => b.investmentScore - a.investmentScore);
  if (sort === 'yield')   locs = [...locs].sort((a,b) => b.rentalYield - a.rentalYield);
  if (sort === 'growth')  locs = [...locs].sort((a,b) => b.growth5Y - a.growth5Y);
  if (sort === 'rating')  locs = [...locs].sort((a,b) => b.areaRating - a.areaRating);

  return (
    <div className="inv-page page-wrap">
      <h1 className="page-title">📈 Investment Intelligence</h1>
      <p className="page-sub">AI-calculated investment scores based on yield, growth rate and infrastructure</p>

      <div className="inv-controls">
        <div className="city-pills">
          {CITIES.map(c => (
            <button key={c} className={`city-pill ${city === c ? 'active' : ''}`} onClick={() => setCity(c)}>{c}</button>
          ))}
        </div>
        <select className="form-control sort-drop" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="score">Sort: Investment Score</option>
          <option value="yield">Sort: Rental Yield</option>
          <option value="growth">Sort: 5Y Growth</option>
          <option value="rating">Sort: Area Rating</option>
        </select>
      </div>

      {/* Top picks */}
      {sort === 'score' && locs.length > 0 && (
        <div className="top-picks">
          <div className="top-pick-badge">🏆 Top Pick in {city}</div>
          <div className="top-pick-name">{locs[0].name}</div>
          <div className="top-pick-meta">Investment Score: <strong style={{color:'#16a34a'}}>{locs[0].investmentScore}/100</strong> &nbsp;·&nbsp; Yield: <strong>{locs[0].rentalYield}%</strong> &nbsp;·&nbsp; 5Y Growth: <strong>+{locs[0].growth5Y}%</strong></div>
        </div>
      )}

      <div className="inv-grid">
        {locs.map((loc, i) => (
          <div key={i} className="inv-card card">
            <div className="inv-card-top">
              <div>
                <div className="inv-name">{loc.name}</div>
                <div className="inv-city">{loc.city} · <span className={`zone-tag zone-${loc.zone}`}>{loc.zone}</span></div>
              </div>
              {/* Investment Score ring */}
              <div className="inv-ring-wrap">
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#f1f5f9" strokeWidth="8"/>
                  <circle cx="40" cy="40" r="32" fill="none" stroke={scoreColor(loc.investmentScore)} strokeWidth="8"
                    strokeDasharray={`${loc.investmentScore/100*201} 201`}
                    strokeLinecap="round" transform="rotate(-90 40 40)"/>
                </svg>
                <div className="inv-ring-num" style={{color: scoreColor(loc.investmentScore)}}>{loc.investmentScore}</div>
              </div>
            </div>

            <div className="inv-score-label" style={{color: scoreColor(loc.investmentScore)}}>
              {scoreLabel(loc.investmentScore)} Investment
            </div>

            <div className="inv-metrics">
              <div className="inv-metric">
                <div className="inv-metric-val" style={{color: growthColor(loc.growth1Y)}}>+{loc.growth1Y}%</div>
                <div className="inv-metric-lbl">1Y Growth</div>
              </div>
              <div className="inv-metric">
                <div className="inv-metric-val" style={{color: growthColor(loc.growth5Y/5)}}>+{loc.growth5Y}%</div>
                <div className="inv-metric-lbl">5Y Growth</div>
              </div>
              <div className="inv-metric">
                <div className="inv-metric-val">{loc.rentalYield}%</div>
                <div className="inv-metric-lbl">Yield</div>
              </div>
              <div className="inv-metric">
                <div className="inv-metric-val">₹{(loc.avgPricePerSqft/1000).toFixed(0)}K</div>
                <div className="inv-metric-lbl">₹/sqft</div>
              </div>
            </div>

            <div className="inv-bars">
              {[
                { label:'Area Rating', val: loc.areaRating * 10, max:100 },
                { label:'Price Growth', val: Math.min(loc.growth5Y, 100), max:100 },
                { label:'Yield Score', val: Math.min(loc.rentalYield * 12, 100), max:100 },
              ].map(b => (
                <div key={b.label} className="inv-bar-row">
                  <span className="inv-bar-label">{b.label}</span>
                  <div className="bar-track" style={{flex:1}}>
                    <div className="bar-fill" style={{width:`${b.val}%`, background: scoreColor(b.val)}} />
                  </div>
                  <span className="inv-bar-pct">{Math.round(b.val)}</span>
                </div>
              ))}
            </div>

            {/* 5Y projection */}
            <div className="inv-projection">
              <span>5Y Value of ₹1Cr →</span>
              <strong style={{color:'#16a34a'}}>₹{(1 * Math.pow(1 + (loc.growth5Y/5)/100, 5)).toFixed(2)}Cr</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
