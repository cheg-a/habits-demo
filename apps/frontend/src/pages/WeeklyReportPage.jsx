import React from 'react';
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
    "Какие главные достижения были на этой неделе в контексте ваших привычек?",
    "Какие препятствия возникли на пути к формированию привычек?",
    "Что вы узнали о себе и своих привычках за эту неделю?",
    "Какие стратегии были наиболее эффективными для поддержания привычек?",
    "Как вы себя чувствовали, следуя своим привычкам?",
    "Какие корректировки вы планируете внести в свои привычки на следующей неделе?",
    "Общая оценка вашей недели по шкале от 1 до 10 (где 10 - отлично)."
  ];

  const today = formatDate(new Date());

  return (
    <div className="app-container">
      <form className="habit-journal">
        <div className="journal-header">
          <h1 className="journal-title">Еженедельный отчет #{weekNum || '?'}</h1>
          <div className="journal-date">{today}</div>
        </div>
        {questions.map((question, index) => (
          <div className="section" key={index}>
            <h2 className="section-title">{question}</h2>
            <textarea
              rows={3}
              placeholder="Ваш ответ..."
            // onChange={(e) => handleInputChange(index, e.target.value)} // State handling will be added later
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
