const express = require('express');
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate, requireRole } = require('../middleware/auth');
const { ClassModel, Attendance, Note, Exam, Assignment, AssignmentSubmission, Timetable } = require('../models/Academic');
const { ROLES } = require('../models/User');
const { sendMail } = require('../utils/mailer');

const router = express.Router();
router.use(authenticate, requireRole(ROLES.STUDENT));

router.get('/classes', asyncHandler(async (req, res) => {
    const items = await ClassModel.find({ startAt: { $gte: new Date() } }).sort({ startAt: 1 }).limit(50);
    res.json(items);
}));

router.get('/attendance', asyncHandler(async (req, res) => {
    const items = await Attendance.find({ studentId: req.user.id }).sort({ date: -1 }).limit(200);
    res.json(items);
}));

router.get('/notes', asyncHandler(async (req, res) => {
    const items = await Note.find().sort({ createdAt: -1 }).limit(100);
    res.json(items);
}));

router.get('/exams', asyncHandler(async (req, res) => {
    const items = await Exam.find().sort({ date: 1 }).limit(100);
    res.json(items);
}));

router.get('/assignments', asyncHandler(async (req, res) => {
    const items = await Assignment.find().sort({ dueDate: 1 }).limit(100);
    res.json(items);
}));

// simple disk storage for demo; in production use cloud storage
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.post('/assignments/:assignmentId/submit', upload.single('file'), asyncHandler(async (req, res) => {
    const assignmentId = req.params.assignmentId;
    if (!req.file) return res.status(400).json({ message: 'File is required' });
    const submission = await AssignmentSubmission.create({
        assignmentId,
        studentId: req.user.id,
        fileUrl: `/uploads/${req.file.filename}`,
        originalName: req.file.originalname
    });
    res.status(201).json({ message: 'Submitted', id: submission._id });
}));

router.get('/timetable', asyncHandler(async (req, res) => {
    const items = await Timetable.find().sort({ createdAt: -1 }).limit(7);
    res.json(items);
}));

router.post('/request-leave', asyncHandler(async (req, res) => {
    const { fromDate, toDate, reason, toEmail } = req.body;
    if (!fromDate || !toDate || !reason || !toEmail) return res.status(400).json({ message: 'Missing fields' });
    const subject = `Leave request from student ${req.user.id}`;
    const text = `Leave request\nFrom: ${fromDate}\nTo: ${toDate}\nReason: ${reason}`;
    await sendMail({ to: toEmail, subject, text });
    res.json({ message: 'Leave request sent' });
}));

module.exports = router;

