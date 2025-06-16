import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { logoutUser, checkSession } from './services/api';
import DailyReportPage from './pages/DailyReportPage';
import DoneDailyReportPage from './pages/DoneDailyReportPage';
import LoginPage from './pages/LoginPage';
import WeeklyReportPage from './pages/WeeklyReportPage';
import QuestionnairePage from './pages/QuestionnairePage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import ProfilePage from './pages/ProfilePage';
import NeonSpinner from './components/NeonSpinner';
import { useTheme } from './context/ThemeContext'; // Import useTheme
import SunIcon from './components/icons/SunIcon'; // Corrected Path for SunIcon
import MoonIcon from './assets/icons/MoonIcon'; // Import MoonIcon

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [needsQuestionnaire, setNeedsQuestionnaire] = useState(false);
  const [dailyReport, setDailyReport] = useState(null);
  const [hasDefaultPassword, setHasDefaultPassword] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme(); // Use the theme context

  useEffect(() => {
    const verifySession = async () => {
      try {
        setIsLoading(true);
        const { isLoggedIn, needsQuestionnaire, dailyReport, hasDefaultPassword } = await checkSession();
        setIsLoggedIn(isLoggedIn);
        setNeedsQuestionnaire(needsQuestionnaire || false);
        setDailyReport(dailyReport);
        setHasDefaultPassword(hasDefaultPassword || false);
      } catch (error) {
        console.error('Failed to verify session:', error);
        setIsLoggedIn(false);
        setNeedsQuestionnaire(false);
        setDailyReport(null);
        setHasDefaultPassword(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const handleLoginSuccess = (needQuestionnaire, dailyReportData, isDefaultPassword) => {
    setIsLoggedIn(true);
    setNeedsQuestionnaire(needQuestionnaire);
    setDailyReport(dailyReportData);
    setHasDefaultPassword(isDefaultPassword || false);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsLoggedIn(false);
      setNeedsQuestionnaire(false);
      setDailyReport(null);
      navigate('/login'); // Explicitly navigate to login after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleQuestionnaireComplete = () => {
    setNeedsQuestionnaire(false);
    navigate('/'); // Navigate to home after questionnaire completion
  };

  const handlePasswordUpdated = () => {
    setHasDefaultPassword(false);
    // Potentially navigate to home or dashboard if not already there
    // This depends on the desired flow after password update.
    // For now, we assume checkSession will handle redirection if needed.
    // Or, if App.jsx re-renders, the routing logic will take over.
    // To be safe, we can add a navigate('/') here if the user is not already on a valid page.
    if (window.location.pathname === '/update-password') {
        navigate('/');
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-dark text-white flex flex-col items-center justify-center p-4">
        <NeonSpinner size="w-16 h-16" color="text-accent-cyan" />
        <p className="mt-4 text-xl">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className={`${theme}`}> {/* Apply theme class to the root div */}
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : hasDefaultPassword ? (
          <>
            <Route path="/update-password" element={<UpdatePasswordPage onPasswordUpdated={handlePasswordUpdated} />} />
            <Route path="*" element={<Navigate to="/update-password" replace />} />
          </>
        ) : needsQuestionnaire ? (
          <>
            <Route path="/questionnaire" element={<QuestionnairePage onQuestionnaireComplete={handleQuestionnaireComplete} />} />
            <Route path="*" element={<Navigate to="/questionnaire" replace />} />
          </>
        ) : (
          <>
            <Route path="*" element={
              <div className="min-h-screen bg-primary-light-bg dark:bg-primary-dark text-primary-light-text dark:text-white">
                <nav className="main-nav-bar">
                  <ul className="main-nav-list">
                    <li><NavLink to="/" className={({ isActive }) => isActive ? "main-nav-link main-nav-link-active" : "main-nav-link"}>Ежедневный отчет</NavLink></li>
                    {dailyReport && dailyReport.number % 7 === 0 && (
                      <li><NavLink to="/weekly-report" className={({ isActive }) => isActive ? "main-nav-link main-nav-link-active" : "main-nav-link"}>Еженедельный отчет</NavLink></li>
                    )}
                    <li><NavLink to="/profile" className={({ isActive }) => isActive ? "main-nav-link main-nav-link-active" : "main-nav-link"}>Мой профиль</NavLink></li>
                    <li><button onClick={handleLogout} className="btn btn-secondary">Выйти</button></li>
                    <li>
                      <button
                        onClick={toggleTheme}
                        className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-cyan-light dark:focus:ring-accent-cyan"
                        aria-label="Toggle theme"
                      >
                        {theme === 'light' ? (
                          <MoonIcon className="w-6 h-6 text-accent-fuchsia-light dark:text-accent-fuchsia" />
                        ) : (
                          <SunIcon className="w-6 h-6 text-yellow-400" /> // Using a standard Tailwind yellow for dark mode sun
                        )}
                      </button>
                    </li>
                  </ul>
                </nav>
                <div className="content-area p-4 animate-fadeIn">
                  <Routes>
                    <Route path="/" element={
                      dailyReport ?
                        <DoneDailyReportPage dailyReport={dailyReport} /> :
                        <DailyReportPage />
                    } />
                    {dailyReport && dailyReport.number % 7 === 0 && (
                      <Route path="/weekly-report" element={
                        <WeeklyReportPage weekNum={dailyReport.number / 7} />
                      } />
                    )}
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/login" element={<Navigate to="/" replace />} />
                    <Route path="/questionnaire" element={<Navigate to="/" replace />} />
                    <Route path="*" element={<Navigate to="/" replace />} /> {/* Fallback for authenticated users */}
                  </Routes>
                </div>
              </div>
            } />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
