import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Layout({ children }) {
  const { isAuthenticated, user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          DCG Event
        </Link>
        <nav className="nav">
          <NavLink to="/">Events</NavLink>
          {isAuthenticated ? <NavLink to="/dashboard">Dashboard</NavLink> : null}
          {isAuthenticated ? <NavLink to="/account">Account</NavLink> : null}
          {isAdmin ? <NavLink to="/admin">Admin Portal</NavLink> : null}
        </nav>
        <div className="auth-area">
          {isAuthenticated ? (
            <>
              <span className="user-pill">{user?.name}</span>
              <button onClick={logout} className="ghost-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="ghost-btn">
                Login
              </Link>
              <Link to="/register" className="solid-btn">
                Register
              </Link>
            </>
          )}
        </div>
      </header>
      <main className="page">{children}</main>
    </div>
  );
}
