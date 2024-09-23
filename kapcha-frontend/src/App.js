import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import GalleryPage from './pages/GalleryPage';
import SearchUser from './components/SearchUser';  // Import the SearchUser component

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/search" element={<SearchUser />} /> {/* Add the search route */}
            </Routes>
        </Router>
    );
};

export default App;
