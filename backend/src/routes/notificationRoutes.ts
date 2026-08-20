import { Router } from 'express';
import { getMyNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getMyNotifications);
router.put('/:notificationId/read', authenticateToken, markAsRead);
router.put('/read-all', authenticateToken, markAllAsRead);

export default router;
