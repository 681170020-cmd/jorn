import { useState } from 'react';

const Login = ({ isOpen, onClose, onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [birthDay, setBirthDay] = useState('');
    const [birthMonth, setBirthMonth] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (isLogin) {
            if (!email.trim() || !password.trim()) {
                setErrorMsg('กรุณากรอกข้อมูลให้ครบถ้วน');
                return;
            }

            // เรียก API Login
            try {
                const response = await fetch('https://jorn-ten.vercel.app//api/user/login', {
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
                    const errorMessage = data.error?.message || data.message || 'Email หรือรหัสผ่านไม่ถูกต้อง';
                    setErrorMsg(errorMessage);
                    return;
                }

                // บันทึก token ลง localStorage (ข้อมูลอยู่ใน payload)
                const { token, user } = data.payload || data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                onLoginSuccess({
                    name: user.username,
                    email: user.email
                });
            } catch (error) {
                setErrorMsg('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
                console.error('Login error:', error);
            }
        } else {
            if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || !phone.trim() || !location.trim() || !birthDay || !birthMonth || !birthYear) {
                setErrorMsg('กรุณากรอกข้อมูลให้ครบสมบูรณ์ทุกช่อง');
                return;
            }
            if (password !== confirmPassword) {
                setErrorMsg('รหัสผ่านไม่ตรงกัน');
                return;
            }
            if (password.length < 8) {
                setErrorMsg('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร');
                return;
            }

            // Clean phone number (remove dashes, spaces, etc.)
            const cleanPhone = phone.replace(/\D/g, '');

            if (cleanPhone.length < 10) {
                setErrorMsg('เบอร์โทรศัพท์ขาดกรุณาตรวจสอบอีกครั้ง');
                return;
            }
            if (cleanPhone.length > 10) {
                setErrorMsg('เบอร์โทรศัพท์เกินกรุณาตรวจสอบอีกครั้ง');
                return;
            }
            // เรียก API ไปที่ Backend
            try {
                const response = await fetch('https://jorn-ten.vercel.app//api/user/register', {
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
                        birthday: `${birthDay} ${birthMonth} ${birthYear}`
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    const errorMessage = data.error?.message || data.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก';
                    setErrorMsg(errorMessage);
                    return;
                }

                onLoginSuccess({
                    name: name,
                    email: email,
                    phone: cleanPhone,
                    location: location,
                    birthday: `${birthDay} ${birthMonth} ${birthYear}`
                });
            } catch (error) {
                setErrorMsg('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
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
                        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                            <path d="M30 65 Q 40 40, 50 65" fill="none" stroke={colors.textMain} strokeWidth="1.5" />
                            <path d="M70 65 Q 60 40, 50 65" fill="none" stroke={colors.textMain} strokeWidth="1.5" />
                            <circle cx="40" cy="55" r="2" fill={colors.textMain} />
                            <circle cx="60" cy="55" r="2" fill={colors.textMain} />
                            <circle cx="50" cy="70" r="3" fill={colors.primary} />
                        </svg>
                    </div>
                    <h1 style={styles.title}>{isLogin ? 'Login' : 'Sign Up'}</h1>
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
                                <span style={styles.label}>วันเกิด</span>
                                <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                                    <select
                                        style={{ ...styles.input, padding: '0.8rem 0.5rem', flex: 1 }}
                                        value={birthDay}
                                        onChange={(e) => setBirthDay(e.target.value)}
                                    >
                                        <option value="">วัน</option>
                                        {days.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <select
                                        style={{ ...styles.input, padding: '0.8rem 0.5rem', flex: 2 }}
                                        value={birthMonth}
                                        onChange={(e) => setBirthMonth(e.target.value)}
                                    >
                                        <option value="">เดือน</option>
                                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <select
                                        style={{ ...styles.input, padding: '0.8rem 0.5rem', flex: 1.5 }}
                                        value={birthYear}
                                        onChange={(e) => setBirthYear(e.target.value)}
                                    >
                                        <option value="">ปี (ค.ศ.)</option>
                                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
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
                        <input
                            type="password"
                            style={styles.input}
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {!isLogin && (
                        <div style={styles.inputWrapper}>
                            <span style={styles.label}>Confirm Password</span>
                            <input
                                type="password"
                                style={styles.input}
                                placeholder="********"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
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
                    {isLogin && <a href="#" style={styles.footerLink}>Forgot Password?</a>}
                    <p style={{ ...styles.footerLink, margin: 0 }}>
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
