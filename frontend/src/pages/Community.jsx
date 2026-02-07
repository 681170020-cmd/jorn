import { useState } from 'react';

const Community = () => {
  const colors = {
    bg: '#F0F2F5',
    card: '#ffffff',
    border: '#E4E6EB',
    textMain: '#050505',
    textSub: '#65676B',
    knowledge: '#0056b3',
    general: '#14a24d',
    heart: '#F33E58',
    commentBg: '#F0F2F5'
  };

  const [activeTab, setActiveTab] = useState('knowledge');
  
  const [knowledgePosts, setKnowledgePosts] = useState([
    {
      id: 1,
      author: 'Academic Team',
      time: '2 ชม.',
      content: 'อัปเดตงานวิจัยใหม่: การใช้เสียงดนตรีบำบัดช่วยลดความเครียดในสัตว์เลี้ยงได้จริงหรือไม่?',
      image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=500',
      likes: 125,
      liked: false,
      comments: [
        { 
          id: 101, 
          author: 'Dr. Mike', 
          text: 'หัวข้อนี้น่าสนใจมากครับ มีแหล่งอ้างอิงไหม?', 
          likes: 8, 
          liked: false, 
          replies: [{ id: 301, author: 'Admin', text: 'ส่งให้ทาง DM แล้วครับคุณหมอ', likes: 2, liked: false }] 
        }
      ]
    }
  ]);

  const [generalPosts, setGeneralPosts] = useState([]);

  const currentPosts = activeTab === 'knowledge' ? knowledgePosts : generalPosts;
  const setCurrentPosts = activeTab === 'knowledge' ? setKnowledgePosts : setGeneralPosts;
  const activeColor = activeTab === 'knowledge' ? colors.knowledge : colors.general;

  const [selectedPost, setSelectedPost] = useState(null); 
  const [commentText, setCommentText] = useState('');
  const [replyTarget, setReplyTarget] = useState(null);
  const [replyText, setReplyText] = useState('');

  /* ---------- Logic Functions ---------- */

  const toggleLikePost = (postId) => {
    const update = (posts) => posts.map(p => 
      p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    );
    setCurrentPosts(update);
    if (selectedPost?.id === postId) setSelectedPost(update([selectedPost])[0]);
  };

  const toggleLikeComment = (postId, commentId, isReply = false, replyId = null) => {
    const update = (posts) => posts.map(p => {
      if (p.id !== postId) return p;
      return {
        ...p,
        comments: p.comments.map(c => {
          if (!isReply && c.id === commentId) {
            return { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 };
          }
          if (isReply && c.id === commentId) {
            return {
              ...c,
              replies: c.replies.map(r => r.id === replyId ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 } : r)
            };
          }
          return c;
        })
      };
    });
    setCurrentPosts(update);
    if (selectedPost) setSelectedPost(update([selectedPost])[0]);
  };

  const handleAddComment = (postId) => {
    if (!commentText.trim()) return;
    const newComment = { id: Date.now(), author: 'คุณ', text: commentText, likes: 0, liked: false, replies: [] };
    const update = (posts) => posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p);
    setCurrentPosts(update);
    if (selectedPost) setSelectedPost(update([selectedPost])[0]);
    setCommentText('');
  };

  const handleAddReply = (postId, commentId) => {
    if (!replyText.trim()) return;
    const newReply = { id: Date.now(), author: 'คุณ', text: replyText, likes: 0, liked: false };
    const update = (posts) => posts.map(p => p.id === postId ? {
      ...p,
      comments: p.comments.map(c => c.id === commentId ? { ...c, replies: [...c.replies, newReply] } : c)
    } : p);
    setCurrentPosts(update);
    if (selectedPost) setSelectedPost(update([selectedPost])[0]);
    setReplyText('');
    setReplyTarget(null);
  };

  // ฟังก์ชันรองรับการกด Enter
  const handleKeyPress = (e, type, postId, commentId = null) => {
    if (e.key === 'Enter') {
      if (type === 'comment') handleAddComment(postId);
      if (type === 'reply') handleAddReply(postId, commentId);
    }
  };

  const s = {
    card: { background: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '16px', border: `1px solid ${colors.border}`, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' },
    btnAction: (active, color) => ({ background: 'none', border: 'none', cursor: 'pointer', color: active ? color : colors.textSub, fontWeight: 'bold', fontSize: '14px', flex: 1, padding: '8px', display: 'flex', justifyContent: 'center', gap: '5px' }),
    bubble: { background: colors.commentBg, padding: '8px 12px', borderRadius: '18px', display: 'inline-block' },
    tab: (active, type) => ({
      flex: 1, padding: '15px 0', border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold',
      color: active ? (type === 'knowledge' ? colors.knowledge : colors.general) : colors.textSub,
      borderBottom: active ? `4px solid ${type === 'knowledge' ? colors.knowledge : colors.general}` : '4px solid transparent'
    })
  };

  return (
    <div style={{ background: colors.bg, minHeight: '100vh', fontFamily: 'Sarabun, sans-serif' }}>
      
      {/* Header & Tabs */}
      <div style={{ background: '#fff', borderBottom: `1px solid ${colors.border}`, position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', fontSize: '24px', padding: '15px 0 5px 0', margin: 0, color: activeColor }}>COMMUNITY</h1>
          <div style={{ display: 'flex' }}>
            <button style={s.tab(activeTab === 'knowledge', 'knowledge')} onClick={() => setActiveTab('knowledge')}>📖 สาระน่ารู้</button>
            <button style={s.tab(activeTab === 'general', 'general')} onClick={() => setActiveTab('general')}>💬 คุยเล่นทั่วไป</button>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div style={{ maxWidth: '600px', margin: '15px auto', padding: '0 10px' }}>
        {currentPosts.map(p => (
          <div key={p.id} style={s.card}>
            {/* Post Header */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ddd', fontSize: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{activeTab === 'knowledge' ? '💡' : '😊'}</div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{p.author}</div>
                <div style={{ fontSize: '12px', color: colors.textSub }}>{p.time}</div>
              </div>
            </div>

            <p style={{ margin: '0 0 10px 0', lineHeight: '1.5' }}>{p.content}</p>
            {p.image && <img src={p.image} style={{ width: 'calc(100% + 32px)', marginLeft: '-16px', marginBottom: '10px' }} alt="post" />}

            {/* Stats */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: colors.textSub, padding: '5px 0' }}>
              <span>❤️ {p.likes} คนถูกใจ</span>
              <span onClick={() => setSelectedPost(p)} style={{ cursor: 'pointer' }}>{p.comments.length} ความคิดเห็น</span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}`, margin: '5px 0' }}>
              <button style={s.btnAction(p.liked, colors.heart)} onClick={() => toggleLikePost(p.id)}>{p.liked ? '❤️ ถูกใจแล้ว' : '🤍 ถูกใจ'}</button>
              <button style={s.btnAction(false)} onClick={() => setSelectedPost(p)}>💬 ตอบกลับ</button>
            </div>

            {/* Preview 2 Comments */}
            <div style={{ marginTop: '10px' }}>
              {p.comments.slice(-2).map(c => (
                <div key={c.id} style={{ marginBottom: '8px', display: 'flex', gap: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eee', flexShrink: 0 }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={s.bubble}>
                      <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{c.author}</div>
                      <div style={{ fontSize: '13px' }}>{c.text}</div>
                    </div>
                    <div style={{ fontSize: '11px', color: colors.textSub, marginTop: '2px', marginLeft: '10px', fontWeight: 'bold' }}>
                      <span onClick={() => toggleLikeComment(p.id, c.id)} style={{ cursor: 'pointer', color: c.liked ? colors.heart : colors.textSub }}>ถูกใจ ({c.likes})</span>
                      <span onClick={() => { setSelectedPost(p); setReplyTarget({ commentId: c.id, author: c.author }); }} style={{ cursor: 'pointer', marginLeft: '15px' }}>ตอบกลับ</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Full Post & Replies */}
      {selectedPost && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }} onClick={() => { setSelectedPost(null); setReplyTarget(null); }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '550px', height: '85vh', borderRadius: '15px', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '15px', textAlign: 'center', borderBottom: `1px solid ${colors.border}`, fontWeight: 'bold', position: 'relative' }}>
              ความคิดเห็น
              <button onClick={() => setSelectedPost(null)} style={{ position: 'absolute', right: '15px', top: '12px', border: 'none', background: '#eee', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
              {selectedPost.comments.map(c => (
                <div key={c.id} style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#eee' }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={s.bubble}>
                        <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{c.author}</div>
                        <div>{c.text}</div>
                      </div>
                      <div style={{ fontSize: '12px', color: colors.textSub, marginTop: '4px', marginLeft: '10px', fontWeight: 'bold' }}>
                        <span onClick={() => toggleLikeComment(selectedPost.id, c.id)} style={{ cursor: 'pointer', color: c.liked ? colors.heart : colors.textSub }}>ถูกใจ ({c.likes})</span>
                        <span onClick={() => setReplyTarget({ commentId: c.id, author: c.author })} style={{ cursor: 'pointer', marginLeft: '15px' }}>ตอบกลับ</span>
                      </div>

                      {/* Nested Replies */}
                      {c.replies.map(r => (
                        <div key={r.id} style={{ display: 'flex', gap: '10px', marginTop: '10px', marginLeft: '40px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ddd' }}></div>
                          <div style={{ flex: 1 }}>
                            <div style={{ ...s.bubble, background: '#E9EBEE' }}>
                              <strong>{r.author}</strong> {r.text}
                            </div>
                            <div style={{ fontSize: '11px', color: colors.textSub, marginTop: '2px', fontWeight: 'bold' }}>
                              <span onClick={() => toggleLikeComment(selectedPost.id, c.id, true, r.id)} style={{ cursor: 'pointer', color: r.liked ? colors.heart : colors.textSub }}>ถูกใจ ({r.likes})</span>
                              {/* สามารถตอบกลับในระดับ Reply ได้ด้วย */}
                              <span onClick={() => setReplyTarget({ commentId: c.id, author: r.author })} style={{ cursor: 'pointer', marginLeft: '10px', color: colors.textSub }}>ตอบกลับ</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input พื้นที่พิมพ์พร้อมระบบ Enter */}
            <div style={{ padding: '15px', borderTop: `1px solid ${colors.border}` }}>
              {replyTarget && (
                <div style={{ fontSize: '12px', color: activeColor, marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>กำลังตอบกลับคุณ {replyTarget.author}...</span>
                  <span onClick={() => setReplyTarget(null)} style={{ cursor: 'pointer', color: '#999' }}>ยกเลิก</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  style={{ flex: 1, background: colors.commentBg, border: 'none', borderRadius: '20px', padding: '10px 15px', outline: 'none' }}
                  placeholder={replyTarget ? "เขียนคำตอบของคุณ..." : "เขียนความคิดเห็น..."}
                  value={replyTarget ? replyText : commentText}
                  onChange={(e) => replyTarget ? setReplyText(e.target.value) : setCommentText(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, replyTarget ? 'reply' : 'comment', selectedPost.id, replyTarget?.commentId)}
                />
                <button 
                  onClick={() => replyTarget ? handleAddReply(selectedPost.id, replyTarget.commentId) : handleAddComment(selectedPost.id)}
                  style={{ border: 'none', background: 'none', color: activeColor, fontWeight: 'bold', cursor: 'pointer' }}
                >ส่ง</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;