import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Attach token on every request if present
api.interceptors.request.use((config) => {
    const user = localStorage.getItem('foodUser');
    if (user) {
        const { token } = JSON.parse(user);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;