import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';

function App() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className={`min-h-screen ${isLandingPage ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50' : 'bg-slate-50'}`}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;