import express from 'express';
import { 
  getUsers, 
  createAdmin, 
  createVerifier, 
  deleteUser,
  toastUser
} from '../controllers/userController';
import { authenticate, authorize } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = express.Router();

router.get('/', authenticate, authorize([Role.ADMIN]), getUsers);
router.get('/total', authenticate, authorize([Role.ADMIN]), toastUser);
router.post('/admin', authenticate, authorize([Role.ADMIN]), createAdmin);
router.post('/verifier', authenticate, authorize([Role.ADMIN]), createVerifier);
router.delete('/:id', authenticate, authorize([Role.ADMIN]), deleteUser);

export default router;