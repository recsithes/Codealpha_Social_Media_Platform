import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = ({ currentUser }) => {
  const { id } = useParams();
  const [profileUser, setProfileUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${id}`);
      setProfileUser(res.data);
    } catch (err) { console.error(err); }
  };

  const handleFollow = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/${id}/follow`);
      fetchUser();
    } catch (err) { console.error(err); }
  };

  if (!profileUser) return <div className="container">Loading...</div>;

  const isFollowing = profileUser.followers.includes(currentUser.id);

  return (
    <div className="container">
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <img 
          src={profileUser.avatar} 
          alt="avatar" 
          style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent)' }} 
        />
        <h2 style={{ fontSize: '2rem' }}>{profileUser.name}</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: 1.5 }}>
          {profileUser.bio || 'No bio provided.'}
        </p>

        <div style={{ display: 'flex', gap: '2rem', margin: '1rem 0', padding: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', width: '100%', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{profileUser.followers.length}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Followers</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{profileUser.following.length}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Following</span>
          </div>
        </div>

        {currentUser.id !== id && (
          <button onClick={handleFollow} className="btn-primary">
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
