# 🏠 Zameen – Smart Property Intelligence Platform

> India's AI-powered property platform with verified listings, price analytics, and built-in intelligence engine.

---

## 🚀 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, React Router v6, Plain CSS |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB Atlas (6 collections)       |
| Auth       | JWT (jsonwebtoken + bcryptjs)       |
| AI Engine  | Built-in statistical model (no API) |

---

## 📁 Project Structure

```
zameen/
├── backend/
│   ├── models/         # 6 MongoDB schemas
│   │   ├── User.js
│   │   ├── Property.js
│   │   ├── Locality.js
│   │   ├── Review.js
│   │   ├── PriceHistory.js
│   │   └── Transaction.js
│   ├── routes/         # 6 REST API route files
│   │   ├── auth.js
│   │   ├── properties.js
│   │   ├── localities.js
│   │   ├── reviews.js
│   │   ├── priceHistory.js
│   │   └── transactions.js
│   ├── middleware/
│   │   └── auth.js     # JWT protect + adminOnly
│   ├── server.js       # Express entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── Navbar.js + Navbar.css
        │   ├── Footer.js + Footer.css
        │   ├── PropertyCard.js + PropertyCard.css
        │   └── BarChart.js + BarChart.css
        ├── pages/
        │   ├── Home.js         Browse.js    Detail.js
        │   ├── Estimator.js    ListProp.js  PriceHistory.js
        │   ├── AreaRatings.js  Investment.js Compare.js
        │   ├── Login.js        Register.js  Dashboard.js
        │   └── Auth.css
        ├── utils/
        │   ├── api.js          # All backend API calls
        │   ├── aiEngine.js     # Built-in AI estimator
        │   └── helpers.js      # Format/color helpers
        ├── data/
        │   └── localData.js    # Static fallback data
        ├── styles/
        │   └── global.css
        ├── App.js
        └── index.js
```

---

## ⚙️ Setup Instructions

### 1. Clone & Install

```bash
# Backend
cd zameen/backend
npm install
cp .env.example .env       # Fill in MONGO_URI and JWT_SECRET

# Frontend
cd zameen/frontend
npm install
```

### 2. Configure Environment

Edit `backend/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/zameen
JWT_SECRET=any_long_random_string_here
PORT=5000
CLIENT_URL=http://localhost:3000
```

### 3. Run Development Servers

```bash
# Terminal 1 – Backend (port 5000)
cd zameen/backend
npm run dev

# Terminal 2 – Frontend (port 3000)
cd zameen/frontend
npm start
```

> ✅ Frontend automatically proxies `/api/*` to `http://localhost:5000`

---

## 🗃️ MongoDB Collections

| Collection   | Purpose                                  |
|--------------|------------------------------------------|
| users        | Auth, profiles, saved properties         |
| properties   | Listings with full specs + fraud flags   |
| localities   | Area data + aggregated community scores  |
| reviews      | 8-parameter community locality reviews   |
| pricehistory | 5-year yearly price trends per locality  |
| transactions | Inquiries, site visits, deal tracking    |

---

## 🔗 API Endpoints

```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login + get JWT
GET    /api/auth/me                Get logged-in user (protected)

GET    /api/properties             List with filters (city/type/bhk/price/area)
GET    /api/properties/:id         Single property + increment views
POST   /api/properties             Create listing (protected)
PUT    /api/properties/:id         Update (owner/admin)
DELETE /api/properties/:id         Soft delete (owner/admin)
POST   /api/properties/:id/verify  Admin verify listing

GET    /api/localities             All localities (filter city/zone)
GET    /api/localities/:name       Single locality data

GET    /api/reviews                Locality reviews
POST   /api/reviews                Submit review + auto-update locality scores
DELETE /api/reviews/:id            Delete own review

GET    /api/pricehistory/:locality 5-year trend data
GET    /api/pricehistory           All localities history

GET    /api/transactions           User's transactions (admin sees all)
POST   /api/transactions           Create inquiry
PUT    /api/transactions/:id       Update status
```

---

## 🤖 AI Engine (No API Key!)

The built-in AI estimator (`aiEngine.js`) uses:
- Base rates for 23 locality-city combos
- BHK multipliers
- Floor bonus / penalty
- Age depreciation factor
- Furnishing premium
- Facing direction bonus
- Generates confidence score (High/Medium/Low)
- 4 contextual market insights
- 5-year value projection

---

## ✨ Pages & Features

| Page          | Route           | Feature                            |
|---------------|-----------------|-------------------------------------|
| Home          | /               | Hero search, featured properties    |
| Browse        | /properties     | Filter sidebar + sort               |
| Property      | /property/:id   | Gallery, specs, chart, AI card      |
| AI Estimator  | /estimate       | Form + real-time AI valuation       |
| List Property | /list           | Full listing form with validation   |
| Price History | /price-history  | 5-year bar charts by city/locality  |
| Area Ratings  | /area-ratings   | 8-parameter scores + detail panel   |
| Investment    | /investment     | Score rings + 5Y projection         |
| Compare       | /compare        | 3-way locality comparison table     |
| Login         | /login          | JWT auth + demo mode                |
| Register      | /register       | Full validation + role select       |
| Dashboard     | /dashboard      | Saved, Listings, Inquiries tabs     |

---

## 📱 Responsive Design

- Mobile-first CSS
- Responsive grid layouts
- Collapsible mobile navbar
- Touch-friendly components

---

## 🛡️ Security Features

- JWT authentication (7-day expiry)
- Password hashing with bcrypt (12 rounds)
- Fraud detection for suspicious pricing
- Admin-only routes for verification
- Soft delete (no data loss)

---

*Built with ❤️ as a full-stack React + Node.js project*
