import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";

import Community from "./pages/Community";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";


function App() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');


    const toggleLogin = () => setIsLoginOpen(!isLoginOpen);
    
    const handleLoginSuccess = (userData) => {
        setUser(userData);
        setIsLoginOpen(false);
        
        const message = userData.type === 'registration' ? 'Registration Successful' : 'Login Successful';
        setSuccessMsg(message);
        
        setTimeout(() => {
            setShowSuccessPopup(true);
            setTimeout(() => {
                setShowSuccessPopup(false);
            }, 1500);
        }, 100);
    };
    const [communityPosts, setCommunityPosts] = useState([
        {
            id: 1,
            author: 'คนรักหมา',
            handle: 'doglover',
            category: 'general',
            avatar: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=800',
            image: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=800',
            content: 'น้องหมาที่บ้านไม่ยอมกินข้าวมา 2 วันแล้ว มีใครพอจะแนะนำวิธีได้บ้างคะ? 🐕',
            likes: 5,
            liked: false,
            comments: [
                { 
                    id: 1, 
                    author: 'หมอเจ', 
                    text: 'ลองเปลี่ยนอาหารหรือพาไปหาหมอครับ อาจมีปัญหาสุขภาพ',
                    likes: 2,
                    liked: false,
                    replies: []
                }
            ],
            createdAt: "8/2/2569 01:10:05"
        },
        {
            id: 2,
            author: 'แมวส้ม',
            handle: 'orange_cat',
            category: 'knowledge',
            avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
            image: '',
            content: 'รู้หรือไม่? แมวสื่อสารกับเราผ่านการกระพริบตาช้าๆ ซึ่งหมายถึงการบอกรักนั่นเอง 🐱💕',
            likes: 12,
            liked: false,
            comments: [],
            createdAt: "8/2/2569 00:30:05"
        }
    ]);

    const [explorePosts, setExplorePosts] = useState([
        {
            id: 1,
            petName: 'Mochi (โมจิ)',
            petType: 'หมา',
            author: 'แม่นุ่น',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800',
            gender: 'หญิง',
            age: '3 เดือน',
            health: 'ฉีดวัคซีนแล้ว',
            location: 'กรุงเทพฯ',
            deliveryMethod: 'ไปส่งให้',
            petImage: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800',
            content: 'น้องโมจิเป็นลูกหมาพุดเดิ้ลผสมที่ถูกทิ้งไว้ข้างถนน น้องนิสัยเรียบร้อย ขี้อ้อน และเข้ากับเด็กได้ดีมากค่ะ อยากหาบ้านที่พร้อมดูแลน้องจริงๆ',
            likes: 24,
            liked: false,
            isAdopted: true,
            comments: [],
            adoptionRequests: [],
            createdAt: "8/2/2569 00:41:05"
        },
        {
            id: 2,
            petName: 'Tiger (ไทเกอร์)',
            petType: 'แมว',
            author: 'กอล์ฟ',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
            gender: 'ชาย',
            age: '1 ปี',
            health: 'ทำหมันแล้ว',
            location: 'นนทบุรี',
            deliveryMethod: 'นัดรับ',
            meetupPlace: 'เซ็นทรัล เวสต์เกต',
            petImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
            content: 'ไทเกอร์เป็นแมวส้มที่ฉลาดมาก ชอบเล่นกับเบ็ดตกแมว อยากได้คนที่มีเวลาเล่นกับน้อง และดูแลน้องในระบบปิดครับ',
            likes: 15,
            liked: false,
            isAdopted: false,
            comments: [],
            adoptionRequests: [],
            createdAt: "7/2/2569 23:41:05"
        }
    ]);

    const handleUpdateUser = (updatedDetails) => {
        setUser(prevUser => prevUser ? { ...prevUser, ...updatedDetails } : null);
    };

    const handleLogout = () => {
        setUser(null);
    };

    return (
        <Router>
            <div style={{ backgroundColor: '#fdfaf6', minHeight: '100vh', position: 'relative' }}>
                <Navbar onLoginClick={toggleLogin} user={user} onLogout={handleLogout} />
                
                <Routes>
                    <Route path="/" element={
                        <Explore 
                            user={user} 
                            onLoginClick={toggleLogin} 
                            posts={explorePosts}
                            setPosts={setExplorePosts}
                        />
                    } />
                    <Route path="/community" element={
                        <Community 
                            user={user} 
                            onLoginClick={toggleLogin} 
                            posts={communityPosts}
                            setPosts={setCommunityPosts}
                        />
                    } />
                    <Route path="/explore" element={
                        <Explore 
                            user={user} 
                            onLoginClick={toggleLogin} 
                            posts={explorePosts}
                            setPosts={setExplorePosts}
                        />
                    } />
                    <Route path="/profile" element={
                        <Profile 
                            user={user} 
                            onUpdateUser={handleUpdateUser} 
                            communityPosts={communityPosts}
                            explorePosts={explorePosts}
                        />
                    } />
                    <Route path="/chat" element={
                        <Chat 
                            user={user} 
                            onLoginClick={toggleLogin}
                        />
                    } />
                </Routes>

                {isLoginOpen && (
                    <Login 
                        isOpen={isLoginOpen} 
                        onClose={() => setIsLoginOpen(false)} 
                        onLoginSuccess={handleLoginSuccess}
                    />
                )}

                {showSuccessPopup && (
                    <div style={popupStyles.overlay}>
                        <div style={popupStyles.popup}>
                            <div style={popupStyles.icon}>✓</div>
                            <h2 style={popupStyles.text}>{successMsg}</h2>
                        </div>
                    </div>
                )}
                
                <style>
                    {`
                        @keyframes popIn {
                            from { transform: scale(0.8); opacity: 0; }
                            to { transform: scale(1); opacity: 1; }
                        }
                    `}
                </style>
            </div>
        </Router>
    );
}

const popupStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(61, 43, 31, 0.4)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3000,
    },
    popup: {
        backgroundColor: '#ffffff',
        padding: '2.5rem',
        borderRadius: '40px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        minWidth: '300px',
        animation: 'popIn 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28)'
    },
    icon: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#2ecc71',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '2rem',
    },
    text: {
        fontSize: '1.25rem',
        fontWeight: '800',
        color: '#5a4638',
        margin: 0
    }
};

export default App;