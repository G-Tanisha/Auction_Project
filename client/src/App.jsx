import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AuctionDetail from './pages/AuctionDetail';
import CreateAuction from './pages/CreateAuction';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => (
  <div className="min-h-screen bg-slate-50">
    <Navbar />
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auctions/:id" element={<AuctionDetail />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/create" element={<CreateAuction />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </main>
  </div>
);

export default App;
