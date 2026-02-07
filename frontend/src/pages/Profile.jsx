import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

const Profile = ({ user, onUpdateUser }) => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Redirect to home if not logged in
    if (!user) {
        setTimeout(() => navigate('/'), 0);
        return null;
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdateUser({ avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const colors = {
        bg: '#fdfaf6',
        cardBg: '#ffffff',
        primary: '#8b5e3c',
        textMain: '#3d2b1f',
        textSecondary: '#8d7b6d',
        border: 'rgba(139, 94, 60, 0.15)',
        formBg: '#f0e9e4',
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
            textAlign: 'center'
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
            cursor: 'pointer',
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
            backgroundColor: 'rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            fontSize: '1rem',
            color: '#fff'
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
        backBtn: {
            marginTop: '2rem',
            padding: '0.8rem 1.5rem',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: colors.formBg,
            color: colors.textMain,
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
        }
    };

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
                    onMouseOver={(e) => e.currentTarget.querySelector('.avatar-overlay').style.opacity = '1'}
                    onMouseOut={(e) => e.currentTarget.querySelector('.avatar-overlay').style.opacity = '0'}
                >
                    {user.avatar ? (
                        <img src={user.avatar} alt="Profile" style={styles.avatarImg} />
                    ) : (
                        user.name.charAt(0)
                    )}
                    <div className="avatar-overlay" style={styles.avatarOverlay}>
                        <span>เปลี่ยนรูป</span>
                    </div>
                </div>
                <h1 style={styles.userName}>{user.name}</h1>
                <p style={styles.userHandle}>@{user.name.toLowerCase()}</p>
                
                <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>Email</span>
                        <span style={styles.infoValue}>{user.email}</span>
                    </div>
                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>Phone Number</span>
                        <span style={styles.infoValue}>{user.phone}</span>
                    </div>
                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>Location</span>
                        <span style={styles.infoValue}>{user.location}</span>
                    </div>
                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>Birthday</span>
                        <span style={styles.infoValue}>{user.birthday}</span>
                    </div>
                </div>

                <button 
                    style={styles.backBtn}
                    onClick={() => navigate(-1)}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.border}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.formBg}
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default Profile;
