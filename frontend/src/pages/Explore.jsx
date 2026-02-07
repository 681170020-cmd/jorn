import { useState } from 'react';

const Explore = ({ user, onLoginClick }) => {
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
            petName: 'Mochi (โมจิ)',
            author: 'แม่นุ่น',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800',
            gender: 'หญิง',
            age: '3 เดือน',
            health: 'ฉีดวัคซีนแล้ว',
            location: 'กรุงเทพฯ',
            deliveryMethod: 'ไปส่งให้',
            petImage: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800',
            content: 'น้องโมจิเป็นลูกหมาพุดเดิ้ลผสมที่ถูกทิ้งไว้ข้างถนน น้องนิสัยเรียบร้อย ขี้อ้อน และเข้ากับเด็กได้ดีมากค่ะ อยากหาบ้านที่พร้อมดูแลน้องจริงๆ',
            likes: 24,
            liked: false,
            comments: [
                { id: 1, author: 'ปอนด์', text: 'น้องน่ารักมากเลยครับ อยากรับไปเลี้ยงจัง' },
                { id: 2, author: 'ฟ้า', text: 'เลี้ยงในคอนโดได้ไหมคะ?' }
            ]
        },
        {
            id: 2,
            petName: 'Tiger (ไทเกอร์)',
            author: 'กอล์ฟ',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
            gender: 'ชาย',
            age: '1 ปี',
            health: 'ทำหมันแล้ว',
            location: 'นนทบุรี',
            deliveryMethod: 'นัดรับ',
            meetupPlace: 'เซ็นทรัล เวสต์เกต',
            petImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
            content: 'ไทเกอร์เป็นแมวส้มที่ฉลาดมาก ชอบเล่นกับเบ็ดตกแมว อยากได้คนที่มีเวลาเล่นกับน้อง และดูแลน้องในระบบปิดครับ',
            likes: 15,
            liked: false,
            comments: []
        }
    ]);

    const [showForm, setShowForm] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [commentText, setCommentText] = useState({});
    const [imagePreview, setImagePreview] = useState('');
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null); // { postId, commentId }
    
    // Find selected post for modal
    const selectedPost = posts.find(p => p.id === selectedPostId);
    
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
        if (!newPost.petName.trim() || !newPost.content.trim()) return;
        const post = {
            id: Date.now(),
            petName: newPost.petName || 'ไม่ระบุชื่อ',
            author: user?.name || 'ผู้ใช้งาน',
            avatar: user?.avatar || '',
            gender: newPost.gender,
            age: newPost.age || 'ไม่ระบุ',
            health: newPost.health || 'สุขภาพดี',
            location: newPost.location || 'ไม่ระบุ',
            deliveryMethod: newPost.deliveryMethod,
            meetupPlace: newPost.meetupPlace,
            petImage: newPost.petImage || '',
            content: newPost.content,
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

    const handleAddComment = (postId, textFromInput) => {
        if (!user) {
            onLoginClick();
            return;
        }
        const text = textFromInput || commentText[postId];
        if (!text?.trim()) return;
        setPosts(posts.map(post => 
            post.id === postId 
                ? { ...post, comments: [...post.comments, { 
                    id: Date.now(), 
                    author: user?.name || 'ผู้ใช้งาน', 
                    text,
                    likes: 0,
                    liked: false,
                    replies: []
                }] }
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
                            likes: (comment.liked ? (comment.likes || 0) - 1 : (comment.likes || 0) + 1) 
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
                        ? { ...comment, replies: [...(comment.replies || []), { id: Date.now(), author: user?.name || 'ผู้ใช้งาน', text }] }
                        : comment
                )
            };
        }));
        setReplyingTo(null);
        setCommentText({ ...commentText, [`reply-${commentId}`]: '' });
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
        feed: { width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
        card: { 
            backgroundColor: colors.cardBg, 
            borderRadius: '24px', 
            border: `1px solid ${colors.border}`, 
            padding: '1.5rem',
            display: 'flex',
            gap: '1rem',
            width: '100%',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative'
        },
        avatarColumn: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '48px',
            minWidth: '48px'
        },
        avatarCircle: {
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: colors.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '700',
            fontSize: '1.2rem',
            overflow: 'hidden'
        },
        avatarImg: {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        },
        contentColumn: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0
        },
        cardImage: { 
            width: '100%', 
            maxHeight: '400px',
            objectFit: 'cover', 
            borderRadius: '16px',
            marginTop: '1rem',
            border: `1px solid ${colors.border}`
        },
        cardBody: { padding: 0 },
        cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' },
        petName: { fontSize: '1.2rem', fontWeight: '800', color: colors.textMain, margin: 0 },
        author: { fontSize: '0.85rem', color: colors.textSecondary },
        infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.8rem', margin: '1rem 0' },
        infoItem: { display: 'flex', flexDirection: 'column', gap: '2px' },
        infoLabel: { fontSize: '0.75rem', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' },
        infoValue: { fontSize: '0.9rem', fontWeight: '600', color: colors.textMain },
        tag: { 
            display: 'inline-block', 
            padding: '4px 12px', 
            backgroundColor: 'rgba(139, 94, 60, 0.08)', 
            color: colors.primary, 
            borderRadius: '20px', 
            fontSize: '0.8rem', 
            fontWeight: '600',
            width: 'fit-content'
        },
        content: { fontSize: '0.95rem', color: colors.textSecondary, lineHeight: '1.5', margin: '0.5rem 0' },
        interactionBar: { display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '0.8rem 0', borderTop: `1px solid ${colors.border}`, marginTop: '1rem' },
        interactionItem: { display: 'flex', alignItems: 'center', gap: '0.4rem', color: colors.textSecondary, fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
        likeBtn: { display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' },
        commentBtn: { display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: colors.textSecondary },
        actions: { display: 'flex', gap: '0.8rem' },
        actionBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: colors.textSecondary, opacity: 0.6 },
        comment: { 
            backgroundColor: '#f5f0eb', 
            borderRadius: '16px', 
            padding: '1rem 1.2rem', 
            marginBottom: '0.8rem' 
        },
        commentAuthor: { 
            fontWeight: '700', 
            fontSize: '0.9rem', 
            color: colors.primary,
            marginBottom: '0.2rem'
        },
        commentText: { 
            fontSize: '0.95rem',
            color: colors.textMain,
            lineHeight: '1.5'
        },
        commentInput: { 
            display: 'flex', 
            gap: '0.5rem', 
            marginTop: '1rem',
            backgroundColor: 'white',
            padding: '0.5rem',
            borderRadius: '24px',
            border: `1px solid ${colors.border}`
        },
        commentInputField: { 
            flex: 1, 
            padding: '0.6rem 1.2rem', 
            borderRadius: '20px', 
            border: 'none', 
            fontSize: '0.95rem',
            backgroundColor: 'transparent',
            outline: 'none'
        },
        smallBtn: { 
            padding: '0.6rem 1.2rem', 
            borderRadius: '20px', 
            border: 'none', 
            backgroundColor: colors.primary, 
            color: 'white', 
            fontWeight: '600', 
            cursor: 'pointer' 
        },
        
        replyBtn: { 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '0.85rem', 
            fontWeight: '600', 
            color: colors.primary, 
            marginTop: '0.6rem',
            padding: 0
        },
        commentLikeBtn: { 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '0.85rem', 
            color: colors.textSecondary, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.2rem', 
            marginTop: '0.6rem',
            padding: 0
        },
        replySection: { 
            marginLeft: '1.5rem', 
            paddingLeft: '1rem', 
            borderLeft: `2px solid ${colors.border}`, 
            marginTop: '0.8rem' 
        },
        replyItem: { 
            backgroundColor: 'rgba(139, 94, 60, 0.04)', 
            borderRadius: '12px', 
            padding: '0.8rem 1rem', 
            marginBottom: '0.5rem' 
        },
        replyAuthor: { 
            fontWeight: '700', 
            fontSize: '0.85rem', 
            color: colors.primary 
        },
        replyText: { 
            fontSize: '0.9rem',
            color: colors.textMain
        },
        
        detailModalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 3000,
            backdropFilter: 'blur(8px)'
        },
        detailModalCard: {
            backgroundColor: 'white',
            borderRadius: '32px',
            width: '95%',
            maxWidth: '850px',
            height: '90vh',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        },
        detailModalScroll: {
            flex: 1,
            overflowY: 'auto',
            padding: '2.5rem'
        },
        detailHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
            position: 'relative'
        },
        detailHeaderInfo: {
            display: 'flex',
            flexDirection: 'column'
        },
        detailTitle: {
            fontSize: '1.8rem',
            fontWeight: '800',
            color: colors.textMain,
            margin: 0
        },
        detailAuthor: {
            fontSize: '1rem',
            color: colors.textSecondary
        },
        detailTopActions: {
            position: 'absolute',
            top: 0,
            right: 0,
            display: 'flex',
            gap: '1rem'
        },
        detailCloseBtn: { 
            position: 'absolute', 
            top: '1.5rem', 
            right: '1.5rem', 
            zIndex: 10,
            background: 'white',
            border: `1px solid ${colors.border}`,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        },
        detailDescription: {
            fontSize: '1.1rem',
            lineHeight: '1.6',
            color: colors.textMain,
            marginBottom: '1.5rem'
        },
        detailInfoGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem',
            marginBottom: '1.5rem',
            padding: '1.5rem 0',
            borderTop: `1px solid ${colors.border}`,
            borderBottom: `1px solid ${colors.border}`
        },
        detailInfoItem: {
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
        },
        detailInfoLabel: {
            fontSize: '0.9rem',
            color: colors.textSecondary,
            fontWeight: '500'
        },
        detailInfoValue: {
            fontSize: '1.1rem',
            fontWeight: '700',
            color: colors.textMain
        },
        detailLargeImage: {
            width: '100%',
            maxHeight: '600px',
            objectFit: 'cover',
            borderRadius: '24px',
            margin: '1.5rem 0'
        },
        detailCommentArea: { 
            marginTop: '2rem' 
        },
        detailCommentTitle: {
            fontSize: '1.2rem',
            fontWeight: '800',
            color: colors.textMain,
            marginBottom: '1.5rem'
        },

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
                    onClick={() => {
                        if (!user) {
                            onLoginClick();
                        } else {
                            setShowForm(true);
                        }
                    }}
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
                    <div 
                        key={post.id} 
                        style={styles.card} 
                        onClick={() => setSelectedPostId(post.id)}
                    >
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
                                <div>
                                    <h3 style={styles.petName}>{post.petName}</h3>
                                    <p style={styles.author}>โดย {post.author}</p>
                                </div>
                                {user && user.name === post.author && (
                                    <div style={styles.actions} onClick={(e) => e.stopPropagation()}>
                                        <button style={styles.actionBtn} onClick={() => setEditingPost(post.id)}>แก้ไข</button>
                                        <button style={styles.actionBtn} onClick={() => handleDeletePost(post.id)}>ลบ</button>
                                    </div>
                                )}
                            </div>

                            {editingPost === post.id ? (
                                <div style={{ marginBottom: '1rem' }}>
                                    <textarea 
                                        style={styles.textarea} 
                                        defaultValue={post.content} 
                                        id={`edit-explore-${post.id}`}
                                    />
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }} onClick={(e) => e.stopPropagation()}>
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

                            <div style={styles.infoGrid}>
                                <div style={styles.infoItem}><span style={styles.infoLabel}>เพศ</span> <span style={styles.infoValue}>{post.gender}</span></div>
                                <div style={styles.infoItem}><span style={styles.infoLabel}>อายุ</span> <span style={styles.infoValue}>{post.age}</span></div>
                                <div style={styles.infoItem}><span style={styles.infoLabel}>สุขภาพ</span> <span style={styles.infoValue}>{post.health}</span></div>
                                <div style={styles.infoItem}><span style={styles.infoLabel}>ที่อยู่</span> <span style={styles.infoValue}>{post.location}</span></div>
                            </div>

                            <span style={styles.tag}>{getDeliveryLabel(post.deliveryMethod, post.meetupPlace)}</span>

                            {post.petImage && <img src={post.petImage} alt={post.petName} style={styles.cardImage} />}

                            <div style={styles.interactionBar}>
                                <button 
                                    style={{ ...styles.likeBtn, color: post.liked ? colors.heartActive : colors.textSecondary }} 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLike(post.id);
                                    }}
                                >
                                    {post.liked ? '❤️' : '🤍'} {post.likes}
                                </button>
                                <button 
                                    style={styles.commentBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPostId(post.id);
                                    }}
                                >
                                    💬 {post.comments.length} ความคิดเห็น
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </main>

            {/* Detail Modal */}
            {selectedPost && (
                <div style={styles.detailModalOverlay} onClick={() => setSelectedPostId(null)}>
                    <div style={styles.detailModalCard} onClick={(e) => e.stopPropagation()}>
                        <button style={styles.detailCloseBtn} onClick={() => setSelectedPostId(null)}>✕</button>
                        
                        <div style={styles.detailModalScroll}>
                            <div style={styles.detailHeader}>
                                <div style={styles.avatarCircle}>
                                    {selectedPost.avatar ? (
                                        <img src={selectedPost.avatar} alt={selectedPost.author} style={styles.avatarImg} />
                                    ) : (
                                        selectedPost.author.charAt(0)
                                    )}
                                </div>
                                <div style={styles.detailHeaderInfo}>
                                    <h2 style={styles.detailTitle}>{selectedPost.petName}</h2>
                                    <span style={styles.detailAuthor}>โดย {selectedPost.author}</span>
                                </div>
                                {user && user.name === selectedPost.author && (
                                    <div style={styles.detailTopActions}>
                                        <button style={styles.actionBtn} onClick={() => {
                                            setEditingPost(selectedPost.id);
                                            setSelectedPostId(null);
                                        }}>แก้ไข</button>
                                        <button style={styles.actionBtn} onClick={() => {
                                            handleDeletePost(selectedPost.id);
                                            setSelectedPostId(null);
                                        }}>ลบ</button>
                                    </div>
                                )}
                            </div>

                            <p style={styles.detailDescription}>{selectedPost.content}</p>

                            <div style={styles.detailInfoGrid}>
                                <div style={styles.detailInfoItem}>
                                    <span style={styles.detailInfoLabel}>เพศ</span>
                                    <span style={styles.detailInfoValue}>{selectedPost.gender}</span>
                                </div>
                                <div style={styles.detailInfoItem}>
                                    <span style={styles.detailInfoLabel}>อายุ</span>
                                    <span style={styles.detailInfoValue}>{selectedPost.age}</span>
                                </div>
                                <div style={styles.detailInfoItem}>
                                    <span style={styles.detailInfoLabel}>สุขภาพ</span>
                                    <span style={styles.detailInfoValue}>{selectedPost.health}</span>
                                </div>
                                <div style={styles.detailInfoItem}>
                                    <span style={styles.detailInfoLabel}>ที่อยู่</span>
                                    <span style={styles.detailInfoValue}>{selectedPost.location}</span>
                                </div>
                            </div>

                            <span style={styles.tag}>{getDeliveryLabel(selectedPost.deliveryMethod, selectedPost.meetupPlace)}</span>

                            <img src={selectedPost.petImage} alt={selectedPost.petName} style={styles.detailLargeImage} />

                            <div style={{...styles.interactionBar, padding: '1rem 0', borderBottom: `1px solid ${colors.border}`, borderTop: `1px solid ${colors.border}`}}>
                                <button 
                                    style={{ 
                                        ...styles.interactionItem, 
                                        color: selectedPost.liked ? colors.heartActive : colors.textSecondary 
                                    }} 
                                    onClick={() => handleLike(selectedPost.id)}
                                >
                                    {selectedPost.liked ? '❤️' : '🤍'} {selectedPost.likes}
                                </button>
                                <div style={styles.interactionItem}>
                                    💬 {selectedPost.comments.length} ความคิดเห็น
                                </div>
                            </div>

                            <div style={styles.detailCommentArea}>
                                <h3 style={styles.detailCommentTitle}>ความคิดเห็น ({selectedPost.comments.length})</h3>
                                {selectedPost.comments.map(comment => (
                                    <div key={comment.id} style={styles.comment}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={styles.commentAuthor}>{comment.author}</span>
                                        </div>
                                        <p style={styles.commentText}>{comment.text}</p>
                                        
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button 
                                                style={styles.commentLikeBtn}
                                                onClick={() => handleLikeComment(selectedPost.id, comment.id)}
                                            >
                                                {comment.liked ? '❤️' : '🤍'} {comment.likes || 0}
                                            </button>
                                            <button 
                                                style={styles.replyBtn}
                                                onClick={() => setReplyingTo({ postId: selectedPost.id, commentId: comment.id })}
                                            >
                                                ตอบกลับ
                                            </button>
                                        </div>

                                        {comment.replies && comment.replies.length > 0 && (
                                            <div style={styles.replySection}>
                                                {comment.replies.map(reply => (
                                                    <div key={reply.id} style={styles.replyItem}>
                                                        <span style={styles.replyAuthor}>{reply.author}</span>
                                                        <p style={styles.replyText}>{reply.text}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {replyingTo?.commentId === comment.id && (
                                            <div style={styles.commentInput}>
                                                <input 
                                                    autoFocus
                                                    style={styles.commentInputField} 
                                                    placeholder="เขียนการตอบกลับ..."
                                                    id={`reply-input-${comment.id}`}
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleReply(selectedPost.id, comment.id, e.target.value);
                                                            e.target.value = ''; // Clear input after sending
                                                        }
                                                    }}
                                                />
                                                <button 
                                                    style={styles.smallBtn}
                                                    onClick={() => {
                                                        const replyText = document.getElementById(`reply-input-${comment.id}`).value;
                                                        handleReply(selectedPost.id, comment.id, replyText);
                                                        document.getElementById(`reply-input-${comment.id}`).value = ''; // Clear input after sending
                                                    }}
                                                >
                                                    ตอบ
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {selectedPost.comments.length === 0 && <p style={{ textAlign: 'center', color: colors.textSecondary, marginTop: '2rem', fontSize: '0.9rem' }}>ยังไม่มีความคิดเห็น</p>}

                                 <div style={styles.commentInput}>
                                    <input 
                                        style={styles.commentInputField} 
                                        placeholder="แสดงความคิดเห็นที่นี่..." 
                                        value={commentText[selectedPost.id] || ''}
                                        onChange={(e) => setCommentText({ ...commentText, [selectedPost.id]: e.target.value })}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleAddComment(selectedPost.id);
                                            }
                                        }}
                                    />
                                    <button 
                                        style={styles.smallBtn}
                                        onClick={() => handleAddComment(selectedPost.id)}
                                    >
                                        ส่ง
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>
                {`
                    @keyframes modalSlideUp {
                        from { transform: translateY(20px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    @keyframes modalFadeIn {
                        from { transform: scale(0.95); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                `}
            </style>
        </div>
    );
};

export default Explore;
