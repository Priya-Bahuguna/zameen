export function formatPrice(price, type) {
  if (type === 'rent') return `₹${Math.round(price / 1000)}K/month`;
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000)   return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
}

export function formatPriceShort(p) {
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(1)}Cr`;
  if (p >= 100000)   return `₹${(p / 100000).toFixed(0)}L`;
  return `₹${Math.round(p / 1000)}K`;
}

export function scoreColor(s) {
  if (s >= 85) return '#16a34a';
  if (s >= 70) return '#2563eb';
  if (s >= 55) return '#f97316';
  return '#dc2626';
}

export function scoreLabel(s) {
  if (s >= 85) return 'Excellent';
  if (s >= 70) return 'Good';
  if (s >= 55) return 'Average';
  return 'Below Avg';
}

export function growthColor(g) {
  if (g >= 12) return '#16a34a';
  if (g >= 7)  return '#2563eb';
  if (g >= 3)  return '#f97316';
  return '#dc2626';
}

export const CITIES = ['Bangalore', 'Mumbai', 'Gurgaon', 'Hyderabad'];
