import { Router } from 'express'
import { createRun, getRun } from '../controllers/runs.controller';
import { Server } from 'socket.io';

const router = Router();

let ioInstance: Server
export function setSocketServer(io: Server){
    ioInstance = io;
}

router.post('/', createRun);

router.get('/:id', getRun);

export default router;