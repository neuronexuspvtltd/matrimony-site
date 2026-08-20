import { Router } from 'express';
import { sendInterest, respondInterest, getMyInterests } from '../controllers/interestController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/send', authenticateToken, sendInterest);
router.post('/respond', authenticateToken, respondInterest);
router.get('/my-interests', authenticateToken, getMyInterests);

export default router;
