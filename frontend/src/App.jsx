import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import Home from "./pages/Home";
import Community from "./pages/Community";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";


function App() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [user, setUser] = useState(null);


    const toggleLogin = () => setIsLoginOpen(!isLoginOpen);
    
    const handleLoginSuccess = (userData) => {
        setUser(userData);
        setIsLoginOpen(false);
    };

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
                    <Route path="/" element={<Home />} />
                    <Route path="/community" element={<Community user={user} onLoginClick={toggleLogin} />} />
                    <Route path="/explore" element={<Explore user={user} onLoginClick={toggleLogin} />} />
                    <Route path="/profile" element={<Profile user={user} onUpdateUser={handleUpdateUser} />} />
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