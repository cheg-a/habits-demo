import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfileSummaryData } from '../services/api';
import '../App.css';

const ProgressBar = ({ value }) => (
  <div className="progress-bar-container">
    <div
      className="progress-bar"
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProfileSummaryData();
        setProfileData(data);
      } catch (err) {
        setError(err.message || "Не удалось загрузить данные профиля.");
        console.error("Ошибка при загрузке данных профиля:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка данных профиля...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container error-container">
        <p>Ошибка: {error}</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="app-container">
        <p>Данные профиля не найдены.</p>
      </div>
    );
  }

  const {
    questionnaireSummary,
    habitsProgress,
    moodSummary,
    lastDailyReport,
    lastWeeklyReport,
    userName,
  } = profileData;

  return (
    <div className="profile-page-container app-container">
      <header className="journal-header">
        <h1 className="journal-title">Мой профиль</h1>
        {userName && <p className="profile-username">Пользователь: {userName}</p>}
      </header>

      {questionnaireSummary ? (
        <section className="profile-section section">
          <h2 className="section-title">Основная информация (из анкеты)</h2>
          <div className="profile-info-grid">
            {questionnaireSummary.mainGoal && (
              <div>
                <strong>Главная жизненная цель:</strong>
                <p>{questionnaireSummary.mainGoal}</p>
              </div>
            )}
            {questionnaireSummary.values && questionnaireSummary.values.length > 0 && (
              <div>
                <strong>Мои ценности:</strong>
                <ul>
                  {questionnaireSummary.values.map((value, index) => (
                    <li key={index}>{value}</li>
                  ))}
                </ul>
              </div>
            )}
            {questionnaireSummary.habitsToTrack && questionnaireSummary.habitsToTrack.length > 0 && (
              <div>
                <strong>Привычки в работе:</strong>
                <ul>
                  {questionnaireSummary.habitsToTrack.map((habit, index) => (
                    <li key={index}>{habit}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="profile-section section">
          <h2 className="section-title">Основная информация (из анкеты)</h2>
          <p>Данные анкеты не найдены или еще не заполнены.</p>
        </section>
      )}

      {habitsProgress && habitsProgress.length > 0 ? (
        <section className="profile-section section">
          <h2 className="section-title">Прогресс по привычкам</h2>
          {habitsProgress.map((habit) => (
            <div key={habit.name} className="habit-progress-item">
              <div className="habit-progress-header">
                <span>{habit.name}: <strong>{habit.completionRate}%</strong></span>
                {/* Отображаем серию, если она больше 0 */}
                {habit.currentStreak > 0 && (
                  <span className="habit-streak">
                    🔥 Серия: {habit.currentStreak} {habit.currentStreak > 1 && habit.currentStreak < 5 ? 'дня' : 'дней'}
                  </span>
                )}
              </div>
              <ProgressBar value={habit.completionRate} />
            </div>
          ))}
        </section>
      ) : (
         <section className="profile-section section">
          <h2 className="section-title">Прогресс по привычкам</h2>
          <p>Нет данных для отображения прогресса по привычкам.</p>
        </section>
      )}

      {moodSummary && moodSummary.averageLastWeek !== null && moodSummary.averageLastWeek !== undefined ? (
        <section className="profile-section section">
          <h2 className="section-title">Сводка по настроению</h2>
          <p>Среднее настроение за последнюю неделю: <strong>{moodSummary.averageLastWeek} / 5</strong></p>
        </section>
      ) : (
        <section className="profile-section section">
          <h2 className="section-title">Сводка по настроению</h2>
          <p>Нет данных для отображения сводки по настроению.</p>
        </section>
      )}

      <section className="profile-section section">
        <h2 className="section-title">Последние отчеты</h2>
        <div className="profile-info-grid">
          {lastDailyReport && lastDailyReport.id ? (
            <div>
              <strong>Последний ежедневный отчет ({lastDailyReport.date || 'N/A'}):</strong>
              <p>Настроение: {lastDailyReport.mood || 'N/A'}</p>
            </div>
          ) : (
            <p>Ежедневные отчеты еще не заполнялись.</p>
          )}
          {lastWeeklyReport && lastWeeklyReport.id ? (
            <div>
              <strong>Последний еженедельный отчет (Неделя {lastWeeklyReport.weekNumber || 'N/A'}):</strong>
              <p>Ключевое достижение: {lastWeeklyReport.keyAchievement || 'N/A'}</p>
            </div>
          ) : (
            <p>Еженедельные отчеты еще не заполнялись.</p>
          )}
        </div>
      </section>

      <section className="profile-section section">
        <h2 className="section-title">Настройки</h2>
        <Link to="/update-password">Изменить пароль</Link>
      </section>

      <footer className="app-footer">
        <p>Дневник отслеживания привычек © 2025</p>
      </footer>
    </div>
  );
};

export default ProfilePage;
