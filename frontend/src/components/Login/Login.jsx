import { useState } from 'react';

const EyeIcon = ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);


const Login = ({ isOpen, onClose, onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [birthDay, setBirthDay] = useState('');
    const [birthMonth, setBirthMonth] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    const getBirthMonthIndex = (monthName) => {
        return months.indexOf(monthName);
    };

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (isLogin) {
            if (!email.trim() || !password.trim()) {
                setErrorMsg('Please fill in all fields');
                return;
            }

            // เรียก API Login
            try {
                const response = await fetch('http://localhost:3000/api/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    const errorMessage = data.error?.message || data.message || 'Invalid email or password';
                    setErrorMsg(errorMessage);
                    return;
                }

                // บันทึก token ลง localStorage (ข้อมูลอยู่ใน payload)
                const { token, user } = data.payload || data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                onLoginSuccess({
                    name: user.username,
                    email: user.email,
                    type: 'login'
                });
            } catch (error) {
                setErrorMsg('Unable to connect to server');
                console.error('Login error:', error);
            }
        } else {
            if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || !phone.trim() || !location.trim() || !birthDay || !birthMonth || !birthYear) {
                setErrorMsg('Please fill in all fields');
                return;
            }
            if (password !== confirmPassword) {
                setErrorMsg('Passwords do not match');
                return;
            }
            
            // Password Validation
            if (password.length < 6) {
                setErrorMsg('Password must be at least 6 characters');
                return;
            }
            if (!/^[a-zA-Z0-9]+$/.test(password)) {
                setErrorMsg('Only letters and numbers are allowed (no emojis or symbols)');
                return;
            }
            if (!/[A-Z]/.test(password)) {
                setErrorMsg('Password must contain at least one uppercase letter');
                return;
            }

            // ตรวจสอบอายุ (ต้องมากกว่าหรือเท่ากับ 15 ปี)
            const birthMonthIndex = getBirthMonthIndex(birthMonth);
            const formattedMonth = String(birthMonthIndex + 1).padStart(2, '0');
            const formattedDay = String(birthDay).padStart(2, '0');
            const standardizedBirthday = `${birthYear}-${formattedMonth}-${formattedDay}`;

            const birthDate = new Date(parseInt(birthYear), birthMonthIndex, parseInt(birthDay));
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age < 18) {
                setErrorMsg('You must be at least 18 years old');
                return;
            }

            // Clean phone number (remove dashes, spaces, etc.)
            const cleanPhone = phone.replace(/\D/g, '');

            if (cleanPhone.length < 10) {
                setErrorMsg('Phone number is too short');
                return;
            }
            if (cleanPhone.length > 10) {
                setErrorMsg('Phone number is too long');
                return;
            }
            // เรียก API ไปที่ Backend
            try {
                const response = await fetch('http://localhost:3000/api/user/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: name,
                        email: email,
                        password: password,
                        phone: cleanPhone,
                        location: location,
                        birthday: standardizedBirthday
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    const errorMessage = data.error?.message || data.message || 'Error occurred during registration';
                    setErrorMsg(errorMessage);
                    return;
                }

                onLoginSuccess({
                    name: name,
                    email: email,
                    phone: cleanPhone,
                    location: location,
                    birthday: standardizedBirthday,
                    type: 'registration'
                });
            } catch (error) {
                setErrorMsg('Unable to connect to server');
                console.error('Register error:', error);
            }
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setErrorMsg('');
        setName('');
        setEmail('');
        setPhone('');
        setLocation('');
        setPassword('');
        setConfirmPassword('');
        setShowPassword(false);
        setShowConfirmPassword(false);
        setBirthDay('');
        setBirthMonth('');
        setBirthYear('');
    };

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
            maxHeight: '90vh',
            backgroundColor: colors.cardBg,
            borderRadius: '40px',
            padding: '2.5rem 2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            overflowY: 'auto',
            animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            scrollbarWidth: 'none', // Hide scrollbar for clean look
            msOverflowStyle: 'none'
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
        userName: {
            fontSize: '0.9rem',
            fontWeight: '600',
            color: colors.textMain
        },
        passwordContainer: {
            position: 'relative',
            width: '100%'
        },
        toggleIconState: {
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2rem',
            color: colors.textSecondary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            zIndex: 10
        }
    };

    return (
        <div style={styles.overlay} onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div style={styles.card}>
                <button
                    style={styles.closeBtn}
                    onClick={onClose}
                    type="button"
                >
                    ✕
                </button>

                <div style={styles.logoSection}>
                    <div style={styles.mascotCircle}>
                        <img src="/logo.png" alt="logo" style={{ width: '100%', height: '100%' }} />
                    </div>
                    <h1 style={styles.title}>JORN</h1>
                </div>

                <form style={styles.formContainer} onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <div style={styles.inputWrapper}>
                                <span style={styles.label}>Name</span>
                                <input
                                    type="text"
                                    style={styles.input}
                                    placeholder="Your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div style={styles.inputWrapper}>
                                <span style={styles.label}>Phone Number</span>
                                <input
                                    type="tel"
                                    style={styles.input}
                                    placeholder="0xx-xxx-xxxx"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                <span style={{ fontSize: '0.7rem', color: '#8d7b6d', marginLeft: '0.8rem', marginTop: '0.25rem', fontWeight: '500' }}>
                                    * Exactly 10 digits
                                </span>
                            </div>
                            <div style={styles.inputWrapper}>
                                <span style={styles.label}>Location</span>
                                <input
                                    type="text"
                                    style={styles.input}
                                    placeholder="Province/City"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                            <div style={styles.inputWrapper}>
                                <span style={styles.label}>Birthday</span>
                                <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                                    <select
                                        style={{ ...styles.input, padding: '0.8rem 0.5rem', flex: 1 }}
                                        value={birthDay}
                                        onChange={(e) => setBirthDay(e.target.value)}
                                    >
                                        <option value="">Day</option>
                                        {days.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <select
                                        style={{ ...styles.input, padding: '0.8rem 0.5rem', flex: 2 }}
                                        value={birthMonth}
                                        onChange={(e) => setBirthMonth(e.target.value)}
                                    >
                                        <option value="">Month</option>
                                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <select
                                        style={{ ...styles.input, padding: '0.8rem 0.5rem', flex: 1.5 }}
                                        value={birthYear}
                                        onChange={(e) => setBirthYear(e.target.value)}
                                    >
                                        <option value="">Year (A.D.)</option>
                                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <span style={{ fontSize: '0.7rem', color: '#8d7b6d', marginLeft: '0.8rem', marginTop: '0.3rem', fontWeight: '500' }}>
                                    * You must be at least 18 years old
                                </span>
                            </div>
                        </>
                    )}
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
                        <div style={styles.passwordContainer}>
                            <input
                                type={showPassword ? "text" : "password"}
                                style={{...styles.input, paddingRight: '40px'}}
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button 
                                type="button" 
                                style={styles.toggleIconState}
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                            >
                                {showPassword ? <EyeOffIcon color={colors.textSecondary} /> : <EyeIcon color={colors.textSecondary} />}
                            </button>
                        </div>
                        {!isLogin && (
                            <span style={{ fontSize: '0.7rem', color: '#8d7b6d', marginLeft: '0.8rem', marginTop: '0.2rem' }}>
                                * Minimum 6 characters with at least 1 uppercase letter (Alphanumeric only)
                            </span>
                        )}
                    </div>
                    {!isLogin && (
                        <div style={styles.inputWrapper}>
                            <span style={styles.label}>Confirm Password</span>
                            <div style={styles.passwordContainer}>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    style={{...styles.input, paddingRight: '40px'}}
                                    placeholder="********"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button 
                                    type="button" 
                                    style={styles.toggleIconState}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    tabIndex="-1"
                                >
                                    {showConfirmPassword ? <EyeOffIcon color={colors.textSecondary} /> : <EyeIcon color={colors.textSecondary} />}
                                </button>
                            </div>
                        </div>
                    )}
                    {errorMsg && (
                        <p style={{ color: '#e74c3c', fontSize: '0.85rem', fontWeight: '600', margin: '0.5rem 0' }}>
                            ⚠️ {errorMsg}
                        </p>
                    )}
                    <button type="submit" style={styles.button}>
                        {isLogin ? 'Login' : 'Create Account'}
                    </button>
                </form>

                <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {isLogin && <a href="#" style={{ textDecoration: 'none', color: colors.textSecondary, fontSize: '0.85rem' }}>Forgot Password?</a>}
                    <p style={{ fontSize: '0.85rem', color: colors.textSecondary, margin: 0 }}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span
                            style={{ color: colors.primary, cursor: 'pointer', borderBottom: `1px solid ${colors.primary}` }}
                            onClick={toggleMode}
                        >
                            {isLogin ? 'Sign Up' : 'Login'}
                        </span>
                    </p>
                </div>

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
