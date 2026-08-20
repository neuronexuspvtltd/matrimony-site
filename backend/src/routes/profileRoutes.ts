import { Router } from 'express';
import {
  getMyProfile,
  getProfileById,
  updateMyProfile,
  uploadBiodataPdf,
  uploadPhoto,
  setPrimaryPhoto,
  deletePhoto,
  deleteBiodata,
} from '../controllers/profileController';
import { authenticateToken } from '../middleware/auth';
import { uploadPdf, uploadPhoto as uploadPhotoMiddleware } from '../middleware/upload';

const router = Router();

router.get('/me', authenticateToken, getMyProfile);
router.put('/me', authenticateToken, updateMyProfile);
router.post('/upload-biodata', authenticateToken, uploadPdf.single('biodata'), uploadBiodataPdf);
router.post('/upload-photo', authenticateToken, uploadPhotoMiddleware.single('photo'), uploadPhoto);
router.post('/set-primary-photo', authenticateToken, setPrimaryPhoto);
router.post('/delete-photo', authenticateToken, deletePhoto);
router.post('/delete-biodata', authenticateToken, deleteBiodata);

// View profile details (triggers view tracking)
router.get('/:id', authenticateToken, getProfileById);

export default router;
