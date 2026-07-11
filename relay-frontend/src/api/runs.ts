import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function createRun(goal: string){
    const res = await axios.post(`${API_URL}/api/runs`, { goal });
    return res.data;
}

export async function getRun(id: string){
    const res = await axios.get(`${API_URL}/api/runs/${id}`);
    return res.data;
}