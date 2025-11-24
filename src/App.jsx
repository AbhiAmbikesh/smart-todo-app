import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen bg-background dark:bg-dark-background text-primary">Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/" />} />

        <Route element={user ? <Layout /> : <Navigate to="/login" />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
