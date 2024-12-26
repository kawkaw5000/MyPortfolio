import { Router } from 'express';
import { userController } from '../controllers/userController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/Account/Register', asyncHandler(userController.Register));
router.post('/Account/Login', asyncHandler(userController.Login));

export default router;
