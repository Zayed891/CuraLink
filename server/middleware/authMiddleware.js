import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import env from '../config/env.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'User does not exist' });
    }

    next();
  } catch (err) {
    console.error('[AuthMiddleware] Verify error:', err);
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }
};
