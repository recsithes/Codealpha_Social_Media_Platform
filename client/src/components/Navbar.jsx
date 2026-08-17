import { Link } from 'react-router-dom';
import { Planet, SignOut } from '@phosphor-icons/react';

const Navbar = ({ user, setUser }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <nav style={{ 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)',
      position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)',
      background: 'rgba(15, 23, 42, 0.8)'
    }}>
      <Link to="/feed" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.5rem', color: 'var(--text-primary)' }}>
        <Planet size={32} weight="fill" color="var(--accent)" />
        Orbit
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to={`/profile/${user.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src={user.avatar} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
          <span style={{ fontWeight: 600 }}>{user.name}</span>
        </Link>
        <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <SignOut size={24} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
