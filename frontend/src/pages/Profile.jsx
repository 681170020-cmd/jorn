import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

const Profile = ({ user, onUpdateUser, communityPosts = [], explorePosts = [] }) => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
    const [editedUser, setEditedUser] = useState({
        name: '',
        phone: '',
        location: '',
        birthday: '',
        avatar: ''
    });

    // Gather and filter posts from both Community and Explore
    const userPosts = [
        ...communityPosts.filter(p => p.author === user?.name),
        ...explorePosts.filter(p => p.author === user?.name)
    ].sort((a, b) => {
        // Sort by id (simulation of timestamp) descending
        return b.id - a.id;
    });
    
    const [showFullInfo, setShowFullInfo] = useState(false);
    const [selectedDetailedPost, setSelectedDetailedPost] = useState(null);

    // Handle Edit click: Initialize the form with current user data
    const handleStartEdit = () => {
        setEditedUser({
            name: user?.name || '',
            phone: user?.phone || '',
            location: user?.location || '',
            birthday: user?.birthday || '',
            avatar: user?.avatar || ''
        });
        setIsEditing(true);
    };

    // Redirect to home if not logged in
    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    if (!user) return null;

    const handleSave = () => {
        if (editedUser.name.trim() === '') {
            alert('กรุณากรอกชื่อ');
            return;
        }
        if (editedUser.phone && editedUser.phone.length !== 10) {
            alert('กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก');
            return;
        }
        onUpdateUser({
            ...user,
            ...editedUser
        });
        setIsEditing(false);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedUser(prev => ({ ...prev, avatar: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        if (isEditing && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const colors = {
        bg: '#fdfaf6',
        cardBg: '#ffffff',
        primary: '#8b5e3c',
        textMain: '#3d2b1f',
        textSecondary: '#8d7b6d',
        border: 'rgba(139, 94, 60, 0.15)',
        formBg: '#f0e9e4',
        success: '#2ecc71',
        danger: '#e74c3c'
    };

    const styles = {
        container: {
            padding: '120px 2rem 50px',
            backgroundColor: colors.bg,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: "'Outfit', sans-serif",
            color: colors.textMain
        },
        profileCard: {
            backgroundColor: colors.cardBg,
            borderRadius: '30px',
            padding: '3rem',
            width: '100%',
            maxWidth: '600px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            border: `1px solid ${colors.border}`,
            textAlign: 'center',
            position: 'relative'
        },
        avatarLarge: {
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            backgroundColor: colors.primary,
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '4rem',
            fontWeight: '700',
            color: 'white',
            boxShadow: '0 8px 25px rgba(139, 94, 60, 0.25)',
            cursor: isEditing ? 'pointer' : 'default',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
        },
        avatarImg: {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        },
        avatarOverlay: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.3)',
            display: isEditing ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isHoveringAvatar ? 1 : 0,
            transition: 'opacity 0.3s ease',
            fontSize: '0.9rem',
            color: '#fff',
            fontWeight: '600'
        },
        userName: {
            fontSize: '2rem',
            fontWeight: '800',
            marginBottom: '0.5rem'
        },
        userHandle: {
            fontSize: '1rem',
            color: colors.textSecondary,
            marginBottom: '2rem'
        },
        infoGrid: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
            textAlign: 'left',
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: `1px solid ${colors.border}`
        },
        infoItem: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem'
        },
        infoLabel: {
            fontSize: '0.85rem',
            color: colors.textSecondary,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
        },
        infoValue: {
            fontSize: '1rem',
            fontWeight: '600'
        },
        input: {
            padding: '0.7rem 1.2rem',
            borderRadius: '12px',
            border: `1.5px solid ${colors.border}`,
            fontSize: '1rem',
            outline: 'none',
            fontFamily: 'inherit',
            backgroundColor: colors.bg,
            transition: 'border-color 0.2s',
            width: '100%',
            boxSizing: 'border-box'
        },
        readonlyInput: {
            backgroundColor: 'rgba(139, 94, 60, 0.05)',
            color: colors.textSecondary,
            cursor: 'not-allowed',
            borderStyle: 'dashed'
        },
        btnGroup: {
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            marginTop: '2.5rem'
        },
        primaryBtn: {
            padding: '0.9rem 2.2rem',
            borderRadius: '14px',
            border: 'none',
            backgroundColor: colors.primary,
            color: 'white',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            fontSize: '0.95rem',
            boxShadow: '0 4px 12px rgba(139, 94, 60, 0.2)'
        },
        secondaryBtn: {
            padding: '0.9rem 2.2rem',
            borderRadius: '14px',
            border: 'none',
            backgroundColor: colors.formBg,
            color: colors.textMain,
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
        },
        saveBtn: {
            backgroundColor: colors.success,
            boxShadow: '0 4px 12px rgba(46, 204, 113, 0.2)'
        },
        cancelBtn: {
            backgroundColor: colors.danger,
            boxShadow: '0 4px 12px rgba(231, 76, 60, 0.2)'
        },

        // Post Section Styles
        postsSection: {
            width: '100%',
            maxWidth: '600px',
            marginTop: '2.5rem',
            textAlign: 'left'
        },
        sectionTitle: {
            fontSize: '1.4rem',
            fontWeight: '800',
            color: colors.textMain,
            marginBottom: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem'
        },
        postCard: {
            backgroundColor: colors.cardBg,
            borderRadius: '24px',
            padding: '2rem',
            marginBottom: '1.5rem',
            border: `1px solid ${colors.border}`,
            display: 'flex',
            gap: '1.5rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            position: 'relative',
            overflow: 'hidden'
        },
        avatarColumn: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.8rem',
            flexShrink: 0
        },
        avatarCircle: {
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: colors.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            color: 'white',
            fontWeight: '700',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(139, 94, 60, 0.15)'
        },
        avatarImgSmall: {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        },
        contentColumn: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
        },
        postHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '0.8rem'
        },
        postPetName: {
            fontWeight: '800',
            fontSize: '1.2rem',
            color: colors.textMain,
            margin: 0
        },
        postDate: {
            fontSize: '0.8rem',
            color: colors.textSecondary
        },
        postContent: {
            fontSize: '1rem',
            color: colors.textMain,
            lineHeight: '1.6',
            margin: '0 0 1rem 0'
        },
        postImage: {
            width: '100%',
            maxHeight: '400px',
            borderRadius: '16px',
            objectFit: 'cover',
            backgroundColor: colors.formBg,
            marginBottom: '1rem'
        },
        infoGridMini: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
            gap: '0.6rem',
            marginTop: '0.5rem'
        },
        infoItemMini: {
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
        },
        infoLabelMini: {
            fontSize: '0.7rem',
            color: colors.textSecondary,
            textTransform: 'uppercase'
        },
        infoValueMini: {
            fontSize: '0.85rem',
            fontWeight: '600',
            color: colors.textMain
        },
        emptyBox: {
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: 'rgba(139, 94, 60, 0.03)',
            borderRadius: '24px',
            border: `1px dashed ${colors.border}`,
            color: colors.textSecondary
        },
        toggleBtn: {
            background: 'none',
            border: 'none',
            color: colors.primary,
            fontSize: '0.9rem',
            fontWeight: '700',
            cursor: 'pointer',
            padding: '0.5rem 1rem',
            margin: '0 auto 1.5rem',
            display: 'block',
            transition: 'all 0.2s ease',
            opacity: 0.8
        },

        // Detailed Modal Styles
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(61, 43, 31, 0.4)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '2rem'
        },
        modalCard: {
            backgroundColor: 'white',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            position: 'relative',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
        },
        modalImage: {
            width: '100%',
            height: '250px',
            objectFit: 'cover',
            borderRadius: '16px',
            marginBottom: '1.5rem'
        },
        modalPetName: {
            fontSize: '1.5rem',
            fontWeight: '800',
            color: colors.primary,
            marginBottom: '0.5rem'
        },
        modalContent: {
            fontSize: '1rem',
            color: colors.textMain,
            lineHeight: '1.6',
            marginBottom: '1.5rem'
        },
        modalInfoGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
            backgroundColor: 'rgba(139, 94, 60, 0.05)',
            padding: '1.2rem',
            borderRadius: '16px',
            marginBottom: '1.5rem'
        }
    };

    // Safely calculate display values
    const safeName = isEditing ? editedUser.name : (user?.name || 'ผู้ใช้งาน');
    const displayAvatar = isEditing ? editedUser.avatar : user?.avatar;
    const initials = (isEditing ? editedUser.name : safeName).charAt(0) || '?';
    const userHandle = `@${safeName?.toLowerCase().replace(/\s/g, '') || 'user'}`;

    return (
        <div style={styles.container}>
            <div style={styles.profileCard}>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <div
                    style={styles.avatarLarge}
                    onClick={triggerFileInput}
                    onMouseEnter={() => setIsHoveringAvatar(true)}
                    onMouseLeave={() => setIsHoveringAvatar(false)}
                >
                    {displayAvatar ? (
                        <img src={displayAvatar} alt="Profile" style={styles.avatarImg} />
                    ) : (
                        initials
                    )}
                    <div style={styles.avatarOverlay}>
                        <span>เปลี่ยนรูป</span>
                    </div>
                </div>

                {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'center' }}>
                        <input
                            style={{ 
                                ...styles.input, 
                                ...styles.readonlyInput,
                                fontSize: '1.6rem', 
                                fontWeight: '800', 
                                textAlign: 'center', 
                                width: '90%' 
                            }}
                            value={editedUser.name}
                            readOnly
                            placeholder="ระบุชื่อของคุณ"
                        />
                        <p style={{ margin: 0, color: colors.textSecondary }}>{userHandle}</p>
                    </div>
                ) : (
                    <>
                        <h1 style={styles.userName}>{safeName}</h1>
                        <p style={styles.userHandle}>{userHandle}</p>
                    </>
                )}

                {/* Toggle Details Button */}
                {!isEditing && (
                    <button
                        style={styles.toggleBtn}
                        onClick={() => setShowFullInfo(!showFullInfo)}
                    >
                        {showFullInfo ? 'ซ่อนรายละเอียด ↑' : 'ดูรายละเอียดเพิ่มเติม ↓'}
                    </button>
                )}

                {(showFullInfo || isEditing) && (
                    <div style={styles.infoGrid}>
                        <div style={styles.infoItem}>
                            <span style={styles.infoLabel}>อีเมล</span>
                            <span style={styles.infoValue}>{user?.email || '-'}</span>
                        </div>

                        <div style={styles.infoItem}>
                            <span style={styles.infoLabel}>เบอร์โทรศัพท์</span>
                            {isEditing ? (
                                <input
                                    style={styles.input}
                                    value={editedUser.phone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, '');
                                        if (val.length <= 10) {
                                            setEditedUser({ ...editedUser, phone: val });
                                        }
                                    }}
                                    placeholder="เบอร์โทรศัพท์ (10 หลัก)"
                                    maxLength={10}
                                />
                            ) : (
                                <span style={styles.infoValue}>{user?.phone || '-'}</span>
                            )}
                        </div>

                        <div style={styles.infoItem}>
                            <span style={styles.infoLabel}>สถานที่</span>
                            {isEditing ? (
                                <input
                                    style={styles.input}
                                    value={editedUser.location}
                                    onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                                    placeholder="จังหวัด/ที่อยู่"
                                />
                            ) : (
                                <span style={styles.infoValue}>{user?.location || '-'}</span>
                            )}
                        </div>

                        <div style={styles.infoItem}>
                            <span style={styles.infoLabel}>วันเกิด</span>
                            {isEditing ? (
                                <input
                                    style={styles.input}
                                    type="date"
                                    value={editedUser.birthday}
                                    onChange={(e) => setEditedUser({ ...editedUser, birthday: e.target.value })}
                                />
                            ) : (
                                <span style={styles.infoValue}>
                                    {user?.birthday
                                        ? new Date(user.birthday).toLocaleDateString('th-TH', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })
                                        : '-'}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                <div style={styles.btnGroup}>
                    {isEditing ? (
                        <>
                            <button
                                style={{ ...styles.primaryBtn, ...styles.saveBtn }}
                                onClick={handleSave}
                            >
                                บันทึกข้อมูล
                            </button>
                            <button
                                style={{ ...styles.primaryBtn, ...styles.cancelBtn }}
                                onClick={() => setIsEditing(false)}
                            >
                                ยกเลิก
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                style={styles.primaryBtn}
                                onClick={handleStartEdit}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                แก้ไขข้อมูล
                            </button>
                            <button
                                style={styles.secondaryBtn}
                                onClick={() => navigate(-1)}
                            >
                                กลับ
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* My Posts Section */}
            <div style={styles.postsSection}>
                <h2 style={styles.sectionTitle}>
                    📝 โพสต์ของฉัน
                </h2>

                {userPosts && userPosts.length > 0 ? (
                    userPosts.map(post => {
                        const isExplore = !!post.petType;
                        return (
                            <div 
                                key={`${post.id}-${post.author}`} 
                                style={styles.postCard}
                                onClick={() => setSelectedDetailedPost(post)}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.06)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.02)';
                                }}
                            >
                                <div style={styles.avatarColumn}>
                                    <div style={styles.avatarCircle}>
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt={user.name} style={styles.avatarImgSmall} />
                                        ) : (
                                            initials
                                        )}
                                    </div>
                                </div>
                                <div style={styles.contentColumn}>
                                    <div style={styles.postHeader}>
                                        <div>
                                            <h3 style={styles.postPetName}>
                                                {post.petName || (post.category === 'knowledge' ? '💡 สาระน่ารู้' : '🐾 โพสต์ทั่วไป')}
                                            </h3>
                                            <span style={styles.postDate}>{post.createdAt}</span>
                                        </div>
                                        {post.isAdopted && (
                                            <span style={{ backgroundColor: '#2ecc71', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '800' }}>
                                                ✅ ได้บ้านแล้ว
                                            </span>
                                        )}
                                    </div>

                                    <p style={styles.postContent}>{post.content}</p>

                                    {(post.image || post.petImage) && (
                                        <img 
                                            src={post.image || post.petImage} 
                                            alt="Post body" 
                                            style={styles.postImage} 
                                        />
                                    )}

                                    {isExplore && (
                                        <div style={styles.infoGridMini}>
                                            <div style={styles.infoItemMini}><span style={styles.infoLabelMini}>ประเภท</span> <span style={styles.infoValueMini}>{post.petType}</span></div>
                                            <div style={styles.infoItemMini}><span style={styles.infoLabelMini}>เพศ</span> <span style={styles.infoValueMini}>{post.gender}</span></div>
                                            <div style={styles.infoItemMini}><span style={styles.infoLabelMini}>พิกัด</span> <span style={styles.infoValueMini}>{post.location}</span></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={styles.emptyBox}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🍃</div>
                        <h3 style={{ margin: '0 0 0.5rem', color: colors.textMain }}>ยังไม่มีโพสต์</h3>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>คุณยังไม่ได้สร้างประกาศหาบ้านให้น้องๆ เลย</p>
                    </div>
                )}
            </div>

            {/* Post Detail Modal */}
            {selectedDetailedPost && (
                <div style={styles.modalOverlay} onClick={() => setSelectedDetailedPost(null)}>
                    <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
                        <button 
                            onClick={() => setSelectedDetailedPost(null)}
                            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
                        >✕</button>

                        {(selectedDetailedPost.image || selectedDetailedPost.petImage) && (
                            <img 
                                src={selectedDetailedPost.image || selectedDetailedPost.petImage} 
                                style={styles.modalImage} 
                                alt="Post"
                            />
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={styles.modalPetName}>
                                    {selectedDetailedPost.petName || (selectedDetailedPost.category === 'knowledge' ? '💡 สาระน่ารู้' : '🐾 โพสต์ทั่วไป')}
                                </h3>
                                <div style={{ fontSize: '0.9rem', color: colors.textSecondary }}>
                                    {selectedDetailedPost.createdAt}
                                </div>
                            </div>
                            {selectedDetailedPost.isAdopted && (
                                <span style={{ backgroundColor: '#2ecc71', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' }}>
                                    ✅ ได้บ้านแล้ว
                                </span>
                            )}
                        </div>

                        <p style={styles.modalContent}>{selectedDetailedPost.content}</p>

                        {/* Additional Info for Explore Posts */}
                        {selectedDetailedPost.petType && (
                            <div style={styles.modalInfoGrid}>
                                <div><span style={{ fontSize: '0.8rem', color: colors.textSecondary }}>ประเภท:</span> <span style={{ display: 'block', fontWeight: '600' }}>{selectedDetailedPost.petType}</span></div>
                                <div><span style={{ fontSize: '0.8rem', color: colors.textSecondary }}>เพศ:</span> <span style={{ display: 'block', fontWeight: '600' }}>{selectedDetailedPost.gender}</span></div>
                                <div><span style={{ fontSize: '0.8rem', color: colors.textSecondary }}>อายุ:</span> <span style={{ display: 'block', fontWeight: '600' }}>{selectedDetailedPost.age}</span></div>
                                <div><span style={{ fontSize: '0.8rem', color: colors.textSecondary }}>พิกัด:</span> <span style={{ display: 'block', fontWeight: '600' }}>{selectedDetailedPost.location}</span></div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
