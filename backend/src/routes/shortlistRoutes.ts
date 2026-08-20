import { Router } from 'express';
import { toggleShortlist, getMyShortlist } from '../controllers/shortlistController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/toggle', authenticateToken, toggleShortlist);
router.get('/my-shortlist', authenticateToken, getMyShortlist);

export default router;
