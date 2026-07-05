import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://locahost:3000'

export async function checkHealth(){
    const res = await axios.get(`${API_URL}/api/health`);
    return res.data;
}