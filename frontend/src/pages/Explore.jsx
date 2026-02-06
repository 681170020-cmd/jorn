import { useState } from 'react';

const Explore = () => {
    // Earth Tone Colors
    const colors = {
        bg: '#fdfaf6',
        cardBg: '#ffffff',
        primary: '#8b5e3c',
        textMain: '#3d2b1f',
        textSecondary: '#8d7b6d',
        border: 'rgba(139, 94, 60, 0.15)',
        heartActive: '#e74c3c',
        formBg: '#f0e9e4',
        tagBg: 'rgba(139, 94, 60, 0.1)',
        overlay: 'rgba(61, 43, 31, 0.4)'
    };

    // Sample initial posts for "Find Home" feature
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: 'คนรักหมา',
            petImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=800',
            petName: 'มิกกี้',
            gender: 'ชาย',
            age: '2 ปี',
            health: 'สุขภาพดี ฉีดวัคซีนครบ',
            location: 'กรุงเทพฯ ลาดพร้าว',
            deliveryMethod: 'นัดรับ',
            meetupPlace: 'หน้า Central Ladprao',
            content: 'น้องมิกกี้เป็นหมาพันธุ์ผสมนิสัยดีมากครับ กำลังหาบ้านใหม่ให้เพราะต้องย้ายไปต่างประเทศ 🐕',
            likes: 8,
            liked: false,
            comments: [
                { id: 1, author: 'ผู้รักสัตว์', text: 'น้องน่ารักมากเลยค่ะ สนใจมากๆ' }
            ]
        },
        {
            id: 2,
            author: 'บ้านแมวส้ม',
            petImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
            petName: 'ส้มจี๊ด',
            gender: 'หญิง',
            age: '1 ปี',
            health: 'ทำหมันแล้ว สุขภาพแข็งแรง',
            location: 'นนทบุรี ปากเกร็ด',
            deliveryMethod: 'ไปส่งให้',
            meetupPlace: '',
            content: 'น้องส้มจี๊ดเป็นแมวขี้อ้อนมากค่ะ ชอบนอนตักและเล่นของเล่น หาบ้านใหม่ที่มีเวลาให้น้องเยอะๆ 🐱💕',
            likes: 15,
            liked: false,
            comments: []
        }
    ]);

    const [showForm, setShowForm] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [commentText, setCommentText] = useState({});
    const [imagePreview, setImagePreview] = useState('');
    
    // New post form state
    const [newPost, setNewPost] = useState({
        petName: '',
        petImage: '',
        gender: 'ชาย',
        age: '',
        health: '',
        location: '',
        deliveryMethod: 'นัดรับ',
        meetupPlace: '',
        content: ''
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setNewPost({ ...newPost, petImage: previewUrl });
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
        if (!newPost.petName.trim() || !newPost.content.trim()) return;
        const post = {
            id: Date.now(),
            author: 'ผู้ใช้งาน',
            ...newPost,
            likes: 0,
            liked: false,
            comments: []
        };
        setPosts([post, ...posts]);
        setNewPost({
            petName: '',
            petImage: '',
            gender: 'ชาย',
            age: '',
            health: '',
            location: '',
            deliveryMethod: 'นัดรับ',
            meetupPlace: '',
            content: ''
        });
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
        header: { textAlign: 'center', marginBottom: '2rem', width: '100%', maxWidth: '700px' },
        title: { fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' },
        subtitle: { fontSize: '1rem', color: colors.textSecondary },
        feed: { width: '100%', maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
        card: { backgroundColor: colors.cardBg, borderRadius: '20px', border: `1px solid ${colors.border}`, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' },
        cardImage: { width: '100%', height: '280px', objectFit: 'cover' },
        cardBody: { padding: '1.5rem' },
        cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
        petName: { fontSize: '1.5rem', fontWeight: '700', color: colors.textMain, margin: 0 },
        author: { fontSize: '0.85rem', color: colors.textSecondary, marginTop: '0.2rem' },
        actions: { display: 'flex', gap: '0.5rem' },
        actionBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: colors.textSecondary },
        infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.8rem', marginBottom: '1rem' },
        infoItem: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' },
        infoLabel: { color: colors.textSecondary },
        infoValue: { fontWeight: '600' },
        tag: { display: 'inline-block', padding: '4px 12px', backgroundColor: colors.tagBg, color: colors.primary, borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', marginBottom: '1rem' },
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
        formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' },
        inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
        label: { fontSize: '0.85rem', fontWeight: '600', color: colors.textSecondary },
        input: { padding: '0.7rem 1rem', borderRadius: '12px', border: `1px solid ${colors.border}`, fontSize: '0.95rem', fontFamily: 'inherit' },
        select: { padding: '0.7rem 1rem', borderRadius: '12px', border: `1px solid ${colors.border}`, fontSize: '0.95rem', fontFamily: 'inherit', backgroundColor: 'white' },
        textarea: { width: '100%', padding: '1rem', borderRadius: '15px', border: `1px solid ${colors.border}`, fontSize: '1rem', resize: 'none', minHeight: '100px', fontFamily: 'inherit' },
        imageUploadArea: {
            border: `2px dashed ${colors.border}`,
            borderRadius: '15px',
            padding: '1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            gridColumn: 'span 2',
            transition: 'background-color 0.2s ease'
        },
        previewImg: {
            width: '100%',
            maxHeight: '200px',
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

    const getDeliveryLabel = (method, place) => {
        if (method === 'ไปส่งให้') return '🚗 ไปส่งให้ถึงบ้าน';
        if (method === 'มารับเอง') return '🏠 มารับเองที่บ้าน';
        if (method === 'นัดรับ') return `📍 นัดรับ: ${place}`;
        return method;
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>หาบ้านให้น้องจร</h1>
                <p style={styles.subtitle}>พื้นที่สำหรับประกาศหาบ้านใหม่และช่วยเหลือสัตว์เลี้ยงที่ต้องการความรัก</p>
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
                            
                            <h2 style={styles.formTitle}>ประกาศหาบ้าน</h2>
                            
                            <div style={styles.formGrid}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>ชื่อสัตว์เลี้ยง *</label>
                                    <input style={styles.input} placeholder="ชื่อน้อง" value={newPost.petName} onChange={(e) => setNewPost({...newPost, petName: e.target.value})} />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>เพศ</label>
                                    <select style={styles.select} value={newPost.gender} onChange={(e) => setNewPost({...newPost, gender: e.target.value})}>
                                        <option value="ชาย">ชาย</option>
                                        <option value="หญิง">หญิง</option>
                                        <option value="ไม่ทราบ">ไม่ทราบ</option>
                                    </select>
                                </div>
                                
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>อายุโดยประมาณ</label>
                                    <input style={styles.input} placeholder="เช่น 2 ปี" value={newPost.age} onChange={(e) => setNewPost({...newPost, age: e.target.value})} />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>สุขภาพ</label>
                                    <input style={styles.input} placeholder="เช่น สุขภาพดี" value={newPost.health} onChange={(e) => setNewPost({...newPost, health: e.target.value})} />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>ที่อยู่ปัจจุบัน</label>
                                    <input style={styles.input} placeholder="เช่น กรุงเทพฯ" value={newPost.location} onChange={(e) => setNewPost({...newPost, location: e.target.value})} />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>วิธีการส่งต่อ</label>
                                    <select style={styles.select} value={newPost.deliveryMethod} onChange={(e) => setNewPost({...newPost, deliveryMethod: e.target.value})}>
                                        <option value="ไปส่งให้">ไปส่งให้</option>
                                        <option value="มารับเอง">มารับเอง</option>
                                        <option value="นัดรับ">นัดรับ</option>
                                    </select>
                                </div>
                                {newPost.deliveryMethod === 'นัดรับ' && (
                                    <div style={{ ...styles.inputGroup, gridColumn: 'span 2' }}>
                                        <label style={styles.label}>สถานที่นัดรับ</label>
                                        <input style={styles.input} placeholder="ระบุสถานที่" value={newPost.meetupPlace} onChange={(e) => setNewPost({...newPost, meetupPlace: e.target.value})} />
                                    </div>
                                )}

                                <div style={styles.imageUploadArea} onClick={() => document.getElementById('petImageInput').click()} onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.formBg} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <input type="file" id="petImageInput" hidden accept="image/*" onChange={handleImageChange} />
                                    {imagePreview ? (
                                        <div>
                                            <p style={{ fontSize: '0.8rem', color: colors.primary }}>คลิกเพื่อเปลี่ยนรูป</p>
                                            <img src={imagePreview} alt="preview" style={styles.previewImg} />
                                        </div>
                                    ) : (
                                        <div>
                                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📸</div>
                                            <p style={{ fontSize: '0.9rem', color: colors.textSecondary }}>เพิ่มรูปภาพสัตว์เลี้ยง</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>รายละเอียดเพิ่มเติม *</label>
                                <textarea style={styles.textarea} placeholder="เล่าเรื่องราวเกี่ยวกับน้อง..." value={newPost.content} onChange={(e) => setNewPost({...newPost, content: e.target.value})} />
                            </div>

                            <button style={{ ...styles.smallBtn, width: '100%', padding: '1rem', marginTop: '1.5rem', fontSize: '1rem' }} onClick={handleAddPost}>
                                โพสต์ประกาศ
                            </button>
                        </div>
                    </div>
                )}

                {posts.map(post => (
                    <div key={post.id} style={styles.card}>
                        {post.petImage && <img src={post.petImage} alt={post.petName} style={styles.cardImage} />}
                        <div style={styles.cardBody}>
                            <div style={styles.cardHeader}>
                                <div>
                                    <h3 style={styles.petName}>{post.petName}</h3>
                                    <p style={styles.author}>โดย {post.author}</p>
                                </div>
                                <div style={styles.actions}>
                                    <button style={styles.actionBtn} onClick={() => setEditingPost(post.id)}>แก้ไข</button>
                                    <button style={styles.actionBtn} onClick={() => handleDeletePost(post.id)}>ลบ</button>
                                </div>
                            </div>

                            <div style={styles.infoGrid}>
                                <div style={styles.infoItem}><span style={styles.infoLabel}>เพศ:</span> <span style={styles.infoValue}>{post.gender}</span></div>
                                <div style={styles.infoItem}><span style={styles.infoLabel}>อายุ:</span> <span style={styles.infoValue}>{post.age}</span></div>
                                <div style={styles.infoItem}><span style={styles.infoLabel}>สุขภาพ:</span> <span style={styles.infoValue}>{post.health}</span></div>
                                <div style={styles.infoItem}><span style={styles.infoLabel}>ที่อยู่:</span> <span style={styles.infoValue}>{post.location}</span></div>
                            </div>

                            <span style={styles.tag}>{getDeliveryLabel(post.deliveryMethod, post.meetupPlace)}</span>

                            {editingPost === post.id ? (
                                <div style={{ marginBottom: '1rem' }}>
                                    <textarea 
                                        style={styles.textarea} 
                                        defaultValue={post.content} 
                                        id={`edit-explore-${post.id}`}
                                    />
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        <button 
                                            style={styles.smallBtn} 
                                            onClick={() => handleEditPost(post.id, document.getElementById(`edit-explore-${post.id}`).value)}
                                        >
                                            บันทึก
                                        </button>
                                        <button 
                                            style={styles.actionBtn} 
                                            onClick={() => setEditingPost(null)}
                                        >
                                            ยกเลิก
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p style={styles.content}>{post.content}</p>
                            )}

                            <div style={styles.interactionBar}>
                                <button style={{ ...styles.likeBtn, color: post.liked ? colors.heartActive : colors.textSecondary }} onClick={() => handleLike(post.id)}>
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

export default Explore;
