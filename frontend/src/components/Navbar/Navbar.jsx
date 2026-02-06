import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLoginClick }) => {
    const [isOpen, setIsOpen] = useState(false);

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
            fontWeight: '500',
            fontSize: '0.95rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            background: 'none',
            border: 'none'
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
        }
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
                    <Link to="/" style={{...styles.link, color: colors.primary}} onClick={() => setIsOpen(false)}>Home</Link>
                    <Link to="/explore" style={styles.link} onClick={() => setIsOpen(false)}>หาบ้านให้น้องจร</Link>
                    <Link to="/community" style={styles.link} onClick={() => setIsOpen(false)}>Community</Link>
                    
                    {/* Actions inside mobile menu if open */}
                    {isOpen && (
                        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
                            <button style={styles.link} onClick={handleLoginClick}>Log in</button>
                            <button style={styles.btnPrimary}>Get Started</button>
                        </div>
                    )}
                </div>

                {/* Desktop Actions */}
                <div style={{...styles.links, display: window.innerWidth > 768 ? 'flex' : 'none'}}>
                    <button style={styles.link} onClick={onLoginClick}>Log in</button>
                    <button style={styles.btnPrimary}>Get Started</button>
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
