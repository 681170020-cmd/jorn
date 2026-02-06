import { useState } from 'react';

const Community = () => {
    // Earth Tone Colors
    const colors = {
        bg: '#fdfaf6',
        cardBg: '#ffffff',
        primary: '#8b5e3c',
        textMain: '#3d2b1f',
        textSecondary: '#8d7b6d',
        border: 'rgba(139, 94, 60, 0.15)',
        heartActive: '#e74c3c',
        formBg: '#f0e9e4'
    };

    // Sample initial posts
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: 'คนรักหมา',
            content: 'น้องหมาที่บ้านไม่ยอมกินข้าวมา 2 วันแล้ว มีใครพอจะแนะนำวิธีได้บ้างคะ? 🐕',
            likes: 5,
            liked: false,
            comments: [
                { id: 1, author: 'หมอเจ', text: 'ลองเปลี่ยนอาหารหรือพาไปหาหมอครับ อาจมีปัญหาสุขภาพ' }
            ]
        },
        {
            id: 2,
            author: 'แมวส้ม',
            content: 'แมวที่บ้านเพิ่งคลอดลูก 4 ตัวค่ะ น่ารักมากๆ 🐱💕',
            likes: 12,
            liked: false,
            comments: []
        }
    ]);

    const [showForm, setShowForm] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [commentText, setCommentText] = useState({});
    const [newPost, setNewPost] = useState('');

    const handleLike = (postId) => {
        setPosts(posts.map(post => 
            post.id === postId 
                ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
                : post
        ));
    };

    const handleAddPost = () => {
        if (!newPost.trim()) return;
        const post = {
            id: Date.now(),
            author: 'ผู้ใช้งาน',
            content: newPost,
            likes: 0,
            liked: false,
            comments: []
        };
        setPosts([post, ...posts]);
        setNewPost('');
        setShowForm(false);
    };

    const handleDeletePost = (postId) => {
        setPosts(posts.filter(post => post.id !== postId));
    };

    const handleEditPost = (postId, newContent) => {
        if (!newContent.trim()) return;
        setPosts(posts.map(post => 
            post.id === postId ? { ...post, content: newContent } : post
        ));
        setEditingPost(null);
    };

    const handleAddComment = (postId) => {
        const text = commentText[postId];
        if (!text?.trim()) return;
        setPosts(posts.map(post => 
            post.id === postId 
                ? { ...post, comments: [...post.comments, { id: Date.now(), author: 'ผู้ใช้งาน', text }] }
                : post
        ));
        setCommentText({ ...commentText, [postId]: '' });
    };

    const styles = {
        container: {
            padding: '100px 2rem 50px',
            backgroundColor: colors.bg,
            minHeight: '100vh',
            width: '100%',
            fontFamily: "'Outfit', sans-serif",
            color: colors.textMain,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        header: {
            textAlign: 'center',
            marginBottom: '2rem',
            width: '100%',
            maxWidth: '700px'
        },
        title: { fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' },
        subtitle: { fontSize: '1rem', color: colors.textSecondary },
        feed: { width: '100%', maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
        createBtn: { padding: '0.8rem 1.5rem', borderRadius: '25px', border: 'none', backgroundColor: colors.primary, color: 'white', fontWeight: '700', cursor: 'pointer', marginBottom: '1.5rem', alignSelf: 'flex-start' },
        formCard: { backgroundColor: colors.formBg, borderRadius: '20px', padding: '1.5rem', marginBottom: '1.5rem' },
        textarea: { width: '100%', padding: '1rem', borderRadius: '15px', border: `1px solid ${colors.border}`, fontSize: '1rem', resize: 'none', minHeight: '100px', fontFamily: 'inherit', marginBottom: '1rem' },
        card: { backgroundColor: colors.cardBg, borderRadius: '20px', border: `1px solid ${colors.border}`, padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' },
        cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
        author: { fontWeight: '700', color: colors.primary },
        actions: { display: 'flex', gap: '0.5rem' },
        actionBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: colors.textSecondary },
        content: { fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem' },
        interactionBar: { display: 'flex', alignItems: 'center', gap: '1.5rem', paddingTop: '1rem', borderTop: `1px solid ${colors.border}` },
        likeBtn: { display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' },
        commentSection: { marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${colors.border}` },
        comment: { backgroundColor: colors.formBg, borderRadius: '12px', padding: '0.8rem 1rem', marginBottom: '0.5rem' },
        commentAuthor: { fontWeight: '600', fontSize: '0.85rem', color: colors.primary },
        commentText: { fontSize: '0.9rem' },
        commentInput: { display: 'flex', gap: '0.5rem', marginTop: '0.5rem' },
        commentInputField: { flex: 1, padding: '0.6rem 1rem', borderRadius: '20px', border: `1px solid ${colors.border}`, fontSize: '0.9rem' },
        smallBtn: { padding: '0.6rem 1rem', borderRadius: '20px', border: 'none', backgroundColor: colors.primary, color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Community</h1>
                <p style={styles.subtitle}>แลกเปลี่ยนข้อมูล สอบถามอาการ และปัญหาสุขภาพสัตว์เลี้ยง</p>
            </header>

            <main style={styles.feed}>
                <button style={styles.createBtn} onClick={() => setShowForm(!showForm)}>
                    {showForm ? '✕ ยกเลิก' : '+ เริ่มการสนทนา'}
                </button>

                {showForm && (
                    <div style={styles.formCard}>
                        <textarea 
                            style={styles.textarea}
                            placeholder="พิมพ์ข้อความที่ต้องการแลกเปลี่ยนหรือสอบถาม..."
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                        />
                        <button style={styles.smallBtn} onClick={handleAddPost}>โพสต์</button>
                    </div>
                )}

                {posts.map(post => (
                    <div key={post.id} style={styles.card}>
                        <div style={styles.cardHeader}>
                            <span style={styles.author}>{post.author}</span>
                            <div style={styles.actions}>
                                <button style={styles.actionBtn} onClick={() => setEditingPost(post.id)}>แก้ไข</button>
                                <button style={styles.actionBtn} onClick={() => handleDeletePost(post.id)}>ลบ</button>
                            </div>
                        </div>

                        {editingPost === post.id ? (
                            <div>
                                <textarea style={styles.textarea} defaultValue={post.content} id={`edit-${post.id}`} />
                                <button style={styles.smallBtn} onClick={() => handleEditPost(post.id, document.getElementById(`edit-${post.id}`).value)}>บันทึก</button>
                            </div>
                        ) : (
                            <p style={styles.content}>{post.content}</p>
                        )}

                        <div style={styles.interactionBar}>
                            <button 
                                style={{
                                    ...styles.likeBtn,
                                    color: post.liked ? colors.heartActive : colors.textSecondary,
                                    transform: post.liked ? 'scale(1.1)' : 'scale(1)'
                                }}
                                onClick={() => handleLike(post.id)}
                            >
                                {post.liked ? '❤️' : '🤍'} {post.likes}
                            </button>
                            <span style={{ color: colors.textSecondary, fontSize: '0.9rem' }}>💬 {post.comments.length} ความคิดเห็น</span>
                        </div>

                        <div style={styles.commentSection}>
                            {post.comments.map(c => (
                                <div key={c.id} style={styles.comment}>
                                    <div style={styles.commentAuthor}>{c.author}</div>
                                    <div style={styles.commentText}>{c.text}</div>
                                </div>
                            ))}
                            <div style={styles.commentInput}>
                                <input style={styles.commentInputField} placeholder="เขียนความคิดเห็น..." value={commentText[post.id] || ''} onChange={(e) => setCommentText({...commentText, [post.id]: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)} />
                                <button style={styles.smallBtn} onClick={() => handleAddComment(post.id)}>ส่ง</button>
                            </div>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
};

export default Community; 
