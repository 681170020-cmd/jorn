import { useState } from 'react';

const Community = ({ user, onLoginClick }) => {
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

    // Category Tabs
    const [activeTab, setActiveTab] = useState('general'); // 'general' or 'knowledge'

    // Sample initial posts
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: 'คนรักหมา',
            handle: 'doglover',
            category: 'general',
            avatar: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=800',
            image: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=800',
            content: 'น้องหมาที่บ้านไม่ยอมกินข้าวมา 2 วันแล้ว มีใครพอจะแนะนำวิธีได้บ้างคะ? 🐕',
            likes: 5,
            liked: false,
            comments: [
                { 
                    id: 1, 
                    author: 'หมอเจ', 
                    text: 'ลองเปลี่ยนอาหารหรือพาไปหาหมอครับ อาจมีปัญหาสุขภาพ',
                    likes: 2,
                    liked: false,
                    replies: []
                }
            ]
        },
        {
            id: 2,
            author: 'แมวส้ม',
            handle: 'orange_cat',
            category: 'knowledge',
            avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
            image: '',
            content: 'รู้หรือไม่? แมวสื่อสารกับเราผ่านการกระพริบตาช้าๆ ซึ่งหมายถึงการบอกรักนั่นเอง 🐱💕',
            likes: 12,
            liked: false,
            comments: []
        }
    ]);

    const [showForm, setShowForm] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState('');
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null); // { postId, commentId }
    const [commentText, setCommentText] = useState({});
    const [imagePreview, setImagePreview] = useState('');
    const [newPost, setNewPost] = useState({
        content: '',
        image: '',
        category: 'general'
    });

    const selectedPost = posts.find(p => p.id === selectedPostId);

    const handleImageChange = (e, isEdit = false) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const previewUrl = reader.result;
                if (isEdit) {
                    setEditImagePreview(previewUrl);
                } else {
                    setImagePreview(previewUrl);
                    setNewPost({ ...newPost, image: previewUrl });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLike = (postId) => {
        if (!user) {
            onLoginClick();
            return;
        }
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
            author: user?.name || 'ผู้ใช้งาน',
            handle: user?.name?.toLowerCase().replace(/\s/g, '') || 'user',
            avatar: user?.avatar || '',
            category: newPost.category,
            content: newPost.content,
            image: newPost.image,
            likes: 0,
            liked: false,
            comments: []
        };
        setPosts([post, ...posts]);
        setNewPost({ content: '', image: '', category: 'general' });
        setImagePreview('');
        setShowForm(false);
    };

    const handleDeletePost = (postId) => {
        setPosts(posts.filter(post => post.id !== postId));
        if (selectedPostId === postId) setSelectedPostId(null);
    };

    const handleEditPost = (postId, newContent, newImage) => {
        if (!newContent.trim()) return;
        setPosts(posts.map(post => 
            post.id === postId ? { ...post, content: newContent, image: newImage } : post
        ));
        setEditingPost(null);
        setEditImagePreview('');
    };

    const handleAddComment = (postId) => {
        if (!user) {
            onLoginClick();
            return;
        }
        const text = commentText[postId];
        if (!text?.trim()) return;
        setPosts(posts.map(post => 
            post.id === postId 
                ? { 
                    ...post, 
                    comments: [...post.comments, { 
                        id: Date.now(), 
                        author: user?.name || 'ผู้ใช้งาน', 
                        text,
                        likes: 0,
                        liked: false,
                        replies: []
                    }] 
                }
                : post
        ));
        setCommentText({ ...commentText, [postId]: '' });
    };

    const handleLikeComment = (postId, commentId) => {
        if (!user) {
            onLoginClick();
            return;
        }
        setPosts(posts.map(post => {
            if (post.id !== postId) return post;
            return {
                ...post,
                comments: post.comments.map(comment => 
                    comment.id === commentId 
                        ? { 
                            ...comment, 
                            liked: !comment.liked, 
                            likes: comment.liked ? comment.likes - 1 : comment.likes + 1 
                        }
                        : comment
                )
            };
        }));
    };

    const handleReply = (postId, commentId, text) => {
        if (!user) {
            onLoginClick();
            return;
        }
        if (!text?.trim()) return;
        setPosts(posts.map(post => {
            if (post.id !== postId) return post;
            return {
                ...post,
                comments: post.comments.map(comment => 
                    comment.id === commentId 
                        ? { 
                            ...comment, 
                            replies: [...comment.replies, { 
                                id: Date.now(), 
                                author: user?.name || 'ผู้ใช้งาน', 
                                text 
                            }] 
                        }
                        : comment
                )
            };
        }));
        setReplyingTo(null);
        setCommentText({ ...commentText, [`reply-${commentId}`]: '' });
    };

    const styles = {
        container: {
            padding: '120px 2rem 50px',
            backgroundColor: colors.bg,
            minHeight: '100vh',
            fontFamily: "'Outfit', sans-serif"
        },
        header: { maxWidth: '800px', margin: '0 auto 3rem', textAlign: 'center' },
        title: { fontSize: '3rem', fontWeight: '800', color: colors.textMain, marginBottom: '0.8rem', letterSpacing: '-1px' },
        subtitle: { fontSize: '1.2rem', color: colors.textSecondary, fontWeight: '500' },
        
        tabsContainer: { display: 'flex', gap: '0.8rem', justifyContent: 'center', marginBottom: '3rem' },
        tab: {
            padding: '0.8rem 2rem',
            borderRadius: '16px',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        },
        activeTab: { backgroundColor: colors.primary, color: 'white', transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(139, 94, 60, 0.25)' },
        inactiveTab: { backgroundColor: colors.cardBg, color: colors.textSecondary },

        feed: { maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
        card: {
            backgroundColor: colors.cardBg, padding: '1.8rem', borderRadius: '28px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: `1px solid ${colors.border}`,
            display: 'flex', gap: '1.2rem', cursor: 'pointer', transition: 'all 0.3s ease',
            position: 'relative', overflow: 'hidden'
        },
        avatarColumn: { flexShrink: 0 },
        avatarCircle: {
            width: '55px', height: '55px', borderRadius: '50%',
            backgroundColor: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: '700', fontSize: '1.4rem', overflow: 'hidden'
        },
        avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
        contentColumn: { flex: 1, minWidth: 0 },
        cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' },
        authorInfo: { display: 'flex', flexDirection: 'column' },
        author: { fontSize: '1.1rem', fontWeight: '800', color: colors.textMain, margin: 0 },
        handle: { fontSize: '0.9rem', color: colors.textSecondary, fontWeight: '500' },
        content: { fontSize: '1.05rem', lineHeight: '1.6', color: colors.textMain, marginBottom: '1.2rem', whiteSpace: 'pre-wrap' },
        cardImage: { width: '100%', borderRadius: '20px', marginBottom: '1.2rem', border: `1px solid ${colors.border}`, maxHeight: '450px', objectFit: 'cover' },
        
        interactionBar: { display: 'flex', gap: '2rem', borderTop: `1px solid ${colors.border}`, paddingTop: '1rem' },
        likeBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600', transition: 'all 0.2s' },
        commentBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', color: colors.textSecondary, fontWeight: '600' },

        modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: colors.overlay, backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '1rem' },
        modalCard: { backgroundColor: 'white', padding: '3rem', borderRadius: '35px', width: '100%', maxWidth: '600px', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.1)' },
        
        detailModalCard: { 
            backgroundColor: 'white', 
            borderRadius: '35px', 
            width: '100%', 
            maxWidth: '1100px', 
            height: '85vh',
            display: 'flex',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 25px 50px rgba(0,0,0,0.1)'
        },
        detailModalScroll: {
            padding: '3rem',
            overflowY: 'auto',
            width: '100%'
        },
        detailCloseBtn: { 
            position: 'absolute', top: '25px', right: '25px', 
            background: colors.bg, border: 'none', borderRadius: '50%',
            width: '40px', height: '40px', fontSize: '1.2rem', cursor: 'pointer', 
            color: colors.textMain, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'
        },
        
        commentSection: { marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${colors.border}` },
        commentInput: { display: 'flex', gap: '0.8rem', marginBottom: '2rem' },
        commentInputField: { flex: 1, padding: '1rem 1.5rem', borderRadius: '15px', border: `1.5px solid ${colors.border}`, outline: 'none', fontSize: '1rem', fontFamily: 'inherit' },
        smallBtn: { padding: '0.8rem 1.5rem', borderRadius: '12px', border: 'none', backgroundColor: colors.primary, color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' },
        
        commentList: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
        commentItem: { display: 'flex', gap: '1rem' },
        commentAvatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: colors.formBg, flexShrink: 0, overflow: 'hidden' },
        commentContent: { flex: 1, backgroundColor: colors.bg, padding: '1.2rem', borderRadius: '0 20px 20px 20px' },
        commentAuthor: { fontSize: '0.95rem', fontWeight: '800', marginBottom: '0.3rem', display: 'block' },
        commentText: { fontSize: '0.95rem', lineHeight: '1.5', color: colors.textMain },
        
        actions: { display: 'flex', gap: '0.8rem' },
        actionBtn: { background: 'none', border: 'none', color: colors.textSecondary, fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', padding: '0' },
        
        replyBtn: { background: 'none', border: 'none', color: colors.primary, fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', padding: '0', marginTop: '0.5rem' },
        commentLikeBtn: { background: 'none', border: 'none', color: colors.textSecondary, fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', padding: '0', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' },
        replySection: { marginLeft: '1.5rem', marginTop: '1rem', borderLeft: `2px solid ${colors.border}`, paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
        replyItem: { display: 'flex', gap: '0.8rem' },
        replyContent: { flex: 1, backgroundColor: colors.bg, padding: '0.8rem 1rem', borderRadius: '0 15px 15px 15px' },
        replyAuthor: { fontSize: '0.9rem', fontWeight: '800', marginBottom: '0.2rem', display: 'block' },
        replyText: { fontSize: '0.9rem', lineHeight: '1.4', color: colors.textMain },

        detailDescription: {
            fontSize: '1.1rem',
            lineHeight: '1.6',
            color: colors.textMain,
            marginBottom: '1.5rem'
        },
        detailLargeImage: {
            width: '100%',
            maxHeight: '600px',
            objectFit: 'cover',
            borderRadius: '24px',
            margin: '1.5rem 0',
            border: `1px solid ${colors.border}`
        },

        formTitle: { fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem', textAlign: 'center' },
        inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' },
        label: { fontSize: '0.9rem', fontWeight: '700', color: colors.textMain },
        textarea: { width: '100%', padding: '1.2rem', borderRadius: '18px', border: `1.5px solid ${colors.border}`, fontSize: '1rem', resize: 'none', minHeight: '120px', fontFamily: 'inherit', outline: 'none' },
        imageUploadArea: {
            border: `2px dashed ${colors.border}`,
            borderRadius: '18px',
            padding: '2rem',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '1.5rem',
            backgroundColor: '#fafafa',
            transition: 'all 0.2s'
        },
        previewImg: { width: '100%', maxHeight: '350px', objectFit: 'cover', borderRadius: '12px', marginTop: '0.8rem' },

        categoryToggle: {
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.5rem'
        },
        categoryBtn: {
            flex: 1,
            padding: '0.8rem',
            borderRadius: '12px',
            border: `1px solid ${colors.border}`,
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease',
            backgroundColor: 'white',
            color: colors.textSecondary
        },
        categoryBtnActive: {
            backgroundColor: colors.formBg,
            borderColor: colors.primary,
            color: colors.primary
        },

        fab: {
            position: 'fixed', bottom: '40px', right: '40px',
            backgroundColor: colors.primary, color: 'white',
            width: '75px', height: '75px', borderRadius: '50%',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            cursor: 'pointer', boxShadow: '0 10px 30px rgba(139, 94, 60, 0.4)',
            border: 'none', zIndex: 1000, gap: '2px',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        },
        fabIcon: { fontSize: '28px', fontWeight: '300', lineHeight: 1 },
        fabText: { fontSize: '0.75rem', fontWeight: '700' }
    };

    const filteredPosts = posts.filter(post => post.category === activeTab);

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Community</h1>
                <p style={styles.subtitle}>แลกเปลี่ยนข้อมูล สอบถามอาการ และปัญหาสุขภาพสัตว์เลี้ยง</p>
            </header>

            {/* Category Tabs */}
            <div style={styles.tabsContainer}>
                <button 
                    style={{ ...styles.tab, ...(activeTab === 'general' ? styles.activeTab : styles.inactiveTab) }}
                    onClick={() => setActiveTab('general')}
                >
                    ทั่วไป
                </button>
                <button 
                    style={{ ...styles.tab, ...(activeTab === 'knowledge' ? styles.activeTab : styles.inactiveTab) }}
                    onClick={() => setActiveTab('knowledge')}
                >
                    สาระ
                </button>
            </div>

            <main style={styles.feed}>
                <button 
                    style={styles.fab} 
                    onClick={() => {
                        if (!user) {
                            onLoginClick();
                        } else {
                            setShowForm(true);
                        }
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                        e.currentTarget.style.backgroundColor = '#7a5235';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                        e.currentTarget.style.backgroundColor = colors.primary;
                    }}
                >
                    <span style={styles.fabIcon}>+</span>
                    <span style={styles.fabText}>โพสต์</span>
                </button>

                {showForm && (
                    <div style={styles.modalOverlay} onClick={() => setShowForm(false)}>
                        <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
                            <button 
                                onClick={() => setShowForm(false)} 
                                style={{ position: 'absolute', top: '25px', right: '25px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: colors.textSecondary }}
                            >✕</button>
                            
                            <h2 style={styles.formTitle}>แบ่งปันเรื่องราว</h2>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>เลือกหัวข้อโพสต์ *</label>
                                <div style={styles.categoryToggle}>
                                    <button 
                                        style={{ ...styles.categoryBtn, ...(newPost.category === 'general' ? styles.categoryBtnActive : {}) }}
                                        onClick={() => setNewPost({ ...newPost, category: 'general' })}
                                    >
                                        ทั่วไป
                                    </button>
                                    <button 
                                        style={{ ...styles.categoryBtn, ...(newPost.category === 'knowledge' ? styles.categoryBtnActive : {}) }}
                                        onClick={() => setNewPost({ ...newPost, category: 'knowledge' })}
                                    >
                                        สาระ
                                    </button>
                                </div>
                            </div>
                            
                            <div 
                                style={styles.imageUploadArea} 
                                onClick={() => document.getElementById('communityImageInput').click()}
                                onMouseOver={(e) => e.currentTarget.style.borderColor = colors.primary}
                                onMouseOut={(e) => e.currentTarget.style.borderColor = colors.border}
                            >
                                <input type="file" id="communityImageInput" hidden accept="image/*" onChange={handleImageChange} />
                                {imagePreview ? (
                                    <div>
                                        <p style={{ fontSize: '0.85rem', color: colors.primary, fontWeight: '600' }}>คลิกเพื่อเปลี่ยนรูป</p>
                                        <img src={imagePreview} alt="preview" style={styles.previewImg} />
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>📸</div>
                                        <p style={{ fontSize: '1rem', color: colors.textSecondary }}>เพิ่มรูปภาพประกอบ (ถ้ามี)</p>
                                    </div>
                                )}
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>รายละเอียดข้อมูล/คำถาม *</label>
                                <textarea 
                                    style={styles.textarea} 
                                    placeholder="เขียนข้อความที่นี่..." 
                                    value={newPost.content} 
                                    onChange={(e) => setNewPost({...newPost, content: e.target.value})} 
                                />
                            </div>

                            <button 
                                style={{ ...styles.smallBtn, width: '100%', padding: '1.2rem', marginTop: '1rem', fontSize: '1.1rem' }} 
                                onClick={handleAddPost}
                                onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                            >
                                โพสต์ลงชุมชน
                            </button>
                        </div>
                    </div>
                )}

                {filteredPosts.length > 0 ? filteredPosts.map(post => (
                    <div key={post.id} style={styles.card} onClick={() => setSelectedPostId(post.id)}>
                        <div style={styles.avatarColumn}>
                            <div style={styles.avatarCircle}>
                                {post.avatar ? (
                                    <img src={post.avatar} alt={post.author} style={styles.avatarImg} />
                                ) : (
                                    post.author.charAt(0)
                                )}
                            </div>
                        </div>

                        <div style={styles.contentColumn}>
                            <div style={styles.cardHeader}>
                                <div style={styles.authorInfo}>
                                    <h3 style={styles.author}>{post.author}</h3>
                                    <span style={styles.handle}>@{post.handle || post.author.toLowerCase().replace(/\s/g, '')}</span>
                                </div>
                                {user && user.name === post.author && (
                                    <div style={styles.actions} onClick={(e) => e.stopPropagation()}>
                                        <button 
                                            style={styles.actionBtn} 
                                            onClick={() => {
                                                setEditingPost(post.id);
                                                setEditImagePreview(post.image || '');
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.color = colors.primary}
                                            onMouseOut={(e) => e.currentTarget.style.color = colors.textSecondary}
                                        >แก้ไข</button>
                                        <button 
                                            style={styles.actionBtn} 
                                            onClick={() => handleDeletePost(post.id)}
                                            onMouseOver={(e) => e.currentTarget.style.color = colors.heartActive}
                                            onMouseOut={(e) => e.currentTarget.style.color = colors.textSecondary}
                                        >ลบ</button>
                                    </div>
                                )}
                            </div>

                            {editingPost === post.id ? (
                                <div style={{ marginBottom: '1rem' }} onClick={(e) => e.stopPropagation()}>
                                    <textarea 
                                        style={styles.textarea} 
                                        defaultValue={post.content} 
                                        id={`edit-${post.id}`} 
                                    />
                                    
                                    {/* Edit Image Area */}
                                    <div style={{ marginTop: '0.8rem' }}>
                                        <input 
                                            type="file" 
                                            id={`edit-image-${post.id}`} 
                                            hidden 
                                            accept="image/*" 
                                            onChange={(e) => handleImageChange(e, true)} 
                                        />
                                        {editImagePreview && (
                                            <div style={{ position: 'relative', marginBottom: '0.8rem' }}>
                                                <img src={editImagePreview} alt="edit-preview" style={styles.cardImage} />
                                                <button 
                                                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer' }}
                                                    onClick={() => setEditImagePreview('')}
                                                >×</button>
                                            </div>
                                        )}
                                        <button 
                                            style={{ ...styles.actionBtn, color: colors.primary, fontWeight: '700' }}
                                            onClick={() => document.getElementById(`edit-image-${post.id}`).click()}
                                        >
                                            {editImagePreview ? 'เปลี่ยนรูปภาพ' : 'เพิ่มรูปภาพ'}
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                                        <button 
                                            style={styles.smallBtn} 
                                            onClick={() => handleEditPost(post.id, document.getElementById(`edit-${post.id}`).value, editImagePreview)}
                                        >บันทึก</button>
                                        <button style={{ ...styles.actionBtn, padding: '0.7rem 1rem' }} onClick={() => {
                                            setEditingPost(null);
                                            setEditImagePreview('');
                                        }}>ยกเลิก</button>
                                    </div>
                                </div>
                            ) : (
                                <p style={styles.content}>{post.content}</p>
                            )}

                            {editingPost !== post.id && post.image && (
                                <img src={post.image} alt="post" style={styles.cardImage} />
                            )}

                            <div style={styles.interactionBar}>
                                <button 
                                    style={{
                                        ...styles.likeBtn,
                                        color: post.liked ? colors.heartActive : colors.textSecondary,
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLike(post.id);
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    {post.liked ? '❤️' : '🤍'} {post.likes}
                                </button>
                                <div style={styles.commentBtn}>
                                    <span>💬</span>
                                    <span>{post.comments.length} ความคิดเห็น</span>
                                </div>
                            </div>

                            <div style={styles.commentSection} onClick={(e) => e.stopPropagation()}>
                                <div style={styles.commentInput}>
                                    <input 
                                        style={styles.commentInputField} 
                                        placeholder="เขียนความคิดเห็นของคุณ..." 
                                        value={commentText[post.id] || ''}
                                        onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') handleAddComment(post.id);
                                        }}
                                    />
                                    <button 
                                        style={styles.smallBtn}
                                        onClick={() => handleAddComment(post.id)}
                                    >ส่ง</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div style={{ textAlign: 'center', padding: '4rem 0', color: colors.textSecondary }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍃</div>
                        <p>ยังไม่มีโพสต์ในหัวข้อนี้ มาร่วมแบ่งปันกันเถอะ!</p>
                    </div>
                )}
            </main>

            {/* Post Detail Modal */}
            {selectedPost && (
                <div style={styles.modalOverlay} onClick={() => setSelectedPostId(null)}>
                    <div style={styles.detailModalCard} onClick={(e) => e.stopPropagation()}>
                        <button style={styles.detailCloseBtn} onClick={() => setSelectedPostId(null)}>✕</button>
                        
                        <div style={styles.detailModalScroll}>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                                <div style={styles.avatarCircle}>
                                    {selectedPost.avatar ? (
                                        <img src={selectedPost.avatar} alt={selectedPost.author} style={styles.avatarImg} />
                                    ) : (
                                        selectedPost.author.charAt(0)
                                    )}
                                </div>
                                <div style={styles.authorInfo}>
                                    <h3 style={styles.author}>{selectedPost.author}</h3>
                                    <span style={styles.handle}>@{selectedPost.handle || selectedPost.author.toLowerCase().replace(/\s/g, '')}</span>
                                </div>
                                {user && user.name === selectedPost.author && (
                                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
                                        <button style={styles.actionBtn} onClick={() => {
                                            setEditingPost(selectedPost.id);
                                            setEditImagePreview(selectedPost.image || '');
                                        }}>แก้ไข</button>
                                        <button style={styles.actionBtn} onClick={() => handleDeletePost(selectedPost.id)}>ลบ</button>
                                    </div>
                                )}
                            </div>

                            <p style={styles.detailDescription}>{selectedPost.content}</p>
                            {selectedPost.image && (
                                <img src={selectedPost.image} alt="post" style={styles.detailLargeImage} />
                            )}

                            <div style={styles.interactionBar}>
                                <button 
                                    style={{
                                        ...styles.likeBtn,
                                        color: selectedPost.liked ? colors.heartActive : colors.textSecondary,
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLike(selectedPost.id);
                                    }}
                                >
                                    {selectedPost.liked ? '❤️' : '🤍'} {selectedPost.likes}
                                </button>
                                <div style={styles.commentBtn}>
                                    <span>💬</span>
                                    <span>{selectedPost.comments.length} ความคิดเห็น</span>
                                </div>
                            </div>

                            <div style={styles.commentSection}>
                                <h4 style={{ marginBottom: '1.5rem', color: colors.textMain }}>ความคิดเห็น</h4>
                                <div style={styles.commentInput}>
                                    <input 
                                        style={styles.commentInputField} 
                                        placeholder="เขียนความคิดเห็นของคุณ..." 
                                        value={commentText[selectedPost.id] || ''}
                                        onChange={(e) => setCommentText({ ...commentText, [selectedPost.id]: e.target.value })}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') handleAddComment(selectedPost.id);
                                        }}
                                    />
                                    <button 
                                        style={styles.smallBtn}
                                        onClick={() => handleAddComment(selectedPost.id)}
                                    >ส่ง</button>
                                </div>

                                <div style={styles.commentList}>
                                    {selectedPost.comments.map(comment => (
                                        <div key={comment.id} style={styles.commentItem}>
                                            <div style={styles.commentAvatar}>
                                                <div style={{ ...styles.avatarCircle, width: '40px', height: '40px', fontSize: '1rem', borderRadius: '50%' }}>
                                                    {comment.author.charAt(0)}
                                                </div>
                                            </div>
                                            <div style={styles.commentContent}>
                                                <span style={styles.commentAuthor}>{comment.author}</span>
                                                <p style={styles.commentText}>{comment.text}</p>
                                                
                                                <div style={{ display: 'flex', gap: '1.2rem' }}>
                                                    <button 
                                                        style={{ ...styles.commentLikeBtn, color: comment.liked ? colors.heartActive : colors.textSecondary }}
                                                        onClick={() => handleLikeComment(selectedPost.id, comment.id)}
                                                    >
                                                        {comment.liked ? '❤️' : '🤍'} {comment.likes}
                                                    </button>
                                                    <button 
                                                        style={styles.replyBtn}
                                                        onClick={() => setReplyingTo({ postId: selectedPost.id, commentId: comment.id })}
                                                    >
                                                        ตอบกลับ
                                                    </button>
                                                </div>

                                                {replyingTo?.commentId === comment.id && (
                                                    <div style={{ ...styles.commentInput, marginTop: '1rem' }}>
                                                        <input 
                                                            style={styles.commentInputField} 
                                                            placeholder="ตอบกลับความคิดเห็น..." 
                                                            value={commentText[`reply-${comment.id}`] || ''}
                                                            onChange={(e) => setCommentText({ ...commentText, [`reply-${comment.id}`]: e.target.value })}
                                                            onKeyPress={(e) => {
                                                                if (e.key === 'Enter') handleReply(selectedPost.id, comment.id, e.target.value);
                                                            }}
                                                            autoFocus
                                                        />
                                                        <button 
                                                            style={styles.smallBtn}
                                                            onClick={() => handleReply(selectedPost.id, comment.id, commentText[`reply-${comment.id}`] || '')}
                                                        >ส่ง</button>
                                                    </div>
                                                )}

                                                {comment.replies && comment.replies.length > 0 && (
                                                    <div style={styles.replySection}>
                                                        {comment.replies.map(reply => (
                                                            <div key={reply.id} style={styles.replyItem}>
                                                                <div style={{ ...styles.avatarCircle, width: '30px', height: '30px', fontSize: '0.8rem', borderRadius: '50%' }}>
                                                                    {reply.author.charAt(0)}
                                                                </div>
                                                                <div style={styles.replyContent}>
                                                                    <span style={styles.replyAuthor}>{reply.author}</span>
                                                                    <p style={styles.replyText}>{reply.text}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Community;
