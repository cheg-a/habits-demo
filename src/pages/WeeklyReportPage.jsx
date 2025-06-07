import React from 'react';
import '../App.css'; // Assuming styles from App.css are needed

const WeeklyReportPage = () => {
  const questions = [
    "Какие главные достижения были на этой неделе в контексте ваших привычек?",
    "Какие препятствия возникли на пути к формированию привычек?",
    "Что вы узнали о себе и своих привычках за эту неделю?",
    "Какие стратегии были наиболее эффективными для поддержания привычек?",
    "Как вы себя чувствовали, следуя своим привычкам?",
    "Какие корректировки вы планируете внести в свои привычки на следующей неделе?",
    "Общая оценка вашей недели по шкале от 1 до 10 (где 10 - отлично)."
  ];

  return (
    <div className="app-container">
      <div className="journal-header">
        <h1 className="journal-title">Еженедельный отчет</h1>
      </div>
      <form className="habit-journal"> {/* Using habit-journal for consistent styling */}
        {questions.map((question, index) => (
          <div className="section" key={index}>
            <h2 className="section-title">{`Вопрос ${index + 1}:`}</h2>
            <p>{question}</p>
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
