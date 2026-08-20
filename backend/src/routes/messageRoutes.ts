import { Router } from 'express';
import { getConversations, getMessages, sendMessage } from '../controllers/messageController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/conversations', authenticateToken, getConversations);
router.get('/conversations/:conversationId', authenticateToken, getMessages);
router.post('/send', authenticateToken, sendMessage);

export default router;
