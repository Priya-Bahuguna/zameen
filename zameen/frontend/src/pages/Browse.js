import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PROPERTIES } from '../data/localData';
import PropertyCard from '../components/PropertyCard';
import './Browse.css';

const CITIES = ['Bangalore','Mumbai','Gurgaon','Hyderabad'];

export default function Browse() {
  const [sp] = useSearchParams();
  const [filters, setFilters] = useState({
    city: sp.get('city') || '', type: '', bhk: '',
    minPrice: '', maxPrice: '', furnished: '', verified: false,
  });
  const [sort,    setSort]    = useState('default');
  const [applied, setApplied] = useState({ ...filters });

  const set = (k, v) => setFilters(p => ({ ...p, [k]: v }));

  const applyFilters = () => setApplied({ ...filters });
  const clearAll     = () => { const blank = { city:'', type:'', bhk:'', minPrice:'', maxPrice:'', furnished:'', verified:false }; setFilters(blank); setApplied(blank); };

  // Filter logic
  let result = PROPERTIES.filter(p => {
    if (applied.city     && p.city.toLowerCase()      !== applied.city.toLowerCase())      return false;
    if (applied.type     && p.type                    !== applied.type)                    return false;
    if (applied.bhk      && p.bhk                     !== parseInt(applied.bhk))           return false;
    if (applied.furnished && p.furnished              !== applied.furnished)               return false;
    if (applied.verified && !p.verified)                                                   return false;
    if (applied.minPrice && p.price < parseFloat(applied.minPrice))                        return false;
    if (applied.maxPrice && p.price > parseFloat(applied.maxPrice))                        return false;
    return true;
  });

  if (sort === 'priceLow')  result = [...result].sort((a, b) => a.price - b.price);
  if (sort === 'priceHigh') result = [...result].sort((a, b) => b.price - a.price);
  if (sort === 'area')      result = [...result].sort((a, b) => b.area - a.area);
  if (sort === 'score')     result = [...result].sort((a, b) => (b.investmentScore||0) - (a.investmentScore||0));

  return (
    <div className="browse-page">

      {/* ── Sidebar ──────────────────── */}
      <aside className="browse-sidebar card">
        <div className="sidebar-head">
          <span className="sidebar-title">☰ Filters</span>
          <button className="clear-btn" onClick={clearAll}>Clear All</button>
        </div>

        <div className="form-group">
          <label>City</label>
          <input className="form-control" placeholder="Enter city" value={filters.city} onChange={e => set('city', e.target.value)} />
        </div>

        <div className="sb-city-list">
          {CITIES.map(c => (
            <button key={c} className={`sb-city-btn ${filters.city === c ? 'active' : ''}`} onClick={() => set('city', c)}>{c}</button>
          ))}
        </div>

        <div className="form-group">
          <label>Property Type</label>
          <select className="form-control" value={filters.type} onChange={e => set('type', e.target.value)}>
            <option value="">Select Type</option>
            <option value="buy">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>

        <div className="form-group">
          <label>BHK</label>
          <select className="form-control" value={filters.bhk} onChange={e => set('bhk', e.target.value)}>
            <option value="">Select BHK</option>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} BHK</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Price Range (₹)</label>
          <div className="price-row">
            <input className="form-control" placeholder="Min" type="number" value={filters.minPrice} onChange={e => set('minPrice', e.target.value)} />
            <input className="form-control" placeholder="Max" type="number" value={filters.maxPrice} onChange={e => set('maxPrice', e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label>Furnished Status</label>
          <select className="form-control" value={filters.furnished} onChange={e => set('furnished', e.target.value)}>
            <option value="">Select status</option>
            <option value="Furnished">Furnished</option>
            <option value="Semi-Furnished">Semi-Furnished</option>
            <option value="Unfurnished">Unfurnished</option>
          </select>
        </div>

        <label className="check-label">
          <input type="checkbox" checked={filters.verified} onChange={e => set('verified', e.target.checked)} />
          Verified listings only
        </label>

        <button className="btn-green apply-btn" onClick={applyFilters}>☰ Apply Filters</button>
      </aside>

      {/* ── Main ─────────────────────── */}
      <main className="browse-main">
        <div className="browse-topbar">
          <div>
            <h1 className="page-title">Browse Properties</h1>
            <p className="found-count">{result.length} properties found</p>
          </div>
          <select className="sort-select form-control" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="default">Sort: Default</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="area">Area: Largest First</option>
            <option value="score">Investment Score</option>
          </select>
        </div>

        {result.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No properties found</h3>
            <p>Try adjusting your filters</p>
            <button className="btn-green" style={{marginTop:16}} onClick={clearAll}>Clear all filters</button>
          </div>
        ) : (
          <div className="grid-2">
            {result.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </main>
    </div>
  );
}
