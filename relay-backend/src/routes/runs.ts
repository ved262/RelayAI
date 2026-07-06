import { Router } from 'express'
import { createRun } from '../controllers/runs.controller';

const router = Router();

router.post('/', createRun);

export default router;