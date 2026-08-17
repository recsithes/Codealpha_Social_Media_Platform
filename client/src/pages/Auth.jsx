import { useState } from 'react';
import axios from 'axios';

const Auth = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
    } catch (err) {
      alert(err.response?.data?.error || 'Authentication error');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="glass-panel" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>Orbit</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          {isLogin ? 'Welcome back.' : 'Join the universe.'}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input 
              type="text" placeholder="Name" required 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          )}
          <input 
            type="email" placeholder="Email" required 
            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} 
          />
          <input 
            type="password" placeholder="Password" required 
            value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} 
          />
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {isLogin ? 'New here?' : 'Already have an account?'}
          <span 
            style={{ color: 'var(--accent)', marginLeft: '5px', cursor: 'pointer' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Create an account' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
