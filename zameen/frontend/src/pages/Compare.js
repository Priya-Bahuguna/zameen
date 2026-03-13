import { useState } from 'react';
import { LOCALITIES } from '../data/localData';
import { scoreColor, growthColor } from '../utils/helpers';
import './Compare.css';

const CITIES = ['Bangalore','Mumbai','Gurgaon','Hyderabad'];
const ALL_LOCS = LOCALITIES;

const ROWS = [
  { label:'📍 City',             key:'city' },
  { label:'💰 Avg ₹/sqft',       key:'avgPricePerSqft', fmt: v => `₹${v?.toLocaleString('en-IN')}` },
  { label:'📈 1Y Growth',         key:'growth1Y',         fmt: v => `+${v}%`, color: growthColor },
  { label:'📊 5Y Growth',         key:'growth5Y',         fmt: v => `+${v}%`, color: v => growthColor(v/5) },
  { label:'💵 Rental Yield',      key:'rentalYield',      fmt: v => `${v}%` },
  { label:'🏆 Investment Score',  key:'investmentScore',  fmt: v => `${v}/100`, color: scoreColor },
  { label:'⭐ Area Rating',       key:'areaRating',       fmt: v => `${v}/10` },
  { label:'🔒 Safety',           key:'safetyScore',      fmt: v => `${v}/10` },
  { label:'🚌 Transport',         key:'transport',        fmt: v => `${v}/10` },
  { label:'🏫 Schools',           key:'schools',          fmt: v => `${v}/10` },
  { label:'🏥 Hospitals',         key:'hospitals',        fmt: v => `${v}/10` },
  { label:'✨ Cleanliness',       key:'cleanliness',      fmt: v => `${v}/10` },
  { label:'💧 Water Supply',      key:'waterSupply',      fmt: v => `${v}/10` },
  { label:'🎯 Zone',              key:'zone' },
];

export default function Compare() {
  const [slots, setSlots] = useState([null, null, null]);

  const setSlot = (i, name) => {
    const next = [...slots];
    next[i] = name || null;
    setSlots(next);
  };

  const selectedLocs = slots.map(s => s ? ALL_LOCS.find(l => l.name === s) : null);
  const filled = selectedLocs.filter(Boolean);

  // Highlight best value per row
  const best = (key) => {
    const vals  = filled.map(l => parseFloat(l[key]) || 0);
    const maxV  = Math.max(...vals);
    return filled.map(l => parseFloat(l[key]) === maxV);
  };

  return (
    <div className="cmp-page page-wrap">
      <h1 className="page-title">🔍 Compare Localities</h1>
      <p className="page-sub">Compare up to 3 localities side-by-side across 14 parameters</p>

      {/* Slot selectors */}
      <div className="cmp-selectors">
        {slots.map((slot, i) => (
          <div key={i} className="cmp-slot card">
            <div className="slot-label">Locality {i+1}</div>
            <select className="form-control" value={slot || ''} onChange={e => setSlot(i, e.target.value)}>
              <option value="">— Select Locality —</option>
              {CITIES.map(city => (
                <optgroup key={city} label={city}>
                  {ALL_LOCS.filter(l => l.city === city).map(l => (
                    <option key={l.name} value={l.name} disabled={slots.includes(l.name) && slots[i] !== l.name}>{l.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            {slot && (() => {
              const loc = ALL_LOCS.find(l => l.name === slot);
              return loc ? (
                <div className="slot-preview">
                  <div className="slot-score" style={{color: scoreColor(loc.investmentScore)}}>{loc.investmentScore}</div>
                  <div className="slot-score-lbl">Investment Score</div>
                </div>
              ) : null;
            })()}
          </div>
        ))}
      </div>

      {/* Comparison table */}
      {filled.length >= 2 ? (
        <div className="cmp-table-wrap">
          <table className="cmp-table">
            <thead>
              <tr>
                <th className="param-col">Parameter</th>
                {selectedLocs.map((loc, i) => loc ? (
                  <th key={i} className="val-col">
                    <div className="th-name">{loc.name}</div>
                    <div className="th-city">{loc.city}</div>
                  </th>
                ) : null)}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, ri) => {
                const bestArr = best(row.key);
                return (
                  <tr key={ri} className={ri % 2 === 0 ? 'tr-even' : ''}>
                    <td className="param-col">{row.label}</td>
                    {selectedLocs.map((loc, i) => {
                      if (!loc) return null;
                      const raw = loc[row.key];
                      const display = row.fmt ? row.fmt(raw) : raw;
                      const color   = row.color ? row.color(parseFloat(raw) || 0) : '#0d1b2a';
                      const isBest  = bestArr[filled.indexOf(loc)];
                      return (
                        <td key={i} className={`val-col ${isBest ? 'best-cell' : ''}`}>
                          <span style={{color: row.color ? color : '#0d1b2a', fontWeight: isBest ? 800 : 600}}>
                            {display}
                          </span>
                          {isBest && <span className="best-star">★</span>}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="cmp-legend">★ = Best value among selected localities</div>
        </div>
      ) : (
        <div className="card cmp-empty">
          <div className="empty-icon">🔍</div>
          <h3>Select at least 2 localities</h3>
          <p>Choose localities from the dropdowns above to start comparing</p>
        </div>
      )}
    </div>
  );
}
