import { formatPriceShort, growthColor } from '../utils/helpers';
import './BarChart.css';

export default function BarChart({ data, color = '#16a34a', height = 130 }) {
  if (!data || data.length === 0) return null;

  const values = data.map(d => d.price);
  const min    = Math.min(...values) * 0.88;
  const max    = Math.max(...values) * 1.04;
  const range  = max - min || 1;
  const getH   = v => Math.max(10, Math.round(((v - min) / range) * height));

  const last    = values[values.length - 1];
  const prev    = values[values.length - 2];
  const yoy     = prev ? (((last - prev) / prev) * 100).toFixed(1) : 0;
  const total   = values[0] ? (((last - values[0]) / values[0]) * 100).toFixed(0) : 0;

  return (
    <div className="barchart">
      <div className="bc-header">
        <div className="bc-growth">
          <span className="bc-big" style={{ color: growthColor(parseFloat(total) / data.length) }}>+{total}%</span>
          <span className="bc-sub">overall growth</span>
        </div>
        <div className="bc-yoy" style={{ color: parseFloat(yoy) >= 0 ? '#16a34a' : '#dc2626' }}>
          {parseFloat(yoy) >= 0 ? '▲' : '▼'} {Math.abs(yoy)}% YoY
        </div>
      </div>

      <div className="bc-bars" style={{ height: height + 48 }}>
        {data.map((d, i) => {
          const isLast = i === data.length - 1;
          return (
            <div key={i} className="bc-col">
              <div className="bc-val">{formatPriceShort(d.price)}</div>
              <div
                className="bc-bar"
                style={{
                  height: getH(d.price),
                  background: isLast ? color : color + '60',
                  border: isLast ? `2px solid ${color}` : 'none',
                }}
              />
              <div className="bc-year">{d.year}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
