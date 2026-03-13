import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="footer-logo-box">Z</div>
            <span>Zameen</span>
          </div>
          <p>India's smartest property intelligence platform. Data-driven decisions for every buyer, renter and investor.</p>
          <div className="footer-badges">
            <span>🏆 No Fake Ads</span>
            <span>🤖 AI Powered</span>
            <span>🔒 Verified Listings</span>
          </div>
        </div>

        <div className="footer-col">
          <h4>Features</h4>
          <Link to="/properties">Browse Properties</Link>
          <Link to="/estimate">AI Price Estimator</Link>
          <Link to="/price-history">Price History</Link>
          <Link to="/area-ratings">Area Ratings</Link>
          <Link to="/investment">Investment Score</Link>
          <Link to="/compare">Compare Areas</Link>
        </div>

        <div className="footer-col">
          <h4>Cities</h4>
          <Link to="/properties?city=Bangalore">Bangalore</Link>
          <Link to="/properties?city=Mumbai">Mumbai</Link>
          <Link to="/properties?city=Gurgaon">Gurgaon</Link>
          <Link to="/properties?city=Hyderabad">Hyderabad</Link>
          <Link to="/properties?city=Pune">Pune</Link>
          <Link to="/properties?city=Delhi">Delhi</Link>
        </div>

        <div className="footer-col">
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/list">List Property</Link>
          <Link to="/dashboard">Dashboard</Link>
          <p className="footer-copy">© 2025 Zameen<br />Smart Property Intelligence</p>
        </div>
      </div>
    </footer>
  );
}
