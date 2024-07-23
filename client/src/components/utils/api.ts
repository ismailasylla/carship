import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001', // Adjust the base URL as per your backend server configuration
});

export default api;
