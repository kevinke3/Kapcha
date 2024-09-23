import React, { useState, useEffect } from 'react';
import { getImages } from '../services/api'; // Adjust the path

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await getImages(token);
                setImages(response.images);
            } catch (err) {
                setError('Failed to fetch images');
            }
        };

        fetchImages();
    }, []);

    return (
        <div>
            <h2>Image Gallery</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="image-grid">
                {images.length > 0 ? (
                    images.map((image, index) => (
                        <div key={index}>
                            <img src={image.url} alt={`Image ${index}`} />
                        </div>
                    ))
                ) : (
                    <p>No images found</p>
                )}
            </div>
        </div>
    );
};

export default Gallery;
