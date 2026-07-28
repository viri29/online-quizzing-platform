import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      alert('You are not logged in.');
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignOut = () => {
    logout();
    alert('You have been signed out.');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <main className="account-page">
      <div className="account-info">
        <h2>Your Account</h2>
        <p>
          <strong>First Name:</strong> <span id="first-name">{user.firstName}</span>
        </p>
        <p>
          <strong>Last Name:</strong> <span id="last-name">{user.lastName}</span>
        </p>
        <p>
          <strong>Email:</strong> <span id="email">{user.email}</span>
        </p>
        <p>
          <strong>Username:</strong> <span id="username">{user.username}</span>
        </p>
        <button id="sign-out-button" className="sign-out-button" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </main>
  );
}
