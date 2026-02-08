import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-backend-jpgi.onrender.com';

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

export default instance;
