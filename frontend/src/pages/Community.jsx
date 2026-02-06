import { useState } from 'react';

const Community = () => {
    // Earth Tone Colors
    const colors = {
        bg: '#fdfaf6',
        cardBg: '#ffffff',
        primary: '#8b5e3c', // Brown
        textMain: '#3d2b1f',
        textSecondary: '#8d7b6d',
        border: 'rgba(139, 94, 60, 0.15)',
        heartActive: '#e74c3c',
        formBg: '#f0e9e4',
        overlay: 'rgba(61, 43, 31, 0.4)'
    };

    // Sample initial posts
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: 'คนรักหมา',
            image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=800',
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
            image: '',
            content: 'แมวที่บ้านเพิ่งคลอดลูก 4 ตัวค่ะ น่ารักมากๆ 🐱💕',
            likes: 12,
            liked: false,
            comments: []
        }
    ]);

    const [showForm, setShowForm] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [commentText, setCommentText] = useState({});
    const [imagePreview, setImagePreview] = useState('');
    const [newPost, setNewPost] = useState({
        content: '',
        image: ''
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setNewPost({ ...newPost, image: previewUrl });
        }
    };

    const handleLike = (postId) => {
        setPosts(posts.map(post => 
            post.id === postId 
                ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
                : post
        ));
    };

    const handleAddPost = () => {
        if (!newPost.content.trim()) return;
        const post = {
            id: Date.now(),
            author: 'ผู้ใช้งาน',
            content: newPost.content,
            image: newPost.image,
            likes: 0,
            liked: false,
            comments: []
        };
        setPosts([post, ...posts]);
        setNewPost({ content: '', image: '' });
        setImagePreview('');
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
        card: { backgroundColor: colors.cardBg, borderRadius: '20px', border: `1px solid ${colors.border}`, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' },
        cardBody: { padding: '1.5rem' },
        cardImage: { width: '100%', height: '300px', objectFit: 'cover', display: 'block' },
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
        smallBtn: { padding: '0.6rem 1.2rem', borderRadius: '20px', border: 'none', backgroundColor: colors.primary, color: 'white', fontWeight: '600', cursor: 'pointer' },
        
        // Modal Styles
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: colors.overlay,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(4px)'
        },
        modalCard: {
            backgroundColor: 'white',
            borderRadius: '24px',
            width: '90%',
            maxWidth: '600px',
            padding: '2rem',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            animation: 'modalSlideUp 0.3s ease-out'
        },
        formTitle: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' },
        inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
        label: { fontSize: '0.85rem', fontWeight: '600', color: colors.textSecondary },
        textarea: { width: '100%', padding: '1rem', borderRadius: '15px', border: `1px solid ${colors.border}`, fontSize: '1rem', resize: 'none', minHeight: '100px', fontFamily: 'inherit' },
        imageUploadArea: {
            border: `2px dashed ${colors.border}`,
            borderRadius: '15px',
            padding: '1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '1.2rem',
            transition: 'background-color 0.2s ease'
        },
        previewImg: {
            width: '100%',
            maxHeight: '300px',
            objectFit: 'cover',
            borderRadius: '10px',
            marginTop: '0.5rem'
        },

        // FAB Styles
        fab: {
            position: 'fixed',
            bottom: '40px',
            right: '40px',
            backgroundColor: colors.primary,
            color: 'white',
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(139, 94, 60, 0.3)',
            border: 'none',
            zIndex: 1000,
            gap: '2px',
            transition: 'transform 0.2s ease, background-color 0.2s ease',
        },
        fabIcon: { fontSize: '24px', fontWeight: '400', lineHeight: 1 },
        fabText: { fontSize: '0.7rem', fontWeight: '600' }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Community</h1>
                <p style={styles.subtitle}>แลกเปลี่ยนข้อมูล สอบถามอาการ และปัญหาสุขภาพสัตว์เลี้ยง</p>
            </header>

            <main style={styles.feed}>
                {/* Floating Action Button */}
                <button 
                    style={styles.fab} 
                    onClick={() => setShowForm(true)}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <span style={styles.fabIcon}>+</span>
                    <span style={styles.fabText}>โพสต์</span>
                </button>

                {/* Modal Form */}
                {showForm && (
                    <div style={styles.modalOverlay} onClick={() => setShowForm(false)}>
                        <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
                            <button 
                                onClick={() => setShowForm(false)} 
                                style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
                            >✕</button>
                            
                            <h2 style={styles.formTitle}>เริ่มต้นการสนทนา</h2>
                            
                            <div style={styles.imageUploadArea} onClick={() => document.getElementById('communityImageInput').click()} onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.formBg} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                <input type="file" id="communityImageInput" hidden accept="image/*" onChange={handleImageChange} />
                                {imagePreview ? (
                                    <div>
                                        <p style={{ fontSize: '0.8rem', color: colors.primary }}>คลิกเพื่อเปลี่ยนรูป</p>
                                        <img src={imagePreview} alt="preview" style={styles.previewImg} />
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📸</div>
                                        <p style={{ fontSize: '0.9rem', color: colors.textSecondary }}>เพิ่มรูปภาพประกอบ (ถ้ามี)</p>
                                    </div>
                                )}
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>ข้อความของคุณ *</label>
                                <textarea 
                                    style={styles.textarea}
                                    placeholder="พิมพ์ข้อความที่ต้องการแลกเปลี่ยนหรือสอบถาม..."
                                    value={newPost.content}
                                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                                />
                            </div>

                            <button style={{ ...styles.smallBtn, width: '100%', padding: '1rem', marginTop: '1.5rem', fontSize: '1rem' }} onClick={handleAddPost}>
                                โพสต์
                            </button>
                        </div>
                    </div>
                )}

                {posts.map(post => (
                    <div key={post.id} style={styles.card}>
                        {post.image && <img src={post.image} alt="post" style={styles.cardImage} />}
                        <div style={styles.cardBody}>
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
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    <button style={styles.smallBtn} onClick={() => handleEditPost(post.id, document.getElementById(`edit-${post.id}`).value)}>บันทึก</button>
                                    <button style={styles.actionBtn} onClick={() => setEditingPost(null)}>ยกเลิก</button>
                                </div>
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
                    </div>
                ))}
            </main>

            <style>
                {`
                    @keyframes modalSlideUp {
                        from { transform: translateY(20px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                `}
            </style>
        </div>
    );
};

export default Community;
