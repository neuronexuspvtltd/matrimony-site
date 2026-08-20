import { Router } from 'express';
import {
  getAdminStats,
  getAllUsers,
  toggleUserVerification,
  toggleUserStatus,
  getReports,
  updateReportStatus,
  sendSystemAnnouncement,
} from '../controllers/adminController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticateToken, requireAdmin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:userId/verify', toggleUserVerification);
router.put('/users/:userId/status', toggleUserStatus);
router.get('/reports', getReports);
router.put('/reports/:reportId/status', updateReportStatus);
router.post('/announcement', sendSystemAnnouncement);

export default router;
