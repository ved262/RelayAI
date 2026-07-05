import express from "express"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: [ "GET", "POST"]
}));

app.use(express.json());

app.get('/api/health', (req, res)=>{
    res.json({status:'ok', service:'relay-backend'});
});

app.listen(PORT, ()=>{
    console.log(`relay-backend is running on port ${PORT}`);
});