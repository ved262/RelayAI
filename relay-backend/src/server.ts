import dotenv from "dotenv"
dotenv.config();

import express from "express"
import cors from "cors"
import runsRouter from "./routes/runs";
import { connectDB } from "./db";
import { Server } from "socket.io"
import { createServer } from "node:http";
import { setSocketServer } from "./controllers/runs.controller";

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

app.use('/api/runs', runsRouter)

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: process.env.FRONTEND_URL || "http://localhost:5173" }
})

io.on('connection',(socket)=>{
    socket.on('join:run', (runId: string)=>{
        socket.join(runId);
    })
})

setSocketServer(io);

const start = async() => {
    await connectDB();
    httpServer.listen(PORT, ()=>{
        console.log(`relay-backend is running on port ${PORT}`);
    });
}

start();