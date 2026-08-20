import { Router } from 'express';
import { searchProfiles, getFeaturedProfiles } from '../controllers/searchController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Optional authentication so unauthenticated home visitors can view featured profiles,
// but logged-in users get match percentage calculation!
const optionalAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticateToken(req, res, next);
  }
  next();
};

router.get('/', optionalAuth, searchProfiles);
router.get('/featured', getFeaturedProfiles);

export default router;
