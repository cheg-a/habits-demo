import React, { useState } from 'react';
import { submitWeeklyReport } from '../services/api';
import '../App.css'; // Assuming styles from App.css are needed

// Helper function from DailyReportPage.jsx
function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

const WeeklyReportPage = ({ weekNum }) => {
  const questions = [
    { id: "weeklyGoal", title: "На этой неделе привычка предполагает следующую цель(или несколько)?" },
    { id: "successfulStrategies", title: "С чем вы успешно справились?" },
    { id: "difficulties", title: "Что для вас было трудным?" },
    { id: "influences", title: "Что влияло на вашу привычку на протяжении недели?" },
    { id: "changes", title: "Что хотели бы изменить на следующей неделе?" },
    { id: "copingStrategies", title: "Как вы справились с трудностями на пути к формированию привычки?" },
    { id: "nextWeekGoals", title: "На следующей неделе вы огласите такую цель(или несколько)." }
  ];

  // Состояние для хранения ответов пользователя
  const [answers, setAnswers] = useState({});

  // Обработчик изменения ответа пользователя
  const handleInputChange = (questionId, value) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: value
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Формируем объект для отправки на бэкенд
    const reportData = {
      weekNumber: weekNum,
      date: new Date().toISOString(),
      answers: answers
    };
    
    console.log('Отправка данных на сервер:', reportData);
    // Здесь будет вызов API для отправки данных на сервер
    submitWeeklyReport(reportData);
  };

  const today = formatDate(new Date());

  return (
    <div className="app-container">
      <form className="habit-journal" onSubmit={handleSubmit}>
        <div className="journal-header">
          <h1 className="journal-title">Еженедельный отчет #{weekNum || '?'}</h1>
          <div className="journal-date">{today}</div>
        </div>
        {questions.map((question) => (
          <div className="section" key={question.id}>
            <h2 className="section-title">{question.title}</h2>
            <textarea
              rows={3}
              placeholder="Ваш ответ..."
              value={answers[question.id] || ""}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
            />
          </div>
        ))}
        <div className="form-actions">
          <button type="submit" className="submit-button">Сохранить еженедельный отчет</button>
        </div>
      </form>
      <footer className="app-footer">
        <p>Дневник отслеживания привычек © 2025</p>
      </footer>
    </div>
  );
};

export default WeeklyReportPage;
