import { useState } from 'react';

const HeartIcon = ({ size = 20, color = 'currentColor', fill = 'none' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const MessageCircleIcon = ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
);


const Explore = ({ user, onLoginClick, posts, setPosts }) => {
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

    // (Sample posts state removed and moved to App.jsx)

    const [showForm, setShowForm] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [commentText, setCommentText] = useState({});
    const [imagePreview, setImagePreview] = useState('');
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null); // { postId, commentId }
    const [expandedComments, setExpandedComments] = useState({});
    const [showAdoptionForm, setShowAdoptionForm] = useState(false);
    const [adoptionPostId, setAdoptionPostId] = useState(null);
    const [exploreError, setExploreError] = useState('');
    const [adoptionData, setAdoptionData] = useState({
        // 1) User Info
        fullName: user?.name || '',
        age: '',
        phone: user?.phone || '',
        email: user?.email || '',
        social: '',
        // 2) Housing
        housingType: '',
        isOwner: '',
        area: '',
        members: '',
        consent: '',
        // 3) Experience
        hasExperience: '',
        hasOtherPets: '',
        knowsVaccine: '',
        // 4) Readiness
        hasTime: '',
        caregiver: '',
        canAfford: '',
        // 5) Reason
        reason: '',
        // 6) Terms
        termsAccepted: false
    });
    const [viewingRequestsPostId, setViewingRequestsPostId] = useState(null);
    
    // Find selected post for modal
    const selectedPost = posts.find(p => p.id === selectedPostId);

    // New post form state
    const [newPost, setNewPost] = useState({
        petName: '',
        petType: '',
        otherPetType: '',
        petImage: '',
        gender: '',
        age: '',
        health: '',
        location: '',
        deliveryMethod: '',
        meetupPlace: '',
        content: ''
    });

    const [filterType, setFilterType] = useState('ทั้งหมด');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPosts = posts.filter(post => {
        const matchesType = filterType === 'ทั้งหมด' || post.petType === filterType;
        
        // For 'อื่นๆ' category, search across multiple fields
        if (filterType === 'อื่นๆ' && searchTerm) {
            const search = searchTerm.toLowerCase();
            const matchesPetType = post.petType && post.petType.toLowerCase().includes(search);
            const matchesPetName = post.petName && post.petName.toLowerCase().includes(search);
            const matchesContent = post.content && post.content.toLowerCase().includes(search);
            const matchesLocation = post.location && post.location.toLowerCase().includes(search);
            return matchesPetType || matchesPetName || matchesContent || matchesLocation;
        }
        
        return matchesType;
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
        const isOtherTypeMissing = newPost.petType === 'อื่นๆ' && !newPost.otherPetType.trim();
        const isFormIncomplete = !newPost.petName.trim() || !newPost.content.trim() || !newPost.location.trim() || !newPost.petImage || 
                               !newPost.petType || !newPost.gender || !newPost.deliveryMethod || isOtherTypeMissing;
                               
        if (isFormIncomplete) {
            setExploreError('กรุณากรอกรายละเอียดและเลือกข้อมูลให้ครบถ้วน');
            return;
        }

        if (editingPost) {
            // Edit Mode
            setPosts(posts.map(post => 
                post.id === editingPost 
                    ? { 
                        ...post, 
                        petName: newPost.petName,
                        petType: newPost.petType === 'อื่นๆ' ? (newPost.otherPetType || 'อื่นๆ') : newPost.petType,
                        gender: newPost.gender,
                        age: newPost.age || 'ไม่ระบุ',
                        health: newPost.health || 'สุขภาพดี',
                        location: newPost.location || 'ไม่ระบุ',
                        deliveryMethod: newPost.deliveryMethod,
                        meetupPlace: newPost.meetupPlace,
                        petImage: newPost.petImage,
                        content: newPost.content
                      } 
                    : post
            ));
            setEditingPost(null);
        } else {
            // New Mode
            const post = {
                id: Date.now(),
                petName: newPost.petName || 'ไม่ระบุชื่อ',
                petType: newPost.petType === 'อื่นๆ' ? (newPost.otherPetType || 'อื่นๆ') : newPost.petType,
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
                isAdopted: false,
                comments: [],
                adoptionRequests: [],
                createdAt: new Date().toLocaleString('th-TH')
            };
            setPosts([post, ...posts]);
        }

        setNewPost({
            petName: '',
            petType: '',
            otherPetType: '',
            petImage: '',
            gender: '',
            age: '',
            health: '',
            location: '',
            deliveryMethod: '',
            meetupPlace: '',
            content: ''
        });
        setImagePreview('');
        setExploreError('');
        setShowForm(false);
    };

    const handleDeletePost = (postId) => {
        setPosts(posts.filter(post => post.id !== postId));
    };

    const handleStartEdit = (post) => {
        setEditingPost(post.id);
        const isStandardType = ['หมา', 'แมว'].includes(post.petType);
        setNewPost({
            petName: post.petName,
            petType: isStandardType ? post.petType : 'อื่นๆ',
            otherPetType: isStandardType ? '' : post.petType,
            petImage: post.petImage,
            gender: post.gender,
            age: post.age,
            health: post.health,
            location: post.location,
            deliveryMethod: post.deliveryMethod,
            meetupPlace: post.meetupPlace || '',
            content: post.content
        });
        setImagePreview(post.petImage);
        setShowForm(true);
    };

    const handleToggleAdopted = (postId) => {
        setPosts(posts.map(post => 
            post.id === postId ? { ...post, isAdopted: !post.isAdopted } : post
        ));
    };

    const handleAdoptionSubmit = () => {
        if (!adoptionData.fullName || !adoptionData.phone || !adoptionData.reason || !adoptionData.termsAccepted) {
            alert('กรุณากรอกข้อมูลที่จำเป็น (*) และยอมรับเงื่อนไข');
            return;
        }

        const newRequest = {
            id: Date.now(),
            submittedAt: new Date().toLocaleString('th-TH'),
            status: 'pending',
            ...adoptionData
        };

        setPosts(posts.map(post => 
            post.id === adoptionPostId 
                ? { ...post, adoptionRequests: [...(post.adoptionRequests || []), newRequest] }
                : post
        ));

        alert('ส่งใบสมัครรับเลี้ยงเรียบร้อยแล้ว! เจ้าของโพสต์จะติดต่อกลับหาคุณ');
        setShowAdoptionForm(false);
        setAdoptionData({
            ...adoptionData,
            age: '',
            social: '',
            area: '',
            members: '',
            reason: '',
            termsAccepted: false,
            housingType: '',
            isOwner: '',
            consent: '',
            hasExperience: '',
            hasOtherPets: '',
            knowsVaccine: '',
            hasTime: '',
            caregiver: '',
            canAfford: ''
        });
    };

    const handleSelectApplicant = (postId, requestId) => {
        setPosts(posts.map(post => {
            if (post.id !== postId) return post;
            
            const updatedRequests = post.adoptionRequests.map(req => ({
                ...req,
                status: req.id === requestId ? (req.status === 'selected' ? 'pending' : 'selected') : 'pending'
            }));

            const hasSelected = updatedRequests.some(req => req.status === 'selected');

            return {
                ...post,
                adoptionRequests: updatedRequests,
                isAdopted: hasSelected
            };
        }));
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
                ? {
                    ...post, comments: [...post.comments, {
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
                            likes: (comment.liked ? (comment.likes || 0) - 1 : (comment.likes || 0) + 1)
                        }
                        : comment
                )
            };
        }));
    };

    const handleLikeReply = (postId, commentId, replyId) => {
        if (!user) {
            onLoginClick();
            return;
        }
        setPosts(posts.map(post => {
            if (post.id !== postId) return post;
            return {
                ...post,
                comments: post.comments.map(comment => {
                    if (comment.id !== commentId) return comment;
                    return {
                        ...comment,
                        replies: (comment.replies || []).map(reply => 
                            reply.id === replyId 
                                ? { 
                                    ...reply, 
                                    liked: !reply.liked, 
                                    likes: reply.liked ? (reply.likes || 0) - 1 : (reply.likes || 0) + 1 
                                }
                                : reply
                        )
                    };
                })
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
                        ? { ...comment, replies: [...(comment.replies || []), { 
                            id: Date.now(), 
                            author: user?.name || 'ผู้ใช้งาน', 
                            text,
                            likes: 0,
                            liked: false
                        }] }
                        : comment
                )
            };
        }));
        setReplyingTo(null);
        setCommentText({ ...commentText, [`reply-${commentId}`]: '' });
        // Auto expand when replying
        setExpandedComments({ ...expandedComments, [commentId]: true });
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
        adoptedBadge: {
            backgroundColor: '#2ecc71',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '800',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 4px 10px rgba(46, 204, 113, 0.2)'
        },
        adoptedOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            zIndex: 1,
            pointerEvents: 'none',
            borderRadius: '24px'
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
        viewMoreBtn: { 
            background: 'none', 
            border: 'none', 
            color: colors.textSecondary, 
            fontSize: '0.85rem', 
            fontWeight: '700', 
            cursor: 'pointer', 
            padding: '0.5rem 0 0.5rem 0', 
            textAlign: 'left',
            display: 'block',
            width: 'fit-content'
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
        fabText: { fontSize: '0.7rem', fontWeight: '600' },

        // Adoption Form Specific Styles
        adoptionSection: {
            marginBottom: '2rem',
            padding: '1.5rem',
            backgroundColor: '#fafafa',
            borderRadius: '20px',
            border: `1px solid ${colors.border}`
        },
        sectionTitle: {
            fontSize: '1.1rem',
            fontWeight: '800',
            color: colors.primary,
            marginBottom: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        },
        formGridAdopt: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.2rem'
        },
        interestBtn: {
            padding: '0.6rem 1.5rem',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: colors.primary,
            color: 'white',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease',
            marginLeft: 'auto',
            boxShadow: '0 4px 12px rgba(139, 94, 60, 0.2)'
        },
        viewRequestsBtn: {
            backgroundColor: '#3498db',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            marginTop: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
        },
        requestBadge: {
            backgroundColor: '#e74c3c',
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem'
        },
        requestCard: {
            backgroundColor: '#f9f9f9',
            padding: '1.5rem',
            borderRadius: '20px',
            marginBottom: '1rem',
            border: `1px solid ${colors.border}`
        },
        requestHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            borderBottom: `1px solid ${colors.border}`,
            paddingBottom: '0.5rem'
        },
        filterContainer: {
            display: 'flex',
            gap: '0.8rem',
            marginBottom: '1.5rem',
            overflowX: 'auto',
            padding: '0.5rem',
            width: '100%',
            maxWidth: '800px',
            justifyContent: 'center'
        },
        filterBtn: (isActive) => ({
            padding: '0.6rem 1.2rem',
            borderRadius: '20px',
            border: isActive ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
            backgroundColor: isActive ? 'rgba(139, 94, 60, 0.1)' : 'white',
            color: isActive ? colors.primary : colors.textSecondary,
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
        }),
        searchContainer: {
            width: '100%',
            maxWidth: '800px',
            marginBottom: '1.5rem'
        },
        searchInput: {
            width: '100%',
            padding: '0.8rem 1.5rem',
            borderRadius: '24px',
            border: `2px solid ${colors.border}`,
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.2s ease',
            backgroundColor: 'white'
        }
    };

    const getDeliveryLabel = (method, place) => {
        if (method === 'ไปส่งให้') return '🚗 ไปส่งให้ถึงบ้าน';
        if (method === 'มารับเอง') return '🏠 มารับเองที่บ้าน';
        if (method === 'นัดรับ') return `📍 นัดรับ: ${place}`;
        return method;
    };

    return (
        <div style={styles.container}>
            {/* Header section removed */}

            {/* Filter Section */}
            <div style={styles.filterContainer}>
                {['ทั้งหมด', 'หมา', 'แมว', 'อื่นๆ'].map(type => (
                    <button
                        key={type}
                        style={styles.filterBtn(filterType === type)}
                        onClick={() => {
                            setFilterType(type);
                            if (type !== 'อื่นๆ') setSearchTerm('');
                        }}
                    >
                        {type === 'ทั้งหมด' ? '🐾 ทั้งหมด' :
                            type === 'หมา' ? '🐕 หมา' :
                                type === 'แมว' ? '🐈 แมว' : '🦎 อื่นๆ'}
                    </button>
                ))}
            </div>

            {/* Search Input for Other category */}
            {filterType === 'อื่นๆ' && (
                <div style={styles.searchContainer}>
                    <input
                        style={styles.searchInput}
                        placeholder="🔍 ค้นหาประเภท... (เช่น กระต่าย, นก, นาก)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onBlur={(e) => e.target.style.borderColor = colors.primary}
                        onFocus={(e) => e.target.style.borderColor = colors.textMain}
                    />
                </div>
            )}

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
                    <div style={styles.modalOverlay} onClick={() => {
                        setShowForm(false);
                        setEditingPost(null);
                        setNewPost({
                            petName: '',
                            petType: 'หมา',
                            otherPetType: '',
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
                        setExploreError('');
                    }}>
                        <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingPost(null);
                                    setNewPost({
                                        petName: '',
                                        petType: '',
                                        otherPetType: '',
                                        petImage: '',
                                        gender: '',
                                        age: '',
                                        health: '',
                                        location: '',
                                        deliveryMethod: '',
                                        meetupPlace: '',
                                        content: ''
                                    });
                                    setImagePreview('');
                                    setExploreError('');
                                }}
                                style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
                            >✕</button>

                            <h2 style={styles.formTitle}>{editingPost ? 'แก้ไขประกาศหาบ้าน' : 'ประกาศหาบ้าน'}</h2>

                            <div style={styles.formGrid}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>ประเภทสัตว์เลี้ยง *</label>
                                    <select style={styles.select} value={newPost.petType} onChange={(e) => setNewPost({ ...newPost, petType: e.target.value })}>
                                        <option value="">-- เลือกประเภท --</option>
                                        <option value="หมา">🐕 หมา</option>
                                        <option value="แมว">🐈 แมว</option>
                                        <option value="อื่นๆ">🦎 อื่นๆ</option>
                                    </select>
                                </div>
                                {newPost.petType === 'อื่นๆ' && (
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>ระบุประเภทสัตว์เลี้ยง *</label>
                                        <input
                                            style={styles.input}
                                            placeholder="เช่น กระต่าย, นก"
                                            value={newPost.otherPetType}
                                            onChange={(e) => setNewPost({ ...newPost, otherPetType: e.target.value })}
                                        />
                                    </div>
                                )}
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>ชื่อสัตว์เลี้ยง *</label>
                                    <input style={styles.input} placeholder="ชื่อน้อง" value={newPost.petName} onChange={(e) => setNewPost({ ...newPost, petName: e.target.value })} />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>เพศ</label>
                                    <select style={styles.select} value={newPost.gender} onChange={(e) => setNewPost({ ...newPost, gender: e.target.value })}>
                                        <option value="">-- เลือกเพศ --</option>
                                        <option value="ชาย">ชาย</option>
                                        <option value="หญิง">หญิง</option>
                                        <option value="ไม่ทราบ">ไม่ทราบ</option>
                                    </select>
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>อายุโดยประมาณ (เฉพาะตัวเลข)</label>
                                    <input 
                                        style={styles.input} 
                                        placeholder="เช่น 2 (ใส่เฉพาะตัวเลข)" 
                                        value={newPost.age} 
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
                                            setNewPost({ ...newPost, age: val });
                                        }} 
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>สุขภาพ</label>
                                    <input style={styles.input} placeholder="เช่น สุขภาพดี" value={newPost.health} onChange={(e) => setNewPost({ ...newPost, health: e.target.value })} />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>ที่อยู่ปัจจุบัน</label>
                                    <input style={styles.input} placeholder="เช่น กรุงเทพฯ" value={newPost.location} onChange={(e) => setNewPost({ ...newPost, location: e.target.value })} />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>วิธีการส่งต่อ</label>
                                    <select style={styles.select} value={newPost.deliveryMethod} onChange={(e) => setNewPost({ ...newPost, deliveryMethod: e.target.value })}>
                                        <option value="">-- เลือกวิธีส่งต่อ --</option>
                                        <option value="ไปส่งให้">ไปส่งให้</option>
                                        <option value="มารับเอง">มารับเอง</option>
                                        <option value="นัดรับ">นัดรับ</option>
                                    </select>
                                </div>
                                {newPost.deliveryMethod === 'นัดรับ' && (
                                    <div style={{ ...styles.inputGroup, gridColumn: 'span 2' }}>
                                        <label style={styles.label}>สถานที่นัดรับ</label>
                                        <input style={styles.input} placeholder="ระบุสถานที่" value={newPost.meetupPlace} onChange={(e) => setNewPost({ ...newPost, meetupPlace: e.target.value })} />
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
                                <textarea style={styles.textarea} placeholder="เล่าเรื่องราวเกี่ยวกับน้อง..." value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} />
                            </div>

                            {exploreError && (
                                <p style={{ color: colors.heartActive, fontSize: '0.85rem', fontWeight: '600', textAlign: 'center', margin: '0 0 1rem 0' }}>
                                    ⚠️ {exploreError}
                                </p>
                            )}

                            <button 
                                style={{ 
                                    ...styles.smallBtn, 
                                    width: '100%', 
                                    padding: '1rem', 
                                    marginTop: '1.5rem', 
                                    fontSize: '1rem',
                                    opacity: (!newPost.petName.trim() || !newPost.content.trim() || !newPost.location.trim() || !newPost.petImage || !newPost.petType || !newPost.gender || !newPost.deliveryMethod || (newPost.petType === 'อื่นๆ' && !newPost.otherPetType.trim())) ? 0.6 : 1,
                                    cursor: (!newPost.petName.trim() || !newPost.content.trim() || !newPost.location.trim() || !newPost.petImage || !newPost.petType || !newPost.gender || !newPost.deliveryMethod || (newPost.petType === 'อื่นๆ' && !newPost.otherPetType.trim())) ? 'not-allowed' : 'pointer'
                                }} 
                                onClick={handleAddPost}
                                disabled={!newPost.petName.trim() || !newPost.content.trim() || !newPost.location.trim() || !newPost.petImage || !newPost.petType || !newPost.gender || !newPost.deliveryMethod || (newPost.petType === 'อื่นๆ' && !newPost.otherPetType.trim())}
                            >
                                {editingPost ? 'บันทึกการแก้ไข' : 'โพสต์ประกาศ'}
                            </button>
                        </div>
                    </div>
                )}

                {filteredPosts.map(post => (
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
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.2rem' }}>
                                        <h3 style={styles.petName}>{post.petName}</h3>
                                        {post.isAdopted && (
                                            <span style={styles.adoptedBadge}>
                                                ✅ ได้บ้านแล้ว
                                            </span>
                                        )}
                                    </div>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <p style={styles.author}>โดย {post.author}</p>
                                            <span style={{ fontSize: '0.75rem', color: colors.textSecondary }}>• {post.createdAt || 'เมื่อสักครู่'}</span>
                                        </div>
                                </div>
                                {user && user.name === post.author && (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                    <div style={styles.actions} onClick={(e) => e.stopPropagation()}>
                                            <button style={styles.actionBtn} onClick={() => handleStartEdit(post)}>แก้ไข</button>
                                            <button style={styles.actionBtn} onClick={() => handleDeletePost(post.id)}>ลบ</button>
                                        </div>
                                        <label 
                                            style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '0.4rem', 
                                                fontSize: '0.8rem', 
                                                cursor: 'pointer',
                                                color: post.isAdopted ? '#2ecc71' : colors.textSecondary,
                                                fontWeight: '600'
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <input 
                                                type="checkbox" 
                                                checked={post.isAdopted} 
                                                onChange={() => handleToggleAdopted(post.id)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            {post.isAdopted ? 'ได้บ้านแล้ว' : 'ติ๊กเมื่อได้บ้าน'}
                                        </label>
                                        {(post.adoptionRequests && post.adoptionRequests.length > 0) && (
                                            <button 
                                                style={styles.viewRequestsBtn}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setViewingRequestsPostId(post.id);
                                                }}
                                            >
                                                📄 ดูใบสมัคร ({post.adoptionRequests.length})
                                                {post.adoptionRequests.length > 0 && <span style={styles.requestBadge}>new</span>}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <p style={styles.content}>{post.content}</p>

                            <div style={styles.infoGrid}>
                                <div style={styles.infoItem}><span style={styles.infoLabel}>ประเภท</span> <span style={styles.infoValue}>{post.petType}</span></div>
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
                                    {post.liked ? (
                                        <HeartIcon size={20} color={colors.heartActive} fill={colors.heartActive} />
                                    ) : (
                                        <HeartIcon size={20} color={colors.textSecondary} />
                                    )}
                                    <span>{post.likes}</span>
                                </button>
                                <button
                                    style={styles.commentBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPostId(post.id);
                                    }}
                                >
                                    <MessageCircleIcon size={20} color={colors.textSecondary} />
                                    <span>{post.comments.length} ความคิดเห็น</span>
                                </button>
                                {(!post.isAdopted && (!user || user.name !== post.author)) && (
                                    <button 
                                        style={styles.interestBtn}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!user) {
                                                onLoginClick();
                                            } else {
                                                setAdoptionPostId(post.id);
                                                setShowAdoptionForm(true);
                                            }
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        สนใจรับเลี้ยง
                                    </button>
                                )}
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
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.2rem' }}>
                                        <h2 style={styles.detailTitle}>{selectedPost.petName}</h2>
                                        {selectedPost.isAdopted && (
                                            <span style={styles.adoptedBadge}>✅ รับเลี้ยงแล้ว</span>
                                        )}
                                    </div>
                                    <span style={styles.detailAuthor}>โดย {selectedPost.author}</span>
                                </div>
                                {user && user.name === selectedPost.author && (
                                    <div style={styles.detailTopActions}>
                                        <button style={styles.actionBtn} onClick={() => {
                                            handleStartEdit(selectedPost);
                                            setSelectedPostId(null);
                                        }}>แก้ไข</button>
                                        <button style={styles.actionBtn} onClick={() => {
                                            handleDeletePost(selectedPost.id);
                                            setSelectedPostId(null);
                                        }}>ลบ</button>
                                        {(selectedPost.adoptionRequests && selectedPost.adoptionRequests.length > 0) && (
                                            <button 
                                                style={{...styles.viewRequestsBtn, padding: '8px 16px', fontSize: '0.9rem'}}
                                                onClick={() => setViewingRequestsPostId(selectedPost.id)}
                                            >
                                                📄 ดูใบสมัครทั้งหมด ({selectedPost.adoptionRequests.length})
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                                <p style={styles.detailDescription}>{selectedPost.content}</p>

                                <div style={styles.detailInfoGrid}>
                                    <div style={styles.detailInfoItem}>
                                        <span style={styles.detailInfoLabel}>ประเภท</span>
                                        <span style={styles.detailInfoValue}>{selectedPost.petType}</span>
                                    </div>
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
                                    {selectedPost.liked ? (
                                        <HeartIcon size={20} color={colors.heartActive} fill={colors.heartActive} />
                                    ) : (
                                        <HeartIcon size={20} color={colors.textSecondary} />
                                    )}
                                    <span>{selectedPost.likes}</span>
                                </button>
                                <div style={styles.interactionItem}>
                                    <MessageCircleIcon size={20} color={colors.textSecondary} />
                                    <span>{selectedPost.comments.length} ความคิดเห็น</span>
                                </div>
                                {(!selectedPost.isAdopted && (!user || user.name !== selectedPost.author)) && (
                                    <button 
                                        style={{...styles.interestBtn, fontSize: '1rem', padding: '0.8rem 2rem'}}
                                        onClick={() => {
                                            if (!user) {
                                                onLoginClick();
                                            } else {
                                                setAdoptionPostId(selectedPost.id);
                                                setShowAdoptionForm(true);
                                            }
                                        }}
                                    >
                                        สนใจรับเลี้ยง
                                    </button>
                                )}
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
                                                    {comment.liked ? (
                                                        <HeartIcon size={16} color={colors.heartActive} fill={colors.heartActive} />
                                                    ) : (
                                                        <HeartIcon size={16} color={colors.textSecondary} />
                                                    )}
                                                    <span>{comment.likes || 0}</span>
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
                                                    {(expandedComments[comment.id] ? comment.replies : comment.replies.slice(0, 2)).map(reply => (
                                                        <div key={reply.id} style={styles.replyItem}>
                                                            <span style={styles.replyAuthor}>{reply.author}</span>
                                                            <p style={styles.replyText}>{reply.text}</p>
                                                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem' }}>
                                                                <button
                                                                    style={{ ...styles.commentLikeBtn, marginTop: 0, color: reply.liked ? colors.heartActive : colors.textSecondary }}
                                                                    onClick={() => handleLikeReply(selectedPost.id, comment.id, reply.id)}
                                                                >
                                                                    {reply.liked ? (
                                                                        <HeartIcon size={14} color={colors.heartActive} fill={colors.heartActive} />
                                                                    ) : (
                                                                        <HeartIcon size={14} color={colors.textSecondary} />
                                                                    )}
                                                                    <span>{reply.likes || 0}</span>
                                                                </button>
                                                                <button
                                                                    style={{ ...styles.replyBtn, marginTop: 0 }}
                                                                    onClick={() => {
                                                                        setReplyingTo({ postId: selectedPost.id, commentId: comment.id });
                                                                        const replyInput = document.getElementById(`reply-input-${comment.id}`);
                                                                        if (replyInput) {
                                                                            replyInput.value = `@${reply.author} `;
                                                                            replyInput.focus();
                                                                        } else {
                                                                            // If input isn't open yet, we let the state handle it but we might need 
                                                                            // to pass the prefill via state if we want to be robust
                                                                            setCommentText({ ...commentText, [`reply-${comment.id}`]: `@${reply.author} ` });
                                                                        }
                                                                    }}
                                                                >
                                                                    ตอบกลับ
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {comment.replies.length > 2 && (
                                                        <button 
                                                            style={styles.viewMoreBtn}
                                                            onClick={() => setExpandedComments({ ...expandedComments, [comment.id]: !expandedComments[comment.id] })}
                                                        >
                                                            {expandedComments[comment.id] 
                                                                ? 'ซ่อนการตอบกลับ' 
                                                                : `ดูการตอบกลับเพิ่มเติม (${comment.replies.length - 2})`}
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {replyingTo?.commentId === comment.id && (
                                                <div style={styles.commentInput}>
                                                    <input
                                                        autoFocus
                                                        style={styles.commentInputField}
                                                        placeholder="เขียนการตอบกลับ..."
                                                        id={`reply-input-${comment.id}`}
                                                        value={commentText[`reply-${comment.id}`] || ''}
                                                        onChange={(e) => setCommentText({ ...commentText, [`reply-${comment.id}`]: e.target.value })}
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleReply(selectedPost.id, comment.id, e.target.value);
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        style={styles.smallBtn}
                                                        onClick={() => {
                                                            handleReply(selectedPost.id, comment.id, commentText[`reply-${comment.id}`] || '');
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

            {/* Adoption Registration Modal */}
            {showAdoptionForm && (
                <div style={styles.modalOverlay} onClick={() => setShowAdoptionForm(false)}>
                    <div style={{ ...styles.modalCard, maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
                        <button 
                            onClick={() => setShowAdoptionForm(false)} 
                            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
                        >✕</button>

                        <h2 style={{ ...styles.formTitle, textAlign: 'center', fontSize: '1.8rem' }}>แบบฟอร์มการขอรับเลี้ยงสัตว์</h2>
                        <p style={{ textAlign: 'center', color: colors.textSecondary, marginBottom: '2rem' }}>
                            {posts.find(p => p.id === adoptionPostId)?.petName ? `สนใจรับเลี้ยง: ${posts.find(p => p.id === adoptionPostId).petName}` : ''}
                        </p>

                        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '1rem' }}>
                            {/* 1) User Information */}
                            <div style={styles.adoptionSection}>
                                <h3 style={styles.sectionTitle}>👤 1) ข้อมูลผู้สมัคร</h3>
                                <div style={styles.formGridAdopt}>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>ชื่อ – นามสกุล *</label>
                                        <input style={styles.input} value={adoptionData.fullName} onChange={e => setAdoptionData({...adoptionData, fullName: e.target.value})} />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>อายุ *</label>
                                        <input 
                                            style={styles.input} 
                                            placeholder="เช่น 25"
                                            value={adoptionData.age} 
                                            onChange={e => {
                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                if (val !== '' && parseInt(val) > 100) return;
                                                setAdoptionData({...adoptionData, age: val});
                                            }} 
                                        />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>เบอร์โทร *</label>
                                        <input style={styles.input} value={adoptionData.phone} onChange={e => setAdoptionData({...adoptionData, phone: e.target.value})} />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>อีเมล *</label>
                                        <input style={styles.input} type="email" value={adoptionData.email} onChange={e => setAdoptionData({...adoptionData, email: e.target.value})} />
                                    </div>
                                    <div style={{ ...styles.inputGroup, gridColumn: 'span 2' }}>
                                        <label style={styles.label}>Line / Facebook</label>
                                        <input style={styles.input} placeholder="ระบุช่องทางติดต่อเพิ่มเติม" value={adoptionData.social} onChange={e => setAdoptionData({...adoptionData, social: e.target.value})} />
                                    </div>
                                </div>
                            </div>

                            {/* 2) Housing Information */}
                            <div style={styles.adoptionSection}>
                                <h3 style={styles.sectionTitle}>🏠 2) ข้อมูลที่อยู่อาศัย</h3>
                                <div style={styles.formGridAdopt}>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>ลักษณะที่อยู่</label>
                                        <select style={styles.select} value={adoptionData.housingType} onChange={e => setAdoptionData({...adoptionData, housingType: e.target.value})}>
                                            <option value="">-- เลือกประเภทที่อยู่ --</option>
                                            <option value="บ้าน">บ้านเดี่ยว/ทาวน์เฮ้าส์</option>
                                            <option value="คอนโด">คอนโด</option>
                                            <option value="หอพัก">หอพัก/อพาร์ทเม้นท์</option>
                                        </select>
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>สถานะที่พัก</label>
                                        <select style={styles.select} value={adoptionData.isOwner} onChange={e => setAdoptionData({...adoptionData, isOwner: e.target.value})}>
                                            <option value="">-- เลือกสถานะ --</option>
                                            <option value="เจ้าของ">บ้านตนเอง</option>
                                            <option value="เช่า">บ้านเช่า (ระบุว่าเลี้ยงได้)</option>
                                        </select>
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>พื้นที่เลี้ยงสัตว์</label>
                                        <input style={styles.input} placeholder="เช่น มีสวนกว้าง" value={adoptionData.area} onChange={e => setAdoptionData({...adoptionData, area: e.target.value})} />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>จำนวนสมาชิกในบ้าน</label>
                                        <input 
                                            style={styles.input} 
                                            type="number" 
                                            min="1"
                                            placeholder="เช่น 3 คน" 
                                            value={adoptionData.members} 
                                            onChange={e => {
                                                const val = Math.max(1, parseInt(e.target.value) || 1);
                                                setAdoptionData({...adoptionData, members: val});
                                            }} 
                                        />
                                    </div>
                                    <div style={{ ...styles.inputGroup, gridColumn: 'span 2' }}>
                                        <label style={styles.label}>ทุกคนในบ้านยินยอมความเห็นชอบหรือไม่?</label>
                                        <select style={styles.select} value={adoptionData.consent} onChange={e => setAdoptionData({...adoptionData, consent: e.target.value})}>
                                            <option value="">-- เลือกความเห็นชอบ --</option>
                                            <option value="ทุกคนยินยอม">ทุกคนยินยอมและรับทราบ</option>
                                            <option value="บางคน">ยังไม่ได้คุยกับทุกคน</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* 3) Experience */}
                            <div style={styles.adoptionSection}>
                                <h3 style={styles.sectionTitle}>🐾 3) ประสบการณ์เลี้ยงสัตว์</h3>
                                <div style={styles.formGridAdopt}>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>เคยเลี้ยงสัตว์มาก่อนหรือไม่?</label>
                                        <select style={styles.select} value={adoptionData.hasExperience} onChange={e => setAdoptionData({...adoptionData, hasExperience: e.target.value})}>
                                            <option value="">-- เลือกคำตอบ --</option>
                                            <option value="เคยเลี้ยง">เคยเลี้ยง</option>
                                            <option value="ไม่เคย">ไม่เคย (เป็นครั้งแรก)</option>
                                        </select>
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>ตอนนี้มีสัตว์อื่นอยู่หรือเปล่า?</label>
                                        <select style={styles.select} value={adoptionData.hasOtherPets} onChange={e => setAdoptionData({...adoptionData, hasOtherPets: e.target.value})}>
                                            <option value="">-- เลือกคำตอบ --</option>
                                            <option value="ไม่มี">ไม่มี</option>
                                            <option value="มี">มี (ระบุในข้อ 5)</option>
                                        </select>
                                    </div>
                                    <div style={{ ...styles.inputGroup, gridColumn: 'span 2' }}>
                                        <label style={styles.label}>ความเข้าใจเรื่องวัคซีน / ทำหมัน</label>
                                        <select style={styles.select} value={adoptionData.knowsVaccine} onChange={e => setAdoptionData({...adoptionData, knowsVaccine: e.target.value})}>
                                            <option value="">-- เลือกความเข้าใจ --</option>
                                            <option value="ทราบและเคยพาไป">ทราบความสำคัญและพร้อมพาไป</option>
                                            <option value="ยังไม่ค่อยทราบ">ยังไม่แน่ใจเกี่ยวกับค่าใช้จ่ายและระยะเวลา</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* 4) Readiness */}
                            <div style={styles.adoptionSection}>
                                <h3 style={styles.sectionTitle}>❤️ 4) ความพร้อมในการดูแล</h3>
                                <div style={styles.formGridAdopt}>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>มีเวลาเลี้ยงดูน้องสม่ำเสมอไหม?</label>
                                        <select style={styles.select} value={adoptionData.hasTime} onChange={e => setAdoptionData({...adoptionData, hasTime: e.target.value})}>
                                            <option value="">-- เลือกการมีเวลา --</option>
                                            <option value="มีเวลาสม่ำเสมอ">มีเวลาคลุกคลีตลอด</option>
                                            <option value="ทำงานนอกบ้าน">ไปทำงานนอกบ้าน (เช้า-เย็น)</option>
                                        </select>
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>ใครเป็นคนดูแลหลัก?</label>
                                        <input style={styles.input} placeholder="เช่น ตนเอง/คุณแม่" value={adoptionData.caregiver} onChange={e => setAdoptionData({...adoptionData, caregiver: e.target.value})} />
                                    </div>
                                    <div style={{ ...styles.inputGroup, gridColumn: 'span 2' }}>
                                        <label style={styles.label}>ยอมรับค่าใช้จ่ายได้ส่วนนี้ได้หรือไม่?</label>
                                        <select style={styles.select} value={adoptionData.canAfford} onChange={e => setAdoptionData({...adoptionData, canAfford: e.target.value})}>
                                            <option value="">-- เลือกการยอมรับ --</option>
                                            <option value="ยอมรับได้">ยอมรับได้ (อาหาร, ค่ารักษาพยาบาลฉุกเฉิน)</option>
                                            <option value="ค่อนข้างกังวล">ค่อนข้างกังวลกับค่าใช้จ่าย</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* 5) Reason */}
                            <div style={styles.adoptionSection}>
                                <h3 style={styles.sectionTitle}>📝 5) เหตุผลที่อยากรับเลี้ยง</h3>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>ทำไมถึงอยากรับเลี้ยงน้องตัวนี้? *</label>
                                    <textarea 
                                        style={styles.textarea} 
                                        placeholder="เขียนเหตุผลสั้นๆ..." 
                                        value={adoptionData.reason} 
                                        onChange={e => setAdoptionData({...adoptionData, reason: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* 6) Terms */}
                            <div style={{ ...styles.adoptionSection, backgroundColor: 'rgba(46, 204, 113, 0.05)', borderColor: '#2ecc71' }}>
                                <h3 style={{ ...styles.sectionTitle, color: '#27ae60' }}>✅ 6) ยอมรับเงื่อนไข</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', fontSize: '0.95rem' }}>
                                        <input type="checkbox" checked={adoptionData.termsAccepted} onChange={e => setAdoptionData({...adoptionData, termsAccepted: e.target.checked})} />
                                        ยินดีดูแลและรับผิดชอบตลอดชีวิต ไม่นำไปทิ้ง
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', fontSize: '0.95rem' }}>
                                        <input type="checkbox" checked={adoptionData.termsAccepted} readOnly />
                                        ไม่ปล่อยปละละเลย และให้ความรักความใส่ใจ
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button 
                            style={{ 
                                ...styles.smallBtn, 
                                width: '100%', 
                                padding: '1.2rem', 
                                marginTop: '1.5rem', 
                                fontSize: '1.1rem', 
                                backgroundColor: '#27ae60',
                                opacity: (!adoptionData.fullName || !adoptionData.phone || !adoptionData.reason || !adoptionData.termsAccepted || !adoptionData.housingType || !adoptionData.isOwner || !adoptionData.consent || !adoptionData.hasExperience || !adoptionData.hasOtherPets || !adoptionData.knowsVaccine || !adoptionData.hasTime || !adoptionData.canAfford) ? 0.6 : 1,
                                cursor: (!adoptionData.fullName || !adoptionData.phone || !adoptionData.reason || !adoptionData.termsAccepted || !adoptionData.housingType || !adoptionData.isOwner || !adoptionData.consent || !adoptionData.hasExperience || !adoptionData.hasOtherPets || !adoptionData.knowsVaccine || !adoptionData.hasTime || !adoptionData.canAfford) ? 'not-allowed' : 'pointer'
                            }} 
                            onClick={handleAdoptionSubmit}
                            disabled={!adoptionData.fullName || !adoptionData.phone || !adoptionData.reason || !adoptionData.termsAccepted || !adoptionData.housingType || !adoptionData.isOwner || !adoptionData.consent || !adoptionData.hasExperience || !adoptionData.hasOtherPets || !adoptionData.knowsVaccine || !adoptionData.hasTime || !adoptionData.canAfford}
                        >
                            ยืนยันการส่งใบสมัคร
                        </button>
                    </div>
                </div>
            )}

            {/* View Adoption Requests Modal */}
            {viewingRequestsPostId && (
                <div style={styles.modalOverlay} onClick={() => setViewingRequestsPostId(null)}>
                    <div style={{ ...styles.modalCard, maxWidth: '900px', height: '80vh', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
                        <button 
                            onClick={() => setViewingRequestsPostId(null)} 
                            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
                        >✕</button>

                        <h2 style={{ ...styles.formTitle, textAlign: 'center' }}>
                            ใบสมัครรับเลี้ยง ( {posts.find(p => p.id === viewingRequestsPostId)?.petName} )
                        </h2>

                        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '1rem', marginTop: '1rem' }}>
                            {posts.find(p => p.id === viewingRequestsPostId)?.adoptionRequests.map((req, idx) => (
                                <div key={req.id} style={styles.requestCard}>
                                    <div style={styles.requestHeader}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                            <div style={{ fontWeight: '800', color: colors.primary, fontSize: '1.1rem' }}>
                                                # {idx + 1} ผู้สมัคร: {req.fullName}
                                            </div>
                                            {req.status === 'selected' && (
                                                <span style={{ 
                                                    backgroundColor: '#2ecc71', 
                                                    color: 'white', 
                                                    padding: '2px 10px', 
                                                    borderRadius: '10px', 
                                                    fontSize: '0.75rem',
                                                    fontWeight: '800'
                                                }}>
                                                    ผู้ที่ได้รับเลือก ✨
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: colors.textSecondary }}>
                                            ส่งเมื่อ: {req.submittedAt}
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', fontSize: '0.95rem' }}>
                                        <div>
                                            <p><strong>👤 ข้อมูล:</strong> อายุ {req.age} ปี / โทร: {req.phone} / {req.email}</p>
                                            <p><strong>🏠 ที่อยู่:</strong> {req.housingType} ({req.isOwner}) / พื้นที่: {req.area}</p>
                                            <p><strong>👥 สมาชิก:</strong> {req.members} คน ({req.consent})</p>
                                        </div>
                                        <div>
                                            <p><strong>🐾 ประสบการณ์:</strong> {req.hasExperience} / มีสัตว์อื่น: {req.hasOtherPets}</p>
                                            <p><strong>❤️ ความพร้อม:</strong> {req.hasTime} / ผู้ดูแล: {req.caregiver} / งบ: {req.canAfford}</p>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'white', borderRadius: '12px', border: `1px solid ${colors.border}` }}>
                                        <p style={{ margin: 0 }}><strong>📝 เหตุผล:</strong> {req.reason}</p>
                                    </div>
                                    
                                    <div style={{ marginTop: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#27ae60', fontWeight: 'bold' }}>
                                            <span>✅ ยินดีดูแลตลอดชีวิต</span>
                                            <span>✅ ไม่ทอดทิ้ง</span>
                                        </div>
                                        <button 
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '12px',
                                                border: 'none',
                                                backgroundColor: req.status === 'selected' ? '#2ecc71' : '#f0f0f0',
                                                color: req.status === 'selected' ? 'white' : colors.textMain,
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onClick={() => handleSelectApplicant(viewingRequestsPostId, req.id)}
                                        >
                                            <input 
                                                type="checkbox" 
                                                checked={req.status === 'selected'} 
                                                readOnly 
                                                style={{ pointerEvents: 'none' }}
                                            />
                                            {req.status === 'selected' ? 'เลือกแล้ว' : 'เลือกคนนี้'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {posts.find(p => p.id === viewingRequestsPostId)?.adoptionRequests.length === 0 && (
                                <p style={{ textAlign: 'center', marginTop: '3rem', color: colors.textSecondary }}>ยังไม่มีใบสมัครส่งเข้ามา</p>
                            )}
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
        </div >
    );
};

export default Explore;
