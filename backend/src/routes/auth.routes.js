const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { User, ROLES } = require('../models/User');

const router = express.Router();

router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, role: user.role, name: user.name, email: user.email });
}));

router.post('/seed-admin', asyncHandler(async (req, res) => {
    // One-time endpoint to create an initial admin if none exists
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'name, email, password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Admin already exists with this email' });

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = new User({ name, email, passwordHash, role: ROLES.ADMIN });
    await admin.save();
    res.status(201).json({ message: 'Admin created' });
}));

module.exports = router;

