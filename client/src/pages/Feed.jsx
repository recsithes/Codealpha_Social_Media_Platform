import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Heart, ChatCircle, PaperPlaneTilt } from '@phosphor-icons/react';

const Feed = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [commentsData, setCommentsData] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts');
      setPosts(res.data);
    } catch (err) { console.error(err); }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    try {
      await axios.post('http://localhost:5000/api/posts', { content: newPost });
      setNewPost('');
      fetchPosts();
    } catch (err) { console.error(err); }
  };

  const handleLike = async (postId) => {
    try {
      await axios.put(`http://localhost:5000/api/posts/${postId}/like`);
      fetchPosts();
    } catch (err) { console.error(err); }
  };

  const loadComments = async (postId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts/${postId}/comments`);
      setCommentsData(prev => ({ ...prev, [postId]: { ...prev[postId], list: res.data, show: true } }));
    } catch (err) { console.error(err); }
  };

  const toggleComments = (postId) => {
    const isShowing = commentsData[postId]?.show;
    if (isShowing) {
      setCommentsData(prev => ({ ...prev, [postId]: { ...prev[postId], show: false } }));
    } else {
      loadComments(postId);
    }
  };

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    const content = commentsData[postId]?.input;
    if (!content) return;
    try {
      await axios.post(`http://localhost:5000/api/posts/${postId}/comments`, { content });
      setCommentsData(prev => ({ ...prev, [postId]: { ...prev[postId], input: '' } }));
      loadComments(postId);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="container">
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <form onSubmit={handlePostSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <textarea 
            placeholder="What's on your mind?" 
            value={newPost} onChange={e => setNewPost(e.target.value)}
            style={{ marginBottom: '1rem' }} required
          />
          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end' }}>
            <PaperPlaneTilt weight="bold" /> Post
          </button>
        </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {posts.map(post => (
          <div key={post._id} className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <img src={post.author.avatar} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <Link to={`/profile/${post.author._id}`} style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {post.author.name}
                </Link>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {new Date(post.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
            
            <p style={{ marginBottom: '1.5rem', lineHeight: 1.5 }}>{post.content}</p>
            
            <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
              <button onClick={() => handleLike(post._id)} style={{ background: 'transparent', border: 'none', color: post.likes.includes(user.id) ? 'var(--danger)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '1rem' }}>
                <Heart weight={post.likes.includes(user.id) ? 'fill' : 'regular'} /> {post.likes.length}
              </button>
              <button onClick={() => toggleComments(post._id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '1rem' }}>
                <ChatCircle />
              </button>
            </div>

            {commentsData[post._id]?.show && (
              <div style={{ marginTop: '1.5rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                  {commentsData[post._id]?.list?.map(c => (
                    <div key={c._id} style={{ display: 'flex', gap: '0.75rem' }}>
                      <img src={c.author.avatar} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px', flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{c.author.name}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{c.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={(e) => handleCommentSubmit(e, post._id)} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" placeholder="Write a comment..." required 
                    style={{ marginBottom: 0, flex: 1 }}
                    value={commentsData[post._id]?.input || ''}
                    onChange={e => setCommentsData(prev => ({ ...prev, [post._id]: { ...prev[post._id], input: e.target.value } }))}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Post</button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
