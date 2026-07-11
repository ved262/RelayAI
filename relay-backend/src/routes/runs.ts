import { Router } from 'express'
import { createRun, getRun } from '../controllers/runs.controller';

const router = Router();

router.post('/', createRun);

router.get('/:id', getRun);

export default router;