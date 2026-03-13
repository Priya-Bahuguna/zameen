import { useState } from 'react';
import { estimatePrice } from '../utils/aiEngine';
import './Estimator.css';

const CITIES = ['Bangalore','Mumbai','Gurgaon','Hyderabad'];
const LOCALITIES = {
  Bangalore:['Koramangala','Indiranagar','Whitefield','Electronic City','HSR Layout','Sarjapur','Marathahalli','JP Nagar'],
  Mumbai:   ['Bandra West','Andheri East','Juhu','Powai','Thane','Navi Mumbai'],
  Gurgaon:  ['DLF Phase 4','Sector 67','Golf Course Road','Sohna Road'],
  Hyderabad:['Hitech City','Gachibowli','Jubilee Hills','Kondapur','Madhapur'],
};

const DEF = { city:'Bangalore', locality:'Koramangala', bhk:'3', area:'1200', floor:'5', totalFloors:'12', age:'4', furnished:'Semi-Furnished', facing:'North', propertyType:'buy' };

export default function Estimator() {
  const [form,    setForm]    = useState(DEF);
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => {
    setForm(p => {
      const next = { ...p, [k]: v };
      if (k === 'city') next.locality = LOCALITIES[v]?.[0] || '';
      return next;
    });
  };

  const estimate = () => {
    setLoading(true);
    setTimeout(() => {
      setResult(estimatePrice(form));
      setLoading(false);
    }, 900);
  };

  const confColor = r => r?.confidence === 'High' ? '#16a34a' : r?.confidence === 'Medium' ? '#f97316' : '#dc2626';

  return (
    <div className="est-page page-wrap">
      <h1 className="page-title">🤖 AI Price Estimator</h1>
      <p className="page-sub">Get instant AI-powered property valuation — no API key, 100% built-in intelligence</p>

      <div className="est-layout">

        {/* ── Form ─────────────────────────── */}
        <div className="est-form card">
          <div className="form-tabs">
            {['buy','rent'].map(t => (
              <button key={t} className={`tab-btn ${form.propertyType === t ? 'active' : ''}`} onClick={() => set('propertyType', t)}>
                {t === 'buy' ? '🏠 Buy' : '🔑 Rent'}
              </button>
            ))}
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>City <span>*</span></label>
              <select className="form-control" value={form.city} onChange={e => set('city', e.target.value)}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Locality <span>*</span></label>
              <select className="form-control" value={form.locality} onChange={e => set('locality', e.target.value)}>
                {(LOCALITIES[form.city] || []).map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>BHK <span>*</span></label>
              <select className="form-control" value={form.bhk} onChange={e => set('bhk', e.target.value)}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} BHK</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Area (sqft) <span>*</span></label>
              <input type="number" className="form-control" value={form.area} placeholder="e.g. 1200" onChange={e => set('area', e.target.value)} />
            </div>
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label>Floor</label>
              <input type="number" className="form-control" value={form.floor} onChange={e => set('floor', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Total Floors</label>
              <input type="number" className="form-control" value={form.totalFloors} onChange={e => set('totalFloors', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Age (yrs)</label>
              <input type="number" className="form-control" value={form.age} onChange={e => set('age', e.target.value)} />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Furnished Status</label>
              <select className="form-control" value={form.furnished} onChange={e => set('furnished', e.target.value)}>
                <option>Furnished</option>
                <option>Semi-Furnished</option>
                <option>Unfurnished</option>
              </select>
            </div>
            <div className="form-group">
              <label>Facing</label>
              <select className="form-control" value={form.facing} onChange={e => set('facing', e.target.value)}>
                {['North','South','East','West','North-East','North-West','South-East','South-West'].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <button className="btn-green est-btn" onClick={estimate} disabled={loading}>
            {loading ? <><span className="spinner" /> Analysing…</> : '🤖 Estimate Price'}
          </button>
        </div>

        {/* ── Result ───────────────────────── */}
        <div className="est-result">
          {!result && !loading && (
            <div className="result-placeholder card">
              <div className="placeholder-icon">🤖</div>
              <h3>AI Result Will Appear Here</h3>
              <p>Fill the form and click Estimate Price to get instant valuation with insights.</p>
              <ul className="placeholder-list">
                <li>✓ Estimated market price</li>
                <li>✓ Price per sqft analysis</li>
                <li>✓ Rental yield projection</li>
                <li>✓ 5-year value forecast</li>
                <li>✓ AI market insights</li>
              </ul>
            </div>
          )}

          {loading && (
            <div className="result-loading card">
              <div className="ai-anim">
                <div className="ai-dot" style={{animationDelay:'0s'}} />
                <div className="ai-dot" style={{animationDelay:'.2s'}} />
                <div className="ai-dot" style={{animationDelay:'.4s'}} />
              </div>
              <p>AI is analysing market data…</p>
            </div>
          )}

          {result && !loading && (
            <div className="result-card card fade-in">
              <div className="result-header">
                <div className="result-title">AI Price Estimate</div>
                <div className="conf-badge" style={{background: confColor(result) + '20', color: confColor(result), border:`1px solid ${confColor(result)}40`}}>
                  {result.confidence} Confidence
                </div>
              </div>

              <div className="est-price">{result.estimatedPrice}</div>
              <div className="est-range">Range: {result.priceRange}</div>
              <div className="est-psf">{result.pricePerSqft}</div>

              <div className={`status-pill ${result.status.includes('deal') ? 'deal' : result.status.includes('Over') ? 'over' : 'fair'}`}>
                {result.status}
              </div>

              <div className="result-metrics">
                <div className="metric-box">
                  <div className="metric-val">{result.rentalYield}</div>
                  <div className="metric-lbl">Rental Yield</div>
                </div>
                {result.fiveYearValue && (
                  <div className="metric-box">
                    <div className="metric-val" style={{color:'#16a34a'}}>{result.fiveYearValue}</div>
                    <div className="metric-lbl">5-Year Value</div>
                  </div>
                )}
              </div>

              <div className="insights-box">
                <div className="insights-title">🧠 AI Insights</div>
                {result.insights.map((ins, i) => (
                  <div key={i} className="insight-item">
                    <span className="insight-dot" />
                    <span>{ins}</span>
                  </div>
                ))}
              </div>

              <div className="result-disclaimer">
                * Estimate based on statistical market data. Actual prices may vary ±10%.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
