import React, { useState, useEffect } from 'react';
import { submitDailyReport } from '../services/api';
import { useNavigate } from 'react-router-dom';
import NeonSpinner from '../components/NeonSpinner';
import { useTheme } from '../context/ThemeContext';

// Helper function
function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
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
  { emoji: '😢', label: 'Плохо' },
  { emoji: '🙁', label: 'Грустно' },
  { emoji: '😐', label: 'Нейтрально' },
  { emoji: '🙂', label: 'Хорошо' },
  { emoji: '😃', label: 'Отлично' },
];

const DailyReportPage = () => {
  const [dailyReport, setDailyReport] = useState(null);
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
  const [submitError, setSubmitError] = useState('');
  const today = formatDate(new Date());
  const navigate = useNavigate();
  const { theme } = useTheme();

  const resetForm = () => {
    setMotivation(null);
    setMood(null);
    setGratitude('');
    setGoal('');
    setInfluence('');
    setHabits(Array(5).fill({ text: '', problem: false, completed: false }));
  };

  const handleHabitChange = (idx, field, value) => {
    setHabits((prevHabits) =>
      prevHabits.map((h, i) => (i === idx ? { ...h, [field]: value } : h))
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    const data = {
      gratitude,
      goal,
      motivation,
      mood: mood !== null ? moodOptions[mood]?.label : null,
      influence,
      habits: habits.filter(h => h.text.trim() !== ''),
    };

    if (data.habits.length === 0) {
      setSubmitError('Пожалуйста, добавьте хотя бы одну привычку для отчета.');
      setIsSubmitting(false);
      return;
    }
    if (!data.gratitude || !data.goal) {
      setSubmitError('Поля "Благодарность" и "Цель" обязательны.');
      setIsSubmitting(false);
      return;
    }

    try {
     const submittedData = await submitDailyReport(data);
      setSubmitted(true);
      setSubmitError('');
      setDailyReport(submittedData);
      setTimeout(() => {
        resetForm();
        setSubmitted(false);
        // Potentially navigate to DoneDailyReportPage if it's a separate view now
        // navigate(`/done-report/${submittedData.id}`); // Or however you identify the report
      }, 3000);
    } catch (error) {
      console.error('Ошибка при отправке ежедневного отчета:', error);
      setSubmitError(error.message || 'Не удалось сохранить отчет. Пожалуйста, попробуйте еще раз.');
      setSubmitted(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-light-bg dark:bg-primary-dark text-primary-light-text dark:text-white p-4 md:p-8 flex flex-col items-center animate-fadeIn">
      <form className="card w-full max-w-2xl p-6 space-y-6" onSubmit={handleSubmit}>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-accent-cyan-light dark:text-accent-cyan mb-1">Дневник привычек</h1>
          <div className="text-lg text-gray-600 dark:text-gray-400">{today}</div>
        </div>

        {/* Gratitude Section */}
        <div className="space-y-2">
          <label htmlFor="gratitude" className="form-label text-lg">Сегодня вы благодарны за:</label>
          <textarea
            id="gratitude"
            rows="3"
            value={gratitude}
            onChange={(e) => setGratitude(e.target.value)}
            placeholder="Напишите за что вы благодарны сегодня..."
            className="form-textarea"
          />
        </div>

        {/* Goal Section */}
        <div className="space-y-2">
          <label htmlFor="goal" className="form-label text-lg">Цель сегодняшней привычки:</label>
          <textarea
            id="goal"
            rows="3"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Опишите цель, которую хотите достичь..."
            className="form-textarea"
          />
        </div>

        {/* Motivation Section */}
        <div className="space-y-2">
          <h2 className="form-label text-lg">Проверка мотивации:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {motivationLevels.map((level) => (
              <label
                key={level.value}
                className={`p-3 rounded-md border cursor-pointer transition-all duration-150 flex items-center space-x-3 ${
                  motivation === level.value
                    ? 'bg-accent-cyan-light/20 dark:bg-accent-cyan/20 border-accent-cyan-light dark:border-accent-cyan ring-2 ring-accent-cyan-light dark:ring-accent-cyan'
                    : 'bg-gray-100 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600/70'
                }`}
              >
                <input
                  type="radio"
                  name="motivation"
                  value={level.value}
                  checked={motivation === level.value}
                  onChange={() => setMotivation(level.value)}
                  className="form-radio" // This class is now theme-aware
                />
                <span className="text-xl">{level.icon}</span>
                <span className="text-gray-700 dark:text-gray-200 text-sm">{level.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Mood Section */}
        <div className="space-y-2">
          <h2 className="form-label text-lg">Настроение:</h2>
          <div className="flex flex-wrap justify-around items-center p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg gap-2">
            {moodOptions.map((option, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-md cursor-pointer transition-all duration-150 text-center ${
                  mood === idx
                    ? 'bg-accent-fuchsia-light/30 dark:bg-accent-fuchsia/30 ring-2 ring-accent-fuchsia-light dark:ring-accent-fuchsia'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600/70'
                }`}
                onClick={() => setMood(idx)}
              >
                <span className="text-2xl">{option.emoji}</span>
                <p className={`text-xs mt-1 ${mood === idx ? 'text-accent-fuchsia-light dark:text-accent-fuchsia' : 'text-gray-500 dark:text-gray-400'}`}>{option.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Influence Section */}
        <div className="space-y-2">
          <label htmlFor="influence" className="form-label text-lg">Что сегодня влияет на вашу привычку?</label>
          <textarea
            id="influence"
            rows="3"
            value={influence}
            onChange={(e) => setInfluence(e.target.value)}
            placeholder="Ситуации, люди, эмоции, мысли и т.д."
            className="form-textarea"
          />
        </div>

        {/* Habits Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-accent-cyan-light dark:text-accent-cyan">Ежедневный контроль</h2>
            <button
              type="button"
              className="btn btn-secondary text-sm" // btn-secondary is theme-aware
              onClick={addHabit}
              disabled={habits.length >= 10}
            >
              + Добавить
            </button>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Определите свои привычки (например, "Сплю не менее 8 часов") и отметьте статус:
          </p>

          <div className="space-y-3">
            {habits.map((habit, i) => (
              <div key={i} className="p-4 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder={`Привычка ${i + 1}`}
                    value={habit.text}
                    onChange={(e) => handleHabitChange(i, 'text', e.target.value)}
                    className="form-input flex-grow" // form-input is theme-aware
                  />
                  {habits.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-destructive p-2 text-xs" // btn-destructive is theme-aware
                      onClick={() => removeHabit(i)}
                      aria-label="Удалить привычку"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {habit.text.trim() !== '' && (
                  <div className="flex space-x-4 mt-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={habit.completed}
                        onChange={(e) => handleHabitChange(i, 'completed', e.target.checked)}
                        className="form-checkbox" // form-checkbox is theme-aware
                      />
                      <span className="text-gray-700 dark:text-gray-300">Выполнено</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={habit.problem}
                        onChange={(e) => handleHabitChange(i, 'problem', e.target.checked)}
                        className="form-checkbox" // form-checkbox is theme-aware
                      />
                      <span className="text-gray-700 dark:text-gray-300">Проблема</span>
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>

          {habits.length >= 10 && (
            <p className="text-sm text-accent-pink-light dark:text-accent-pink text-center">
              Достигнут максимальный лимит привычек (10)
            </p>
          )}
        </div>

        {submitError && (
          <div className="form-error-message p-3 bg-red-100 dark:bg-red-700/30 text-red-700 dark:text-red-400 rounded-md text-sm text-center">
            {submitError}
          </div>
        )}
        {submitted && !submitError && (
            <div className="p-3 bg-green-100 dark:bg-green-700/30 text-green-700 dark:text-green-400 rounded-md text-sm text-center">
                Отчет успешно отправлен!
            </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            className={`w-full btn ${isSubmitting || (submitted && !submitError) ? 'btn-disabled' : 'btn-primary'} py-3 text-lg flex items-center justify-center`}
            disabled={isSubmitting || (submitted && !submitError)}
          >
            {isSubmitting ? (
              <>
                <NeonSpinner size="w-5 h-5" color={theme === 'dark' ? 'text-white' : 'text-primary-dark'} />
                <span className="ml-2">Отправка...</span>
              </>
            ) : (submitted && !submitError) ? 'Отправлено ✓' : 'Сохранить запись'}
          </button>
        </div>
      </form>

      <footer className="mt-8 text-center text-sm text-gray-600 dark:text-gray-500">
        <p>Дневник отслеживания привычек © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default DailyReportPage;
