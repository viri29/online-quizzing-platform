import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  const linkClass = ({ isActive }) => (isActive ? 'active' : undefined);

  return (
    <header>
      <nav className="navbar">
        <div className="logo">Online Quizzes</div>
        <ul className="nav-links">
          {!user && (
            <li id="login-item">
              <NavLink to="/login" id="login-link" className={linkClass}>Login</NavLink>
            </li>
          )}
          {!user && (
            <li id="register-item">
              <NavLink to="/register" id="register-link" className={linkClass}>Register</NavLink>
            </li>
          )}
          <li><NavLink to="/" end className={linkClass}>Home</NavLink></li>
          <li><NavLink to="/makequiz" className={linkClass}>Make a Quiz</NavLink></li>
          <li><NavLink to="/takequiz" className={linkClass}>Take Quiz</NavLink></li>
          <li><NavLink to="/account" className={linkClass}>Account</NavLink></li>
        </ul>
      </nav>
    </header>
  );
}
