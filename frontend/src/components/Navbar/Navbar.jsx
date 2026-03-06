import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ onLoginClick, user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Earth Tone Palette
    const colors = {
        bg: 'rgba(253, 250, 246, 0.95)',
        border: 'rgba(139, 94, 60, 0.15)',
        primary: '#8b5e3c', // Brown
        textMain: '#3d2b1f', // Deep Espresso
        textMuted: '#8d7b6d', // Muted Clay
        white: '#ffffff',
    };

    const styles = {
        nav: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '72px',
            backgroundColor: colors.bg,
            backdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            zIndex: 1000,
            fontFamily: "'Outfit', sans-serif"
        },
        container: {
            maxWidth: '1280px',
            width: '100%',
            margin: '0 auto',
            padding: '0 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        brand: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '1.5rem',
            color: colors.textMain,
            letterSpacing: '-0.5px'
        },
        brandDot: {
            width: '12px',
            height: '12px',
            backgroundColor: colors.primary,
            borderRadius: '4px',
            transform: 'rotate(45deg)'
        },
        links: {
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'center'
        },
        link: {
            textDecoration: 'none',
            color: colors.textMuted,
            fontWeight: '600',
            fontSize: '0.95rem',
            padding: '4px 4px',
            margin: '0 8px',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            borderBottom: '3px solid transparent'
        },
        activeLink: {
            color: colors.primary,
            borderBottom: `3px solid ${colors.primary}`
        },
        mobileLinks: {
            position: 'absolute',
            top: '72px',
            left: 0,
            width: '100%',
            backgroundColor: colors.bg,
            display: isOpen ? 'flex' : 'none',
            flexDirection: 'column',
            padding: '2rem',
            gap: '1rem',
            borderBottom: `1px solid ${colors.border}`,
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
        },
        btnPrimary: {
            backgroundColor: colors.primary,
            color: '#fff',
            padding: '0.6rem 1.4rem',
            borderRadius: '8px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textDecoration: 'none'
        },
        toggle: {
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: colors.textMain
        },
        userProfile: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.4rem 0.8rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(139, 94, 60, 0.08)',
            cursor: 'default'
        },
        avatar: {
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: colors.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: '700',
            fontSize: '0.85rem',
            overflow: 'hidden'
        },
        avatarImg: {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        },
        userName: {
            fontSize: '0.9rem',
            fontWeight: '600',
            color: colors.textMain
        },
        logoutBtn: {
            background: 'none',
            border: 'none',
            color: '#e74c3c',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            padding: '0'
        },

    };



    const handleLoginClick = () => {
        setIsOpen(false);
        onLoginClick();
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.container}>
                <Link to="/" style={styles.brand}>
                    <span style={styles.brandDot}></span>
                    Jorn
                </Link>

                {/* Desktop Links */}
                <div style={window.innerWidth > 768 ? styles.links : styles.mobileLinks}>
                    <Link 
                        to="/explore" 
                        style={location.pathname === '/' || location.pathname === '/explore' ? {...styles.link, ...styles.activeLink} : styles.link} 
                        onClick={() => setIsOpen(false)}
                    >Adopt</Link>
                    <Link 
                        to="/community" 
                        style={location.pathname === '/community' ? {...styles.link, ...styles.activeLink} : styles.link} 
                        onClick={() => setIsOpen(false)}
                    >Community</Link>                    
                    {/* Actions inside mobile menu if open */}
                    {isOpen && (
                        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
                            {user ? (
                                <>
                                    <Link 
                                        to="/profile" 
                                        style={{...styles.userName, paddingLeft: '0.75rem', textDecoration: 'none', color: colors.primary, display: 'flex', alignItems: 'center', gap: '0.5rem'}}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div style={styles.avatar}>
                                            {user.avatar ? (
                                                <img src={user.avatar} alt="Profile" style={styles.avatarImg} />
                                            ) : (
                                                (user.name || '?').charAt(0)
                                            )}
                                        </div>
                                        สวัสดี, {user.name || 'ผู้ใช้งาน'}
                                    </Link>
                                    <button style={styles.logoutBtn} onClick={() => { onLogout(); setIsOpen(false); }}>Log out</button>
                                </>
                            ) : (
                                <button style={styles.link} onClick={handleLoginClick}>Log in</button>
                            )}
                        </div>
                    )}
                </div>

                <div style={{...styles.links, display: window.innerWidth > 768 ? 'flex' : 'none'}}>
                    {user ? (
                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                            <Link 
                                to="/chat" 
                                style={{
                                    fontSize: '1.5rem',
                                    textDecoration: 'none',
                                    padding: '0.4rem',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease',
                                    backgroundColor: location.pathname === '/chat' ? 'rgba(139, 94, 60, 0.15)' : 'transparent'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(139, 94, 60, 0.15)'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = location.pathname === '/chat' ? 'rgba(139, 94, 60, 0.15)' : 'transparent'}
                            >💬</Link>
                            <Link 
                                to="/profile" 
                                style={{...styles.userProfile, textDecoration: 'none'}}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(139, 94, 60, 0.15)'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(139, 94, 60, 0.08)'}
                            >
                                <div style={styles.avatar}>
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="Profile" style={styles.avatarImg} />
                                    ) : (
                                        (user.name || '?').charAt(0)
                                    )}
                                </div>
                                <span style={styles.userName}>{user.name || 'ผู้ใช้งาน'}</span>
                            </Link>
                            <button style={styles.logoutBtn} onClick={onLogout}>Log out</button>
                        </div>
                    ) : (
                        <button style={styles.link} onClick={onLoginClick}>Log in</button>
                    )}
                </div>

                {/* Mobile Toggle Button */}
                <button 
                    style={{...styles.toggle, display: window.innerWidth <= 768 ? 'block' : 'none'}}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? '✕' : '☰'}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
