import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (password !== repassword) {
      setMessage('Passwords do not match!');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/register', {
        email,
        username,
        password,
      });

      setMessage(res.data.message);
      setLoading(false);

      setTimeout(() => {
        navigate('/login');
      }, 1500); // Give user 1.5s to read the success message
    } catch (err) {
      if (err.response && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage('Server error. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="Login-cont">
      <h1>Register</h1>
      <form onSubmit={handleRegister} className="register-form">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        <label htmlFor="repassword">Confirm Password</label>
        <input
          id="repassword"
          name="repassword"
          type="password"
          placeholder="Retype your password"
          value={repassword}
          onChange={(e) => setRepassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      {message && <p className="message">{message}</p>}

      <p className="login-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;
