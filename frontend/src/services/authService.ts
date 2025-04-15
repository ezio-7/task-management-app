import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

// Register user
const register = async (userData: { username: string; password: string }) => {
    const response = await axios.post(API_URL + 'register', userData);

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
    }

    return response.data.data;
};

// Login user
const login = async (userData: { username: string; password: string }) => {
    const response = await axios.post(API_URL + 'login', userData);

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
    }

    return response.data.data;
};

// Logout user
const logout = () => {
    localStorage.removeItem('user');
};

const authService = {
    register,
    login,
    logout,
};

export default authService;