import { useAuth } from '../context/AuthContext';
import ChatWidget from '../components/ChatWidget';

export default function TeacherDashboard() {
  const { user } = useAuth();
  return (
    <div style={{ padding: 24 }}>
      <h2>Teacher Dashboard</h2>
      <p>Welcome{user?.name ? `, ${user.name}` : ''}.</p>
      <p>Your role: teacher</p>
      <ChatWidget />
    </div>
  );
}

