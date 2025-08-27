const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = {
    ADMIN: 'admin',
    TEACHER: 'teacher',
    STUDENT: 'student'
};

const baseOptions = {
    discriminatorKey: 'role',
    timestamps: true
};

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true }
}, baseOptions);

UserSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.passwordHash);
};

const User = mongoose.model('User', UserSchema);

const TeacherSchema = new mongoose.Schema({
    faculty: { type: String, required: true },
    subject: { type: String, required: true }
}, baseOptions);

const StudentSchema = new mongoose.Schema({
    faculty: { type: String, required: true },
    batch: { type: String, required: true }
}, baseOptions);

const Teacher = User.discriminator(ROLES.TEACHER, TeacherSchema);
const Student = User.discriminator(ROLES.STUDENT, StudentSchema);

module.exports = { User, Teacher, Student, ROLES };

