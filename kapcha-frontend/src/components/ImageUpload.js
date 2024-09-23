import React, { useState } from 'react';
import { uploadImage } from '../services/api'; // Adjust the path

const ImageUpload = () => {
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('image', image);
            const token = localStorage.getItem('token');
            await uploadImage(formData, token);
            setSuccess('Image uploaded successfully!');
            setError('');
        } catch (err) {
            setError('Failed to upload image');
            setSuccess('');
        }
    };

    return (
        <div>
            <h2>Upload Image</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleImageChange} required />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default ImageUpload;
