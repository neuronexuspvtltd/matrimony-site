import { Router } from 'express';
import { reportProfile, toggleBlockUser } from '../controllers/reportController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/report', authenticateToken, reportProfile);
router.post('/block', authenticateToken, toggleBlockUser);

export default router;
