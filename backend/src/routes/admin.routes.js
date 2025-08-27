const express = require('express');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const { authenticate, requireRole } = require('../middleware/auth');
const { Teacher, Student, ROLES } = require('../models/User');

const router = express.Router();

router.use(authenticate, requireRole(ROLES.ADMIN));

router.post('/create-teacher', asyncHandler(async (req, res) => {
    const { name, faculty, email, password, subject } = req.body;
    if (!name || !faculty || !email || !password || !subject) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const teacher = new Teacher({ name, faculty, email, passwordHash, subject });
    await teacher.save();
    res.status(201).json({ message: 'Teacher created', id: teacher._id });
}));

router.post('/create-student', asyncHandler(async (req, res) => {
    const { name, batch, faculty, email, password } = req.body;
    if (!name || !batch || !faculty || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const student = new Student({ name, batch, faculty, email, passwordHash });
    await student.save();
    res.status(201).json({ message: 'Student created', id: student._id });
}));

module.exports = router;

