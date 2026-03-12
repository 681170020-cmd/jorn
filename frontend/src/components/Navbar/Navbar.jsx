import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const MessageCircleIcon = ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
);

const Navbar = ({ onLoginClick, user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            display: isMobile ? 'block' : 'none',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: colors.textMain
        },
        userProfile: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.4rem',
            borderRadius: '50%',
            backgroundColor: 'rgba(139, 94, 60, 0.08)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
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
               <img src="/logo.png" alt="Jorn Logo" style={{height:"80px"}} />
</Link>

                {/* Desktop Links */}
                <div style={!isMobile ? styles.links : styles.mobileLinks}>
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
                                        style={{...styles.userName, textDecoration: 'none', color: colors.primary, display: 'flex', alignItems: 'center'}}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div style={styles.avatar}>
                                            {user.avatar ? (
                                                <img src={user.avatar} alt="Profile" style={styles.avatarImg} />
                                            ) : (
                                                (user.name || '?').charAt(0)
                                            )}
                                        </div>
                                    </Link>
                                    <button style={styles.logoutBtn} onClick={() => { onLogout(); setIsOpen(false); }}>Log out</button>
                                </>
                            ) : (
                                <button style={styles.link} onClick={handleLoginClick}>Log in</button>
                            )}
                        </div>
                    )}
                </div>

                <div style={{...styles.links, display: !isMobile ? 'flex' : 'none'}}>
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
                            >
                                <MessageCircleIcon size={24} color={colors.primary} />
                            </Link>
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
                            </Link>
                            <button style={styles.logoutBtn} onClick={onLogout}>Log out</button>
                        </div>
                    ) : (
                        <button style={styles.link} onClick={onLoginClick}>Log in</button>
                    )}
                </div>

                {/* Mobile Toggle Button */}
                <button 
                    style={styles.toggle}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? '✕' : '☰'}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
