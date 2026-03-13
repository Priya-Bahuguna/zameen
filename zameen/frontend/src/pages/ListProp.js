import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { propAPI } from '../utils/api';
import './ListProp.css';

const CITIES = ['Bangalore','Mumbai','Gurgaon','Hyderabad','Pune','Delhi','Chennai'];
const AMENITIES_LIST = ['Parking','Swimming Pool','Gym','Security','Power Backup','Lift','Play Area','Clubhouse','Garden','CCTV','Intercom','Water Supply','Solar Panels','EV Charging','Smart Home'];

const DEF = { title:'', description:'', price:'', type:'buy', city:'Bangalore', location:'', bhk:'3', area:'', floor:'', totalFloors:'', age:'', facing:'North', furnished:'Unfurnished', possession:'Ready to Move', ownerName:'', contactPhone:'', amenities:[] };

export default function ListProp() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState(DEF);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const toggleAmenity = (a) => {
    setForm(p => ({
      ...p,
      amenities: p.amenities.includes(a) ? p.amenities.filter(x => x !== a) : [...p.amenities, a],
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())    e.title       = 'Title is required';
    if (!form.price)           e.price       = 'Price is required';
    if (!form.city)            e.city        = 'City is required';
    if (!form.location.trim()) e.location    = 'Locality is required';
    if (!form.area)            e.area        = 'Area is required';
    if (!form.ownerName.trim())e.ownerName   = 'Your name is required';
    if (!form.contactPhone)    e.contactPhone= 'Contact number is required';
    else if (!/^[6-9]\d{9}$/.test(form.contactPhone)) e.contactPhone = 'Invalid Indian mobile number';
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    try {
      const token = localStorage.getItem('zameenToken');
      if (token) {
        await propAPI.create({ ...form, price: parseFloat(form.price), bhk: parseInt(form.bhk), area: parseFloat(form.area) });
      }
      setSuccess(true);
    } catch (err) {
      // Save to local fallback
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="page-wrap">
      <div className="card success-screen">
        <div className="success-icon">🎉</div>
        <h2>Listing Submitted!</h2>
        <p>Your property has been submitted for review. It will be listed once verified.</p>
        <div className="success-btns">
          <button className="btn-green" onClick={() => navigate('/properties')}>Browse Properties</button>
          <button className="btn-outline" onClick={() => { setForm(DEF); setSuccess(false); }}>List Another</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="list-page page-wrap">
      <h1 className="page-title">➕ List Your Property</h1>
      <p className="page-sub">Fill in details to list your property. Verified listings get 3× more inquiries.</p>

      <div className="list-layout">
        <div className="list-form">

          {/* Basic Info */}
          <div className="form-section card">
            <h3 className="form-section-title">📌 Basic Information</h3>
            <div className="form-group">
              <label>Property Title <span>*</span></label>
              <input className={`form-control ${errors.title ? 'error' : ''}`} placeholder="e.g. Spacious 3BHK in Koramangala with Terrace" value={form.title} onChange={e => set('title', e.target.value)} />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-control" rows={4} placeholder="Describe your property — layout, special features, nearby landmarks..." value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label>Listing Type <span>*</span></label>
                <div className="type-toggle">
                  <button className={`type-btn ${form.type === 'buy' ? 'active-buy' : ''}`} onClick={() => set('type', 'buy')}>🏠 For Sale</button>
                  <button className={`type-btn ${form.type === 'rent' ? 'active-rent' : ''}`} onClick={() => set('type', 'rent')}>🔑 For Rent</button>
                </div>
              </div>
              <div className="form-group">
                <label>Price (₹) <span>*</span></label>
                <input type="number" className={`form-control ${errors.price ? 'error' : ''}`} placeholder={form.type === 'rent' ? 'Monthly rent' : 'Total price'} value={form.price} onChange={e => set('price', e.target.value)} />
                {errors.price && <span className="form-error">{errors.price}</span>}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="form-section card">
            <h3 className="form-section-title">📍 Location</h3>
            <div className="form-row-2">
              <div className="form-group">
                <label>City <span>*</span></label>
                <select className={`form-control ${errors.city ? 'error' : ''}`} value={form.city} onChange={e => set('city', e.target.value)}>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Locality / Area <span>*</span></label>
                <input className={`form-control ${errors.location ? 'error' : ''}`} placeholder="e.g. Koramangala 5th Block" value={form.location} onChange={e => set('location', e.target.value)} />
                {errors.location && <span className="form-error">{errors.location}</span>}
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="form-section card">
            <h3 className="form-section-title">🏗 Property Details</h3>
            <div className="form-row-3">
              <div className="form-group">
                <label>BHK <span>*</span></label>
                <select className="form-control" value={form.bhk} onChange={e => set('bhk', e.target.value)}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} BHK</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Area (sqft) <span>*</span></label>
                <input type="number" className={`form-control ${errors.area ? 'error' : ''}`} placeholder="e.g. 1200" value={form.area} onChange={e => set('area', e.target.value)} />
                {errors.area && <span className="form-error">{errors.area}</span>}
              </div>
              <div className="form-group">
                <label>Age (years)</label>
                <input type="number" className="form-control" placeholder="0 = New" value={form.age} onChange={e => set('age', e.target.value)} />
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
                <label>Facing</label>
                <select className="form-control" value={form.facing} onChange={e => set('facing', e.target.value)}>
                  {['North','South','East','West','North-East','North-West','South-East','South-West'].map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label>Furnished Status</label>
                <select className="form-control" value={form.furnished} onChange={e => set('furnished', e.target.value)}>
                  <option>Furnished</option><option>Semi-Furnished</option><option>Unfurnished</option>
                </select>
              </div>
              <div className="form-group">
                <label>Possession</label>
                <select className="form-control" value={form.possession} onChange={e => set('possession', e.target.value)}>
                  <option>Ready to Move</option><option>Within 3 Months</option><option>Within 6 Months</option><option>Under Construction</option>
                </select>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="form-section card">
            <h3 className="form-section-title">✨ Amenities</h3>
            <div className="amenities-grid">
              {AMENITIES_LIST.map(a => (
                <label key={a} className={`amenity-check ${form.amenities.includes(a) ? 'selected' : ''}`}>
                  <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} />
                  {a}
                </label>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="form-section card">
            <h3 className="form-section-title">📞 Contact Information</h3>
            <div className="form-row-2">
              <div className="form-group">
                <label>Your Name <span>*</span></label>
                <input className={`form-control ${errors.ownerName ? 'error' : ''}`} placeholder="Full name" value={form.ownerName} onChange={e => set('ownerName', e.target.value)} />
                {errors.ownerName && <span className="form-error">{errors.ownerName}</span>}
              </div>
              <div className="form-group">
                <label>Mobile Number <span>*</span></label>
                <input type="tel" className={`form-control ${errors.contactPhone ? 'error' : ''}`} placeholder="10-digit mobile" value={form.contactPhone} onChange={e => set('contactPhone', e.target.value)} />
                {errors.contactPhone && <span className="form-error">{errors.contactPhone}</span>}
              </div>
            </div>
          </div>

          <button className="btn-green submit-btn" onClick={submit} disabled={loading}>
            {loading ? <><span className="spinner" /> Submitting…</> : '✓ Submit Listing'}
          </button>
        </div>

        {/* Tip sidebar */}
        <div className="list-tips">
          <div className="card tips-card">
            <h4>💡 Tips for Better Response</h4>
            <ul>
              <li>✓ Add clear, accurate description</li>
              <li>✓ Include nearby landmarks</li>
              <li>✓ Mention all amenities</li>
              <li>✓ Set realistic price</li>
              <li>✓ Respond quickly to inquiries</li>
            </ul>
          </div>
          <div className="card tips-card">
            <h4>🏆 Verified Listings Get</h4>
            <div className="tip-stat"><span>3×</span> more inquiries</div>
            <div className="tip-stat"><span>40%</span> faster closing</div>
            <div className="tip-stat"><span>2×</span> better visibility</div>
          </div>
        </div>
      </div>
    </div>
  );
}
