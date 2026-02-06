import { useState } from 'react';

const Login = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (!isOpen) return null;

    const colors = {
        overlay: 'rgba(61, 43, 31, 0.7)', // Deep Espresso transparent
        cardBg: '#ffffff',
        formBg: '#f0e9e4',
        primary: '#bfa693',
        textMain: '#5a4638',
        textSecondary: '#8d7b6d',
        white: '#ffffff',
    };

    const styles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: colors.overlay,
            backdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            padding: '1rem',
            animation: 'fadeIn 0.3s ease'
        },
        card: {
            width: '100%',
            maxWidth: '420px',
            backgroundColor: colors.cardBg,
            borderRadius: '40px',
            padding: '2.5rem 2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        },
        closeBtn: {
            position: 'absolute',
            top: '20px',
            right: '25px',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            color: colors.textSecondary,
            cursor: 'pointer',
            fontWeight: '300'
        },
        logoSection: {
            marginBottom: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem'
        },
        mascotCircle: {
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: `1.5px solid ${colors.textMain}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '8px'
        },
        title: {
            fontSize: '1.75rem',
            fontWeight: '800',
            color: colors.textMain,
            margin: 0
        },
        formContainer: {
            width: '100%',
            backgroundColor: colors.formBg,
            borderRadius: '30px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        },
        inputWrapper: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '0.4rem',
            width: '100%'
        },
        label: {
            fontSize: '0.75rem',
            color: colors.textSecondary,
            marginLeft: '0.8rem',
            fontWeight: '600'
        },
        input: {
            width: '100%',
            padding: '0.8rem 1.25rem',
            borderRadius: '15px',
            border: 'none',
            backgroundColor: colors.white,
            color: colors.textMain,
            fontSize: '0.95rem',
            outline: 'none',
        },
        button: {
            width: '100%',
            padding: '1rem',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: colors.primary,
            color: colors.white,
            fontSize: '0.95rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'pointer',
            marginTop: '0.5rem',
            boxShadow: '0 8px 15px rgba(191, 166, 147, 0.3)',
            transition: 'all 0.3s ease'
        },
        footerLink: {
            marginTop: '1.25rem',
            fontSize: '0.8rem',
            color: colors.textSecondary,
            textDecoration: 'none',
            fontWeight: '600'
        }
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.card} onClick={(e) => e.stopPropagation()}>
                <button style={styles.closeBtn} onClick={onClose}>✕</button>
                <div style={styles.logoSection}>
                    <div style={styles.mascotCircle}>
                        <svg viewBox="0 0 100 100" style={{width: '100%', height: '100%'}}>
                            <path d="M30 65 Q 40 40, 50 65" fill="none" stroke={colors.textMain} strokeWidth="1.5" />
                            <path d="M70 65 Q 60 40, 50 65" fill="none" stroke={colors.textMain} strokeWidth="1.5" />
                            <circle cx="40" cy="55" r="2" fill={colors.textMain} />
                            <circle cx="60" cy="55" r="2" fill={colors.textMain} />
                            <circle cx="50" cy="70" r="3" fill={colors.primary} />
                        </svg>
                    </div>
                    <h1 style={styles.title}>Login</h1>
                </div>

                <div style={styles.formContainer}>
                    <div style={styles.inputWrapper}>
                        <span style={styles.label}>Email</span>
                        <input 
                            type="email" 
                            style={styles.input} 
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div style={styles.inputWrapper}>
                        <span style={styles.label}>Password</span>
                        <input 
                            type="password" 
                            style={styles.input} 
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button style={styles.button}>Login</button>
                </div>

                <a href="#" style={styles.footerLink}>Forgot Password?</a>

                <style>
                    {`
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        @keyframes slideUp {
                            from { transform: translateY(30px); opacity: 0; }
                            to { transform: translateY(0); opacity: 1; }
                        }
                    `}
                </style>
            </div>
        </div>
    );
};

export default Login;
