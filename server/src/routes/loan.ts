import express from 'express';
import { 
  createLoanApplication, 
  getLoanApplications, 
  getLoanApplicationById,
  verifyLoanApplication, 
  rejectLoanApplication, 
  approveLoanApplication,
  getLoanStatistics,
  getUserLoanApplications
} from '../controllers/loanController';
import { authenticate, authorize } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = express.Router();

router.post('/', authenticate, createLoanApplication);
router.get('/', authenticate, getLoanApplications);
router.get('/user', authenticate, getUserLoanApplications);
router.get('/statistics', authenticate, getLoanStatistics);
router.get('/:id', authenticate, getLoanApplicationById);
router.put('/:id/verify', authenticate, authorize([Role.VERIFIER, Role.ADMIN]), verifyLoanApplication);
router.put('/:id/reject', authenticate, authorize([Role.VERIFIER, Role.ADMIN]), rejectLoanApplication);
router.put('/:id/approve', authenticate, authorize([Role.ADMIN]), approveLoanApplication);

export default router;