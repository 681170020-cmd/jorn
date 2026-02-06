import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import Home from "./pages/Home";
import Community from "./pages/Community";
import Explore from "./pages/Explore";

function App() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const toggleLogin = () => setIsLoginOpen(!isLoginOpen);

    return (
        <Router>
            <div style={{ backgroundColor: '#fdfaf6', minHeight: '100vh', position: 'relative' }}>
                <Navbar onLoginClick={toggleLogin} />
                
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/explore" element={<Explore />} />
                </Routes>

                <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
            </div>
        </Router>
    );
}

export default App;