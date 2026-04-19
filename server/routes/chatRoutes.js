import express from 'express';
import { body } from 'express-validator';
import {
  createSession,
  sendMessage,
  getHistory,
  listSessions,
} from '../controllers/chatController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // protect all chat routes

router.post(
  '/session',
  [body('disease').notEmpty().withMessage('Disease/condition is required')],
  validateRequest,
  createSession
);

router.post(
  '/message',
  [
    body('sessionId').notEmpty().withMessage('sessionId is required'),
    body('message').notEmpty().withMessage('message cannot be empty'),
  ],
  validateRequest,
  sendMessage
);

router.get('/history/:sessionId', getHistory);
router.get('/sessions', listSessions);

export default router;
