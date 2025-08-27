import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [teacher, setTeacher] = useState({ name: '', faculty: '', email: '', password: '', subject: '' });
  const [student, setStudent] = useState({ name: '', batch: '', faculty: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  async function createTeacher(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const { data } = await api.post('/api/admin/create-teacher', teacher);
      setMessage(`Teacher created (id: ${data.id})`);
      setTeacher({ name: '', faculty: '', email: '', password: '', subject: '' });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create teacher');
    }
  }

  async function createStudent(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const { data } = await api.post('/api/admin/create-student', student);
      setMessage(`Student created (id: ${data.id})`);
      setStudent({ name: '', batch: '', faculty: '', email: '', password: '' });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create student');
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, padding: 24 }}>
      <div>
        <h2>Create Teacher</h2>
        <form onSubmit={createTeacher}>
          <Field label="Name" value={teacher.name} onChange={v => setTeacher({ ...teacher, name: v })} />
          <Field label="Faculty" value={teacher.faculty} onChange={v => setTeacher({ ...teacher, faculty: v })} />
          <Field label="Email" type="email" value={teacher.email} onChange={v => setTeacher({ ...teacher, email: v })} />
          <Field label="Password" type="password" value={teacher.password} onChange={v => setTeacher({ ...teacher, password: v })} />
          <Field label="Subject" value={teacher.subject} onChange={v => setTeacher({ ...teacher, subject: v })} />
          <button type="submit">Create Teacher</button>
        </form>
      </div>
      <div>
        <h2>Create Student</h2>
        <form onSubmit={createStudent}>
          <Field label="Name" value={student.name} onChange={v => setStudent({ ...student, name: v })} />
          <Field label="Batch" value={student.batch} onChange={v => setStudent({ ...student, batch: v })} />
          <Field label="Faculty" value={student.faculty} onChange={v => setStudent({ ...student, faculty: v })} />
          <Field label="Email" type="email" value={student.email} onChange={v => setStudent({ ...student, email: v })} />
          <Field label="Password" type="password" value={student.password} onChange={v => setStudent({ ...student, password: v })} />
          <button type="submit">Create Student</button>
        </form>
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        {message && <div style={{ color: 'green' }}>{message}</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%' }} />
    </div>
  );
}

