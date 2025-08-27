import { useAuth } from '../context/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  return (
    <div style={{ padding: 24 }}>
      <h2>Student Dashboard</h2>
      <p>Welcome{user?.name ? `, ${user.name}` : ''}.</p>
      <p>Your role: student</p>
    </div>
  );
}

