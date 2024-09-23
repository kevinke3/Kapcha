import React, { useState, useEffect } from 'react';
import { getProfile } from '../services/api'; // Adjust the path

const Profile = () => {
    const [profile, setProfile] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token'); // Get token from localStorage
                const response = await getProfile(token);
                setProfile(response);
            } catch (err) {
                setError('Failed to fetch profile');
            }
        };

        fetchProfile();
    }, []);

    return (
        <div>
            <h2>User Profile</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {profile ? (
                <div>
                    <p><strong>Username:</strong> {profile.username}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    {/* Add other profile details here */}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Profile;
