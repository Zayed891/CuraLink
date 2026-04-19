import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import env from '../config/env.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }

    const user = await User.create({ name, email, password, role });

    const token = jwt.sign({ id: user._id }, env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) }
    });
  } catch (err) {
    console.error('[AuthController] register error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) }
    });
  } catch (err) {
    console.error('[AuthController] login error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) }
    });
  } catch (err) {
    console.error('[AuthController] getMe error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
