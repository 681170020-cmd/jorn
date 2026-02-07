import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

const Profile = ({ user, onUpdateUser }) => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({
        name: '',
        phone: '',
        location: '',
        birthday: '',
        avatar: ''
    });

    // Sample user posts (empty initial state as requested)
    const [userPosts, setUserPosts] = useState([]);
    const [showFullInfo, setShowFullInfo] = useState(false);

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
                // Update local state first, so it doesn't change global state immediately
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
            opacity: 0,
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
            borderRadius: '20px',
            padding: '1.5rem',
            marginBottom: '1rem',
            border: `1px solid ${colors.border}`,
            display: 'flex',
            gap: '1.2rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
            transition: 'transform 0.2s ease'
        },
        postImage: {
            width: '80px',
            height: '80px',
            borderRadius: '12px',
            objectFit: 'cover',
            backgroundColor: colors.formBg
        },
        postBody: {
            flex: 1
        },
        postPetName: {
            fontWeight: '700',
            fontSize: '1.1rem',
            color: colors.primary,
            marginBottom: '4px',
            display: 'block'
        },
        postContent: {
            fontSize: '0.9rem',
            color: colors.textSecondary,
            lineHeight: '1.5',
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
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
        }
    };

    // Safely calculate display values
    const safeName = isEditing ? editedUser.name : (user?.name || 'ผู้ใช้งาน');
    const displayAvatar = isEditing ? editedUser.avatar : user?.avatar;
    const initials = (isEditing ? editedUser.name : safeName).charAt(0) || '?';
    const userHandle = `@${safeName.toLowerCase().replace(/\s/g, '') || 'user'}`;

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
                    onMouseOver={(e) => {
                        if (isEditing) {
                            const overlay = e.currentTarget.querySelector('.avatar-overlay');
                            if (overlay) overlay.style.opacity = '1';
                        }
                    }}
                    onMouseOut={(e) => {
                        if (isEditing) {
                            const overlay = e.currentTarget.querySelector('.avatar-overlay');
                            if (overlay) overlay.style.opacity = '0';
                        }
                    }}
                >
                    {displayAvatar ? (
                        <img src={displayAvatar} alt="Profile" style={styles.avatarImg} />
                    ) : (
                        initials
                    )}
                    <div className="avatar-overlay" style={styles.avatarOverlay}>
                        <span>เปลี่ยนรูป</span>
                    </div>
                </div>

                {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'center' }}>
                        <input
                            style={{ ...styles.input, fontSize: '1.6rem', fontWeight: '800', textAlign: 'center', width: '90%' }}
                            value={editedUser.name}
                            onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                            placeholder="ระบุชื่อของคุณ"
                            autoFocus
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

                {userPosts.length > 0 ? (
                    userPosts.map(post => (
                        <div key={post.id} style={styles.postCard}>
                            {post.image && <img src={post.image} alt={post.petName} style={styles.postImage} />}
                            <div style={styles.postBody}>
                                <span style={styles.postPetName}>{post.petName || 'ไม่มีชื่อ'}</span>
                                <p style={styles.postContent}>{post.content}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={styles.emptyBox}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🍃</div>
                        <h3 style={{ margin: '0 0 0.5rem', color: colors.textMain }}>ยังไม่มีโพสต์</h3>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>คุณยังไม่ได้สร้างประกาศหาบ้านให้น้องๆ เลย</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
