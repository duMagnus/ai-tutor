import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import SubjectPage from './pages/SubjectPage';
import ParentDashboard from './pages/ParentDashboard';
import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { getUserInfo } from './utils/api';

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userInfo = await getUserInfo(currentUser.uid);
          setRole(userInfo.role);
        } catch (err) {
          setRole(null);
        }
      } else {
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? (role === 'parent' ? <ParentDashboard /> : <Dashboard />) : <LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/subject/:subjectName" element={<SubjectPage />} />
      </Routes>
    </Router>
  );
}

export default App;
