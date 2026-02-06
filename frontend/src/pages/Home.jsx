const Home = () => {
    // Earth Tone Colors
    const colors = {
        bg: '#fdfaf6',
        cardBg: '#ffffff',
        primary: '#8b5e3c',
        textMain: '#3d2b1f',
        textSecondary: '#8d7b6d',
        border: 'rgba(139, 94, 60, 0.15)',
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
            alignItems: 'center',
            justifyContent: 'flex-start'
        },
        hero: {
            textAlign: 'center',
            marginBottom: '4rem',
            width: '100%',
            maxWidth: '800px'
        },
        title: {
            fontSize: '3rem',
            fontWeight: '800',
            marginBottom: '1rem'
        },
        subtitle: {
            fontSize: '1.2rem',
            color: colors.textSecondary,
            maxWidth: '600px',
            margin: '0 auto 2rem'
        },
        feed: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
            maxWidth: '800px',
            margin: '0 auto'
        },
        card: {
            backgroundColor: colors.cardBg,
            borderRadius: '24px',
            border: `1px solid ${colors.border}`,
            width: '100%',
            maxWidth: '500px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            transition: 'transform 0.3s ease'
        },
        imageContainer: {
            width: '100%',
            height: '350px',
            backgroundColor: '#e8e1da',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
        },
        dogImage: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center' // This centers the face/center of the image
        },
        cardContent: {
            padding: '1.5rem',
            textAlign: 'left'
        },
        cardTitle: {
            fontSize: '1.5rem',
            fontWeight: '700',
            margin: '0 0 0.5rem',
            color: colors.textMain
        },
        cardTag: {
            display: 'inline-block',
            padding: '4px 12px',
            backgroundColor: 'rgba(139, 94, 60, 0.1)',
            color: colors.primary,
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: '1rem'
        },
        description: {
            fontSize: '0.95rem',
            color: colors.textSecondary,
            lineHeight: '1.5',
            margin: 0
        },
        btnAction: {
            marginTop: '1.5rem',
            width: '100%',
            padding: '0.8rem',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: colors.primary,
            color: 'white',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'background 0.2s'
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.hero}>
                <h1 style={styles.title}>ยินดีต้อนรับสู่ Jorn</h1>
                <p style={styles.subtitle}>
                    แพลตฟอร์มสำหรับหาบ้านให้น้องจร และแบ่งปันความรักให้กับเพื่อนสี่ขา
                </p>
                <button style={{
                    padding: '1rem 2rem',
                    borderRadius: '50px',
                    border: 'none',
                    backgroundColor: colors.primary,
                    color: 'white',
                    fontWeight: '700',
                    cursor: 'pointer'
                }}>ดูน้องๆ ทั้งหมด</button>
            </header>

            <main style={styles.feed}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem' }}>น้องๆ ที่กำลังรอคุณ</h2>
                
                {/* Dom's Card */}
                <div style={styles.card}>
                    <div style={styles.imageContainer}>
                        <img 
                            src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1074" 
                            alt="Dom the dog" 
                            style={styles.dogImage}
                        />
                    </div>
                    <div style={styles.cardContent}>
                        <div style={styles.cardTag}>รอคอยบ้านใหม่</div>
                        <h3 style={styles.cardTitle}>Dom (ดอม)</h3>
                        <p style={styles.description}>
                            ดอมเป็นสุนัขพันธุ์ทางนิสัยขี้เล่นและเข้ากับคนง่ายมาก 
                            เขาชอบการเดินเล่นในตอนเย็นและรอคอยเจ้าของที่ใจดีมาพาเขาไปอยู่บ้านใหม่
                        </p>
                        <button style={styles.btnAction}>ติดต่อขอรับเลี้ยง</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
