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


    const toggleLogin = () => setIsLoginOpen(!isLoginOpen);
    
    const handleLoginSuccess = (userData) => {
        setUser(userData);
        setIsLoginOpen(false);
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
            </div>
        </Router>
    );
}

export default App;