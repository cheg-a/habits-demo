import React, { useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';
import DailyReportPage from './pages/DailyReportPage';
import LoginPage from './pages/LoginPage';
import WeeklyReportPage from './pages/WeeklyReportPage';
import QuestionnairePage from './pages/QuestionnairePage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default: not logged in
  
  const [needsQuestionnaire, setNeedsQuestionnaire] = useState(false); // Изменено: по умолчанию false, значение придет с сервера

  const handleLoginSuccess = (needQuestionnaire) => {
    setIsLoggedIn(true);
    setNeedsQuestionnaire(needQuestionnaire); // Устанавливаем значение, полученное с сервера
  };

  const handleQuestionnaireComplete = () => {
    setNeedsQuestionnaire(false);
  };

  return (
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
                  <li><Link to="/weekly-report">Еженедельный отчет</Link></li>
                  {/* We can add a logout button here later */}
                </ul>
              </nav>
              <div className="content-area">
                <Routes>
                  <Route path="/" element={<DailyReportPage />} />
                  <Route path="/weekly-report" element={<WeeklyReportPage />} />
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
  );
}

export default App;
