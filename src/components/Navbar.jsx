import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { Menu, X } from 'lucide-react';
import RoleBased from './RoleBased';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkStyles =
    'block text-sm font-medium text-slate-700 hover:text-indigo-600 transition';

  return (
    <nav
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${isScrolled ? 'shadow-md py-2' : 'py-3'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className={`text-indigo-600 font-bold tracking-tight hover:opacity-90 transition-all duration-300 ${isScrolled ? 'text-xl' : 'text-2xl'
            }`}
        >
          JobBoard
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <span className="text-sm text-slate-700">
                {user.email}{' '}
                <span className="text-xs text-slate-500">({user.role})</span>
              </span>

              <NavLink to="/" className={navLinkStyles}>
                Home
              </NavLink>

              <NavLink to="/jobs" className={navLinkStyles}>
                Jobs
              </NavLink>

              <RoleBased roles={['job_seeker']}>
                <NavLink to="/my-applications" className={navLinkStyles}>
                  My Applications
                </NavLink>
              </RoleBased>

              <RoleBased roles={['admin', 'recruiter']}>
                <NavLink to="/dashboard" className={navLinkStyles}>
                  Dashboard
                </NavLink>
                <NavLink to="/manage-applications" className={navLinkStyles}>
                  Manage Applications
                </NavLink>
              </RoleBased>

              <button
                onClick={logoutHandler}
                className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md transition text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/" className={navLinkStyles}>
                Home
              </NavLink>
              <NavLink to="/login" className={navLinkStyles}>
                Login
              </NavLink>
              <NavLink to="/register" className={navLinkStyles}>
                Register
              </NavLink>
            </>
          )}
        </div>

        {/* Hamburger Menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-slate-700 hover:text-indigo-600 transition"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 bg-white shadow text-slate-700 space-y-2">
          {user ? (
            <>
              <div className="font-medium">
                {user.email}{' '}
                <span className="text-xs text-slate-500">({user.role})</span>
              </div>

              <Link to="/" className={navLinkStyles} onClick={() => setMenuOpen(false)}>
                Home
              </Link>

              <Link to="/jobs" className={navLinkStyles} onClick={() => setMenuOpen(false)}>
                Jobs
              </Link>

              {/* Role-based links */}
              {user.role === 'job_seeker' && (
                <Link
                  to="/my-applications"
                  className={navLinkStyles}
                  onClick={() => setMenuOpen(false)}
                >
                  My Applications
                </Link>
              )}

              {(user.role === 'recruiter' || user.role === 'admin') && (
                <>
                  <Link
                    to="/dashboard"
                    className={navLinkStyles}
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/manage-applications"
                    className={navLinkStyles}
                    onClick={() => setMenuOpen(false)}
                  >
                    Manage Applications
                  </Link>
                </>
              )}

              <button
                onClick={logoutHandler}
                className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition mt-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className={navLinkStyles} onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link to="/login" className={navLinkStyles} onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className={navLinkStyles} onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;