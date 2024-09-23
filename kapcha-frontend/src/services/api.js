import axios from 'axios';

// Fetch Profile Data
export const getProfile = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get('/api/profile', config);
    return response.data;
};

// Upload Image
export const uploadImage = async (formData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    };
    const response = await axios.post('/api/upload-image', formData, config);
    return response.data;
};

// Fetch Images for Gallery
export const getImages = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get('/api/images', config);
    return response.data;
};

// Search Users by username or email
export const searchUser = async (query) => {
    const response = await axios.get(`/api/search?query=${query}`);
    return response.data;
};
