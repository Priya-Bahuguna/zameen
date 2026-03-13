import { useState } from 'react';
import { LOCALITIES, PROPERTIES } from '../data/localData';
import BarChart from '../components/BarChart';
import { growthColor } from '../utils/helpers';
import './PriceHistory.css';

const CITIES = ['Bangalore','Mumbai','Gurgaon','Hyderabad'];

export default function PriceHistory() {
  const [city, setCity] = useState('Bangalore');
  const [tab,  setTab]  = useState('localities'); // 'localities' | 'properties'

  const locs  = LOCALITIES.filter(l => l.city === city);
  const props = PROPERTIES.filter(p => p.city === city && p.type === 'buy');

  return (
    <div className="ph-page page-wrap">
      <h1 className="page-title">📊 Price History</h1>
      <p className="page-sub">5-year price trends across localities and properties</p>

      {/* City selector */}
      <div className="city-pills" style={{marginBottom:24}}>
        {CITIES.map(c => (
          <button key={c} className={`city-pill ${city === c ? 'active' : ''}`} onClick={() => setCity(c)}>{c}</button>
        ))}
      </div>

      {/* Tab */}
      <div className="tabs-bar" style={{marginBottom:24}}>
        <button className={`tab-btn ${tab === 'localities' ? 'active' : ''}`} onClick={() => setTab('localities')}>📍 By Locality</button>
        <button className={`tab-btn ${tab === 'properties' ? 'active' : ''}`} onClick={() => setTab('properties')}>🏠 By Property</button>
      </div>

      {tab === 'localities' ? (
        <div className="ph-grid">
          {locs.map((loc, i) => (
            <div key={i} className="ph-card card">
              <div className="ph-card-head">
                <div>
                  <div className="ph-loc-name">{loc.name}</div>
                  <div className="ph-city">{loc.city}</div>
                </div>
                <div className="ph-zone-badge" data-zone={loc.zone}>{loc.zone}</div>
              </div>

              <div className="ph-metrics">
                <div className="ph-metric">
                  <div className="ph-metric-val">₹{(loc.avgPricePerSqft/1000).toFixed(0)}K</div>
                  <div className="ph-metric-lbl">Avg ₹/sqft</div>
                </div>
                <div className="ph-metric">
                  <div className="ph-metric-val" style={{color: growthColor(loc.growth1Y)}}>+{loc.growth1Y}%</div>
                  <div className="ph-metric-lbl">1Y Growth</div>
                </div>
                <div className="ph-metric">
                  <div className="ph-metric-val" style={{color: growthColor(loc.growth5Y/5)}}>+{loc.growth5Y}%</div>
                  <div className="ph-metric-lbl">5Y Growth</div>
                </div>
              </div>

              {/* Synthetic bar chart from yearly growth data */}
              <BarChart
                data={generateYearlyData(loc)}
                color="#16a34a"
                height={100}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="ph-grid">
          {props.map((prop, i) => (
            <div key={i} className="ph-card card">
              <div className="ph-card-head">
                <div>
                  <div className="ph-loc-name" style={{fontSize:14}}>{prop.title}</div>
                  <div className="ph-city">📍 {prop.location}</div>
                </div>
                <div className="ph-psf">₹{prop.pricePerSqft?.toLocaleString('en-IN')}/sqft</div>
              </div>
              <BarChart data={prop.priceHistory} color="#2563eb" height={100} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function generateYearlyData(loc) {
  const currentPSF = loc.avgPricePerSqft;
  const years = [2019,2020,2021,2022,2023,2024];
  // Back-calculate from 5Y growth
  const g5 = loc.growth5Y / 100;
  const startPSF = currentPSF / (1 + g5);
  return years.map((yr, i) => ({
    year: String(yr),
    price: Math.round(startPSF * Math.pow((1 + g5), i / (years.length - 1))),
  }));
}
