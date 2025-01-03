import { Router } from 'express';
import { userController } from '../controllers/userController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

/// POST /Account/Register -> Handles user registration
router.post('/Account/Register', asyncHandler(userController.Register));

/// POST /Account/Login -> Handles user login
router.post('/Account/Login', asyncHandler(userController.Login));

/// POST /Account/Update -> Handles user update
router.post('/Account/Update', asyncHandler(userController.Update));

export default router;
