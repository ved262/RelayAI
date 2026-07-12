import { Router } from 'express'
import { createRun, getRunById, getRuns } from '../controllers/runs.controller';

const router = Router();

router.post('/', createRun);

router.get('/:id', getRunById);

router.get('/', getRuns);

export default router;