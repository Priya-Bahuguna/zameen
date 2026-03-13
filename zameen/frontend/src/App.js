import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar       from './components/Navbar';
import Footer       from './components/Footer';
import Home         from './pages/Home';
import Browse       from './pages/Browse';
import Detail       from './pages/Detail';
import Estimator    from './pages/Estimator';
import ListProp     from './pages/ListProp';
import PriceHistory from './pages/PriceHistory';
import AreaRatings  from './pages/AreaRatings';
import Investment   from './pages/Investment';
import Compare      from './pages/Compare';
import Login        from './pages/Login';
import Register     from './pages/Register';
import Dashboard    from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/properties"    element={<Browse />} />
        <Route path="/property/:id"  element={<Detail />} />
        <Route path="/estimate"      element={<Estimator />} />
        <Route path="/list"          element={<ListProp />} />
        <Route path="/price-history" element={<PriceHistory />} />
        <Route path="/area-ratings"  element={<AreaRatings />} />
        <Route path="/investment"    element={<Investment />} />
        <Route path="/compare"       element={<Compare />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/register"      element={<Register />} />
        <Route path="/dashboard"     element={<Dashboard />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
