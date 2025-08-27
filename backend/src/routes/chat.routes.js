const express = require('express');
const axios = require('axios');
const asyncHandler = require('express-async-handler');
const { authenticate } = require('../middleware/auth');
const { Assignment, ClassModel, Attendance } = require('../models/Academic');

const router = express.Router();
router.use(authenticate);

router.post('/', asyncHandler(async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'message is required' });

    // Gather minimal context for the user
    const userId = req.user.id;
    const [nextClass] = await ClassModel.find({ startAt: { $gte: new Date() } }).sort({ startAt: 1 }).limit(1);
    const dueAssignments = await Assignment.find({ dueDate: { $gte: new Date() } }).sort({ dueDate: 1 }).limit(5);
    const recentAttendance = await Attendance.find({ studentId: userId }).sort({ date: -1 }).limit(10);

    const context = {
        nextClass: nextClass ? { title: nextClass.title, startAt: nextClass.startAt } : null,
        assignmentsDue: dueAssignments.map(a => ({ title: a.title, dueDate: a.dueDate })),
        attendanceRecent: recentAttendance.map(a => ({ date: a.date, status: a.status }))
    };

    const prompt = `You are a helpful school assistant. User asks: "${message}". Use this context: ${JSON.stringify(context)}. Reply concisely.`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ message: 'Gemini API key not configured' });

    // Gemini generative language API (via PaLM-style endpoint)
    try {
        const { data } = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
            { contents: [{ parts: [{ text: prompt }] }] },
            { params: { key: apiKey } }
        );
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
        res.json({ text });
    } catch (err) {
        res.status(500).json({ message: 'Gemini request failed', detail: err?.response?.data || err.message });
    }
}));

module.exports = router;

