import React, { useState } from 'react';
import './App.css';

function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

const motivationLevels = [
  { value: 1, label: 'Мне всё равно', icon: '😕' },
  { value: 2, label: 'Будет сложно', icon: '🤔' },
  { value: 3, label: 'Нет желания, но я сделаю', icon: '😐' },
  { value: 4, label: 'Я чувствую уверенность!', icon: '😊' },
  { value: 5, label: 'Я полон энергии!', icon: '🔥' },
];

const moodOptions = [
  { emoji: '😃', label: 'Отлично' },
  { emoji: '🙂', label: 'Хорошо' },
  { emoji: '😐', label: 'Нейтрально' },
  { emoji: '🙁', label: 'Грустно' },
  { emoji: '😢', label: 'Плохо' },
];

function App() {
  const [motivation, setMotivation] = useState(null);
  const [mood, setMood] = useState(null);
  const [gratitude, setGratitude] = useState('');
  const [goal, setGoal] = useState('');
  const [influence, setInfluence] = useState('');
  const [habits, setHabits] = useState(
    Array(5).fill({ text: '', problem: false, completed: false })
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const today = formatDate(new Date());

  const handleHabitChange = (idx, field, value) => {
    setHabits((habits) =>
      habits.map((h, i) => (i === idx ? { ...h, [field]: value } : h))
    );
  };

  const addHabit = () => {
    if (habits.length < 10) {
      setHabits([...habits, { text: '', problem: false, completed: false }]);
    }
  };

  const removeHabit = (idx) => {
    if (habits.length > 1) {
      setHabits(habits.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = {
      date: today,
      gratitude,
      goal,
      motivation,
      mood,
      influence,
      habits: habits.filter(h => h.text.trim() !== ''),
    };
    
    console.log('Данные формы:', data);
    
    // Имитация отправки данных на сервер
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Сброс формы через 2 секунды после успешной отправки
      setTimeout(() => {
        setSubmitted(false);
      }, 2000);
    }, 1000);
  };

  return (
    <div className="app-container">
      <form className="habit-journal" onSubmit={handleSubmit}>
        <div className="journal-header">
          <h1 className="journal-title">Дневник привычек</h1>
          <div className="journal-date">{today}</div>
        </div>
        
        <div className="section">
          <h2 className="section-title">Сегодня вы благодарны за:</h2>
          <textarea
            rows={2}
            value={gratitude}
            onChange={(e) => setGratitude(e.target.value)}
            placeholder="Напишите за что вы благодарны сегодня..."
          />
        </div>
        
        <div className="section">
          <h2 className="section-title">Цель сегодняшней привычки:</h2>
          <textarea
            rows={2}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Опишите цель, которую хотите достичь..."
          />
        </div>
        
        <div className="section">
          <h2 className="section-title">Проверка мотивации:</h2>
          <div className="motivation-options">
            {motivationLevels.map((level) => (
              <label 
                key={level.value}
                className={`motivation-option ${motivation === level.value ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="motivation"
                  checked={motivation === level.value}
                  onChange={() => setMotivation(level.value)}
                />
                <span className="motivation-icon">{level.icon}</span>
                <span className="motivation-label">{level.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="section">
          <h2 className="section-title">Настроение:</h2>
          <div className="mood-options">
            {moodOptions.map((option, idx) => (
              <div 
                key={idx} 
                className={`mood-option ${mood === idx ? 'selected' : ''}`}
                onClick={() => setMood(idx)}
              >
                <span className="mood-emoji">{option.emoji}</span>
                <span className="mood-label">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="section">
          <h2 className="section-title">Что сегодня влияет на вашу привычку?</h2>
          <textarea
            rows={2}
            value={influence}
            onChange={(e) => setInfluence(e.target.value)}
            placeholder="Ситуации, люди, эмоции, мысли и т.д."
          />
        </div>
        
        <div className="section habits-section">
          <div className="section-header">
            <h2 className="section-title">Ежедневный контроль</h2>
            <button 
              type="button" 
              className="add-habit-btn"
              onClick={addHabit}
              disabled={habits.length >= 10}
            >
              + Добавить
            </button>
          </div>
          
          <div className="habits-info">
            Определите свои привычки (например, "Сплю не менее 8 часов") и отметьте статус:
          </div>
          
          <div className="daily-control">
            {habits.map((habit, i) => (
              <div key={i} className="habit-item">
                <div className="habit-input-group">
                  <input
                    type="text"
                    placeholder={`Привычка ${i + 1}`}
                    value={habit.text}
                    onChange={(e) => handleHabitChange(i, 'text', e.target.value)}
                    className="habit-input"
                  />
                  
                  {habits.length > 1 && (
                    <button 
                      type="button" 
                      className="remove-habit-btn"
                      onClick={() => removeHabit(i)}
                      aria-label="Удалить привычку"
                    >
                      ✕
                    </button>
                  )}
                </div>
                
                {habit.text.trim() !== '' && (
                  <div className="habit-status">
                    <label className="status-option">
                      <input
                        type="checkbox"
                        checked={habit.completed}
                        onChange={(e) => handleHabitChange(i, 'completed', e.target.checked)}
                      />
                      <span>Выполнено</span>
                    </label>
                    
                    <label className="status-option problem">
                      <input
                        type="checkbox"
                        checked={habit.problem}
                        onChange={(e) => handleHabitChange(i, 'problem', e.target.checked)}
                      />
                      <span>Проблема</span>
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {habits.length >= 10 && (
            <div className="habits-limit-message">
              Достигнут максимальный лимит привычек (10)
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className={`submit-button ${isSubmitting ? 'submitting' : ''} ${submitted ? 'submitted' : ''}`}
            disabled={isSubmitting || submitted}
          >
            {isSubmitting ? 'Отправка...' : submitted ? 'Отправлено ✓' : 'Сохранить запись'}
          </button>
        </div>
      </form>
      
      <footer className="app-footer">
        <p>Дневник отслеживания привычек © 2025</p>
      </footer>
    </div>
  );
}

export default App;
