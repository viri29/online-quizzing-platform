import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header>
      <nav className="navbar">
        <div className="logo">Online Quizzes</div>
        <ul className="nav-links">
          {!user && (
            <li id="login-item">
              <Link to="/login" id="login-link">Login</Link>
            </li>
          )}
          {!user && (
            <li id="register-item">
              <Link to="/register" id="register-link">Register</Link>
            </li>
          )}
          <li><Link to="/">Home</Link></li>
          <li><Link to="/makequiz">Make a Quiz</Link></li>
          <li><Link to="/takequiz">Take Quiz</Link></li>
          <li><Link to="/account">Account</Link></li>
        </ul>
      </nav>
    </header>
  );
}
