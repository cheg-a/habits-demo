import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import './App.css';
import { logoutUser, checkSession } from './services/api'; // Добавляем импорт checkSession
import DailyReportPage from './pages/DailyReportPage';
import DoneDailyReportPage from './pages/DoneDailyReportPage'; // Импортируем новую страницу
import LoginPage from './pages/LoginPage';
import WeeklyReportPage from './pages/WeeklyReportPage';
import QuestionnairePage from './pages/QuestionnairePage';
import UpdatePasswordPage from './pages/UpdatePasswordPage'; // Импортируем страницу обновления пароля

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default: not logged in
  const [isLoading, setIsLoading] = useState(true); // Добавляем состояние загрузки
  const [needsQuestionnaire, setNeedsQuestionnaire] = useState(false); // Изменено: по умолчанию false, значение придет с сервера
  const [dailyReport, setDailyReport] = useState(null); // Добавляем состояние для хранения ежедневного отчета
  const [hasDefaultPassword, setHasDefaultPassword] = useState(false); // Добавляем состояние для проверки дефолтного пароля
  const navigate = useNavigate(); // Initialize useNavigate

  // Эффект для проверки активной сессии при загрузке страницы
  useEffect(() => {
    const verifySession = async () => {
      try {
        setIsLoading(true);
        const { isLoggedIn, needsQuestionnaire, dailyReport, hasDefaultPassword } = await checkSession();
        setIsLoggedIn(isLoggedIn);
        setNeedsQuestionnaire(needsQuestionnaire || false);
        setDailyReport(dailyReport); // Сохраняем dailyReport в состоянии
        setHasDefaultPassword(hasDefaultPassword || false); // Сохраняем состояние дефолтного пароля
      } catch (error) {
        console.error('Failed to verify session:', error);
        // При ошибке считаем, что пользователь не авторизован
        setIsLoggedIn(false);
        setNeedsQuestionnaire(false);
        setDailyReport(null);
        setHasDefaultPassword(false); // Сбрасываем состояние дефолтного пароля при ошибке
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const handleLoginSuccess = (needQuestionnaire, dailyReportData, isDefaultPassword) => {
    setIsLoggedIn(true);
    setNeedsQuestionnaire(needQuestionnaire); // Устанавливаем значение, полученное с сервера
    setDailyReport(dailyReportData); // Сохраняем dailyReport из успешного логина
    setHasDefaultPassword(isDefaultPassword || false); // Сохраняем статус дефолтного пароля
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsLoggedIn(false);
      setNeedsQuestionnaire(false); // Reset questionnaire state
      setDailyReport(null); // Сбрасываем dailyReport
      // Navigation to /login is handled by conditional rendering
      // but explicitly navigating might be desired in some SPA setups
      // navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally, show a user-facing error message
    }
  };

  const handleQuestionnaireComplete = () => {
    setNeedsQuestionnaire(false);
  };

  return (
    <>
      {isLoading ? (
        // Показываем индикатор загрузки, пока проверяем сессию
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка...</p>
        </div>
      ) : (
        <Routes>
          {!isLoggedIn ? (
            <>
              {/* Временно открыт доступ ко всем маршрутам без логина */}
              <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
              {/* <Route path="/" element={<DailyReportPage />} />
          <Route path="/weekly-report" element={<WeeklyReportPage />} />
          <Route path="/questionnaire" element={<QuestionnairePage onQuestionnaireComplete={handleQuestionnaireComplete} />} /> */}
              {/* Redirect any other path to /login if not logged in */}
              {/* Временно отключен редирект незалогиненных пользователей */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : hasDefaultPassword ? (
            <>
              <Route path="/update-password" element={<UpdatePasswordPage onPasswordUpdated={() => setHasDefaultPassword(false)} />} />
              {/* Redirect any other path to /update-password if password is default */}
              <Route path="*" element={<Navigate to="/update-password" replace />} />
            </>
          ) : needsQuestionnaire ? (
            <>
              <Route path="/questionnaire" element={<QuestionnairePage onQuestionnaireComplete={handleQuestionnaireComplete} />} />
              {/* Redirect any other path to /questionnaire if questionnaire is needed */}
              <Route path="*" element={<Navigate to="/questionnaire" replace />} />
            </>
          ) : (
            <>
              <Route path="*" element={
                <div className="main-app-layout">
                  <nav className="main-nav">
                    <ul>
                      <li><Link to="/">Ежедневный отчет</Link></li>
                      {dailyReport && dailyReport.reportNum % 7 === 0 && (
                        <li><Link to="/weekly-report">Еженедельный отчет</Link></li>
                      )}
                      <li><button onClick={handleLogout} className="logout-button">Выйти</button></li>
                    </ul>
                  </nav>
                  <div className="content-area">
                    <Routes>
                      <Route path="/" element={
                        dailyReport ?
                          <DoneDailyReportPage dailyReport={dailyReport} /> :
                          <DailyReportPage />
                      } />
                      {dailyReport && dailyReport.reportNum % 7 === 0 && (
                        <Route path="/weekly-report" element={
                          <WeeklyReportPage weekNum={dailyReport.reportNum / 7} />
                        } />
                      )}
                      {/* Optional: Redirect from /login or /questionnaire to / if user tries to access them again */}
                      <Route path="/login" element={<Navigate to="/" replace />} />
                      <Route path="/questionnaire" element={<Navigate to="/" replace />} />
                      {/* Fallback for any other route, could be a 404 page or redirect to / */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </div>
                </div>
              } />
            </>
          )}
        </Routes>
      )}
    </>
  );
}

export default App;
