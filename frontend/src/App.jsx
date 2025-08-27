import './App.css'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'

function Home() {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: 24 }}>
      <h2>MERN Starter</h2>
      {!user && <p><Link to="/login">Login</Link></p>}
      {user && (
        <div>
          <p>Signed in as {user.name} ({user.role})</p>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}

function App() {
  const secret = import.meta.env.VITE_ADMIN_SECRET || 'admin-portal-9b2f7c';
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path={`/${secret}`} element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
