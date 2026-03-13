// ── Zameen Built-in AI Engine ─────────────────────────────────
// Rule-based statistical model — no external API needed

const BASE_RATES = {
  'Koramangala-Bangalore':9500, 'Indiranagar-Bangalore':11000,
  'Whitefield-Bangalore':7200,  'Electronic City-Bangalore':6500,
  'HSR Layout-Bangalore':8800,  'Sarjapur-Bangalore':6000,
  'Marathahalli-Bangalore':7500,'JP Nagar-Bangalore':7800,
  'Bandra West-Mumbai':26000,   'Andheri East-Mumbai':18000,
  'Juhu-Mumbai':22000,          'Powai-Mumbai':17000,
  'Thane-Mumbai':12000,         'Navi Mumbai-Mumbai':9000,
  'DLF Phase 4-Gurgaon':10500, 'Sector 67-Gurgaon':11200,
  'Golf Course Road-Gurgaon':14000, 'Sohna Road-Gurgaon':8500,
  'Hitech City-Hyderabad':7500, 'Gachibowli-Hyderabad':7000,
  'Jubilee Hills-Hyderabad':12000, 'Kondapur-Hyderabad':6500,
  'Madhapur-Hyderabad':7200,
};

const CITY_AVG = {
  Bangalore:7000, Mumbai:16000, Gurgaon:10000,
  Hyderabad:6800, Delhi:9000,   Pune:6500, Chennai:6000,
};

const BHK_MULT      = {1:0.65, 2:0.85, 3:1.0, 4:1.28, 5:1.55};
const FURNISH_BONUS = { Furnished:0.12, 'Semi-Furnished':0.05, Unfurnished:0 };
const FACING_BONUS  = { 'North-East':0.05, South:0.03, North:0.02, East:0.01, West:-0.01, 'North-West':0.03 };

function floorBonus(floor, total) {
  const pct = total > 0 ? floor / total : 0.5;
  return pct > 0.75 ? 0.06 : pct > 0.5 ? 0.03 : pct < 0.1 ? -0.04 : 0;
}

function ageFactor(age) {
  if (age <= 1)  return 1.08;
  if (age <= 3)  return 1.04;
  if (age <= 6)  return 1.00;
  if (age <= 10) return 0.95;
  return 0.88;
}

function formatBuy(p) {
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
  return `₹${(p / 100000).toFixed(2)} L`;
}
function formatRent(r) { return `₹${Math.round(r / 1000)}K/month`; }

export function estimatePrice(inputs) {
  const { locality, city, bhk, area, floor, totalFloors, age, furnished, facing, propertyType } = inputs;
  const bhkN   = parseInt(bhk)        || 3;
  const areaN  = parseFloat(area)     || 1200;
  const floorN = parseInt(floor)      || 5;
  const totalN = parseInt(totalFloors)|| 12;
  const ageN   = parseInt(age)        || 4;

  const key        = `${locality}-${city}`;
  const basePSF    = BASE_RATES[key] || CITY_AVG[city] || 7000;
  const confidence = BASE_RATES[key] ? 'High' : CITY_AVG[city] ? 'Medium' : 'Low';

  const adjPSF = Math.round(
    basePSF
    * (BHK_MULT[bhkN] || 1)
    * (1 + floorBonus(floorN, totalN))
    * ageFactor(ageN)
    * (1 + (FURNISH_BONUS[furnished] || 0))
    * (1 + (FACING_BONUS[facing]    || 0))
  );

  const cityAvg  = CITY_AVG[city] || 7000;
  const diffPct  = (((adjPSF - cityAvg) / cityAvg) * 100).toFixed(1);
  const status   = diffPct > 15 ? 'Overpriced vs city avg'
                 : diffPct < -10 ? 'Underpriced – good deal'
                 : 'Fairly priced';

  if (propertyType === 'rent') {
    const monthly = Math.round((adjPSF * areaN * 0.036) / 12 / 500) * 500;
    return {
      estimatedPrice : formatRent(monthly),
      priceRange     : `${formatRent(monthly * 0.88)} – ${formatRent(monthly * 1.14)}`,
      pricePerSqft   : `₹${Math.round(monthly / areaN * 12)}/sqft/yr`,
      confidence, status,
      rentalYield    : '3.4–3.8%',
      insights       : buildInsights(inputs, adjPSF, ageN, bhkN, monthly, furnished, 'rent'),
      isRent: true,
    };
  }

  const estimated = Math.round(adjPSF * areaN);
  return {
    estimatedPrice   : formatBuy(estimated),
    priceRange       : `${formatBuy(Math.round(estimated * 0.91))} – ${formatBuy(Math.round(estimated * 1.11))}`,
    pricePerSqft     : `₹${adjPSF.toLocaleString('en-IN')}/sqft`,
    confidence, status,
    rentalYield      : `${((estimated * 0.036) / estimated * 100).toFixed(1)}%`,
    fiveYearValue    : formatBuy(Math.round(estimated * 1.48)),
    insights         : buildInsights(inputs, adjPSF, ageN, bhkN, estimated, furnished, 'buy'),
  };
}

function buildInsights(inputs, psf, age, bhk, total, furnished, type) {
  const { city, locality } = inputs;
  const cityAvg = CITY_AVG[city] || 7000;
  const ins = [];

  if (psf > cityAvg * 1.3)
    ins.push(`${locality} commands a ${(((psf / cityAvg) - 1) * 100).toFixed(0)}% premium over ${city} average — strong demand zone.`);
  else if (psf < cityAvg * 0.9)
    ins.push(`${locality} is priced below ${city} average — good value pick for long-term investment.`);
  else
    ins.push(`${locality} pricing aligns with ${city} market — a balanced, fair-value zone.`);

  if (age <= 2)
    ins.push('New construction: expect 8–10% premium. Minimal maintenance for next 8–10 years.');
  else if (age > 8)
    ins.push(`At ${age} years, factor in ₹300–500/sqft renovation. Negotiate 5–8% price reduction.`);

  if (bhk >= 3 && type === 'buy')
    ins.push('3+ BHK units appreciate 12–15% faster than 1–2 BHK due to family demand.');

  if (furnished === 'Furnished')
    ins.push(type === 'rent'
      ? 'Fully furnished adds 12–18% rental premium — tenants prefer move-in ready.'
      : 'Furnished properties transact 25% faster at 10–12% higher value.');

  if (type === 'buy')
    ins.push(`5-year projection: ${formatBuy(Math.round(total * 1.48))} (8% CAGR based on ${city} historical trends).`);

  return ins.slice(0, 4);
}
