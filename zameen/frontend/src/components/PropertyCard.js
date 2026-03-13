import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/helpers';
import './PropertyCard.css';

export default function PropertyCard({ property }) {
  const navigate = useNavigate();
  const { id, title, price, location, city, bhk, area, type, verified, image, furnished, investmentScore, age } = property;

  return (
    <div className="prop-card" onClick={() => navigate(`/property/${id}`)}>
      <div className="prop-img-wrap">
        <img src={image} alt={title} className="prop-img" loading="lazy" />
        <span className={`prop-type-badge ${type === 'rent' ? 'rent' : 'buy'}`}>
          {type === 'buy' ? 'Buy' : 'Rent'}
        </span>
        {verified && <span className="prop-verified">✓ Verified</span>}
        {investmentScore >= 82 && <span className="prop-hot">🔥 Hot</span>}
      </div>

      <div className="prop-body">
        <h3 className="prop-title">{title}</h3>
        <p className="prop-loc">📍 {location}, {city}</p>

        <div className="prop-specs">
          <span>🛏 {bhk} BHK</span>
          <span>📐 {area} sqft</span>
          {furnished && (
            <span className={`furn-tag ${furnished === 'Furnished' ? 'furn-yes' : furnished === 'Semi-Furnished' ? 'furn-semi' : 'furn-no'}`}>
              {furnished}
            </span>
          )}
        </div>

        <div className="prop-footer">
          <div className="prop-price">{formatPrice(price, type)}</div>
          <button className="prop-btn" onClick={e => { e.stopPropagation(); navigate(`/property/${id}`); }}>
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}
