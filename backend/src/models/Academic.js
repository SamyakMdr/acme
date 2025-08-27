const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true }
}, { timestamps: true });

const AttendanceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'late', 'excused'], required: true }
}, { timestamps: true });

const NoteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }
}, { timestamps: true });

const ExamSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    date: { type: Date, required: true },
    venue: String
}, { timestamps: true });

const AssignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    dueDate: { type: Date, required: true }
}, { timestamps: true });

const AssignmentSubmissionSchema = new mongoose.Schema({
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl: { type: String, required: true },
    originalName: String,
    submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const TimetableSchema = new mongoose.Schema({
    day: { type: String, required: true },
    periods: [{
        time: String,
        subject: String,
        room: String
    }]
}, { timestamps: true });

const ClassModel = mongoose.model('Class', ClassSchema);
const Attendance = mongoose.model('Attendance', AttendanceSchema);
const Note = mongoose.model('Note', NoteSchema);
const Exam = mongoose.model('Exam', ExamSchema);
const Assignment = mongoose.model('Assignment', AssignmentSchema);
const AssignmentSubmission = mongoose.model('AssignmentSubmission', AssignmentSubmissionSchema);
const Timetable = mongoose.model('Timetable', TimetableSchema);

module.exports = { ClassModel, Attendance, Note, Exam, Assignment, AssignmentSubmission, Timetable };

