import { Gavel, LogOut, PlusCircle, UserRound } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-tide text-white' : 'text-slate-700 hover:bg-slate-100'
  }`;

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-ink">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-tide text-white">
            <Gavel size={20} />
          </span>
          BidStream
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <NavLink to="/" className={navClass}>
            Auctions
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/create" className={navClass}>
                <span className="inline-flex items-center gap-1">
                  <PlusCircle size={16} /> Create
                </span>
              </NavLink>
              <NavLink to="/dashboard" className={navClass}>
                <span className="inline-flex items-center gap-1">
                  <UserRound size={16} /> Dashboard
                </span>
              </NavLink>
            </>
          )}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="focus-ring inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              title={`Logout ${user?.name || ''}`}
            >
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <>
              <NavLink to="/login" className={navClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={navClass}>
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
