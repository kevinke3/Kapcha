import React from 'react';
import Profile from '../components/Profile';
import ImageUpload from '../components/ImageUpload';
import Gallery from '../components/Gallery';

const Dashboard = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <Profile />
            <ImageUpload />
            <Gallery />
        </div>
    );
};

export default Dashboard;
