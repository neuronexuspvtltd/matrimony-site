import { Router } from 'express';
import { getMyProfileViews } from '../controllers/viewController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/recent', authenticateToken, getMyProfileViews);

export default router;
