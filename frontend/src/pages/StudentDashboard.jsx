import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import ChatWidget from '../components/ChatWidget';

const tabs = ['Classes', 'Attendance', 'Notes', 'Exam schedule', 'Assignments', 'Timetable', 'Request leave'];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [active, setActive] = useState('Classes');
  const [classes, setClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [notes, setNotes] = useState([]);
  const [exams, setExams] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // load initial data
    load('classes');
    load('attendance');
    load('notes');
    load('exams');
    load('assignments');
    load('timetable');
  }, []);

  async function load(which) {
    try {
      if (which === 'classes') {
        const { data } = await api.get('/api/student/classes');
        setClasses(data);
      } else if (which === 'attendance') {
        const { data } = await api.get('/api/student/attendance');
        setAttendance(data);
      } else if (which === 'notes') {
        const { data } = await api.get('/api/student/notes');
        setNotes(data);
      } else if (which === 'exams') {
        const { data } = await api.get('/api/student/exams');
        setExams(data);
      } else if (which === 'assignments') {
        const { data } = await api.get('/api/student/assignments');
        setAssignments(data);
      } else if (which === 'timetable') {
        const { data } = await api.get('/api/student/timetable');
        setTimetable(data);
      }
    } catch (err) {
      // swallow errors per section
    }
  }

  async function submitAssignment(assignmentId, file) {
    if (!file) return;
    setUploading(true);
    setMessage('');
    setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      const { data } = await api.post(`/api/student/assignments/${assignmentId}/submit`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(`Submitted (id: ${data.id})`);
    } catch (err) {
      setError(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function requestLeave(e) {
    e.preventDefault();
    setMessage(''); setError('');
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      await api.post('/api/student/request-leave', payload);
      setMessage('Leave request sent');
      e.currentTarget.reset();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send');
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Student Dashboard</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActive(t)} disabled={active === t}>{t}</button>
        ))}
      </div>
      {message && <div style={{ color: 'green' }}>{message}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {active === 'Classes' && (
        <div>
          {classes.map(c => (
            <div key={c._id} style={{ padding: 12, border: '1px solid #ddd', marginBottom: 8 }}>
              <div><strong>{c.title}</strong></div>
              <div>{new Date(c.startAt).toLocaleString()} - {new Date(c.endAt).toLocaleString()}</div>
              <div>{c.description}</div>
            </div>
          ))}
          {classes.length === 0 && <div>No upcoming classes.</div>}
        </div>
      )}

      {active === 'Attendance' && (
        <div>
          {attendance.map(a => (
            <div key={a._id} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
              {new Date(a.date).toLocaleDateString()}: {a.status}
            </div>
          ))}
          {attendance.length === 0 && <div>No attendance records.</div>}
        </div>
      )}

      {active === 'Notes' && (
        <div>
          {notes.map(n => (
            <div key={n._id} style={{ padding: 12, border: '1px solid #ddd', marginBottom: 8 }}>
              <div><strong>{n.title}</strong></div>
              <div>{n.content}</div>
            </div>
          ))}
          {notes.length === 0 && <div>No notes.</div>}
        </div>
      )}

      {active === 'Exam schedule' && (
        <div>
          {exams.map(ex => (
            <div key={ex._id} style={{ padding: 12, border: '1px solid #ddd', marginBottom: 8 }}>
              <div><strong>{ex.subject}</strong> — {new Date(ex.date).toLocaleString()}</div>
              <div>{ex.venue}</div>
            </div>
          ))}
          {exams.length === 0 && <div>No upcoming exams.</div>}
        </div>
      )}

      {active === 'Assignments' && (
        <div>
          {assignments.map(asg => (
            <div key={asg._id} style={{ padding: 12, border: '1px solid #ddd', marginBottom: 8 }}>
              <div><strong>{asg.title}</strong> — due {new Date(asg.dueDate).toLocaleString()}</div>
              <div>{asg.description}</div>
              <div style={{ marginTop: 8 }}>
                <label>
                  Submit file:
                  <input type="file" onChange={(e) => submitAssignment(asg._id, e.target.files[0])} disabled={uploading} />
                </label>
              </div>
            </div>
          ))}
          {assignments.length === 0 && <div>No assignments.</div>}
        </div>
      )}

      {active === 'Timetable' && (
        <div>
          {timetable.map((t, i) => (
            <div key={t._id || i} style={{ padding: 12, border: '1px solid #ddd', marginBottom: 8 }}>
              <div><strong>{t.day}</strong></div>
              <ul>
                {(t.periods || []).map((p, idx) => (
                  <li key={idx}>{p.time} — {p.subject} {p.room ? `(${p.room})` : ''}</li>
                ))}
              </ul>
            </div>
          ))}
          {timetable.length === 0 && <div>No timetable.</div>}
        </div>
      )}

      {active === 'Request leave' && (
        <form onSubmit={requestLeave} style={{ maxWidth: 480 }}>
          <div style={{ marginBottom: 12 }}>
            <label>From date</label>
            <input type="date" name="fromDate" required style={{ width: '100%' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>To date</label>
            <input type="date" name="toDate" required style={{ width: '100%' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Reason</label>
            <textarea name="reason" required rows="3" style={{ width: '100%' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Send to (email)</label>
            <input type="email" name="toEmail" required style={{ width: '100%' }} />
          </div>
          <button type="submit">Send request</button>
        </form>
      )}
      <ChatWidget />
    </div>
  );
}
 
//

