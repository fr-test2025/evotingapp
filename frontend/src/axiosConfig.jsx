import axios from 'axios';

const axiosInstance = axios.create({

  baseURL: 'http://3.27.245.30:5001', // live
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
