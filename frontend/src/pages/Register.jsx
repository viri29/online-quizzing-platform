import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { API_URL } from '../api';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
};

export default function Register() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (user) {
      toast.success('You are already logged in. Redirecting to the home page...');
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success('Registration successful!');
      navigate('/login');
    } else {
      toast.error(data.error);
    }
  };

  return (
    <main>
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create an Account</h2>
        <input
          type="text"
          id="firstName"
          name="firstName"
          placeholder="First Name"
          required
          value={form.firstName}
          onChange={handleChange('firstName')}
        />
        <input
          type="text"
          id="lastName"
          name="lastName"
          placeholder="Last Name"
          required
          value={form.lastName}
          onChange={handleChange('lastName')}
        />
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange('email')}
        />
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          required
          value={form.username}
          onChange={handleChange('username')}
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={handleChange('password')}
        />
        <button type="submit">Register</button>
      </form>
    </main>
  );
}
