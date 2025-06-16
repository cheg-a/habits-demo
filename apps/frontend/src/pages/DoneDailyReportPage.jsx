import React, { useState, useEffect } from 'react';
import { getDailyReportByDate } from '../services/api'; // Assuming you have a function to get a report by date
import { useParams, useNavigate } from 'react-router-dom';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';
import XMarkIcon from '../assets/icons/XMarkIcon';
import CalendarDaysIcon from '../components/icons/CalendarDaysIcon';
import NeonSpinner from '../components/NeonSpinner';
import { useTheme } from '../context/ThemeContext';
import FlagIcon from '../components/icons/FlagIcon';


// Helper function (can be moved to a utils file if used elsewhere)
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
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


const DoneDailyReportPage = ({ dailyReport: initialReport }) => {
  const [dailyReport, setDailyReport] = useState(initialReport);
  const [isLoading, setIsLoading] = useState(!initialReport);
  const [error, setError] = useState('');
  const { date: dateParam } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    if (!initialReport && dateParam) {
      const fetchReport = async () => {
        try {
          setIsLoading(true);
          const reportData = await getDailyReportByDate(dateParam);
          if (reportData) {
            setDailyReport(reportData);
          } else {
            setError('Отчет за эту дату не найден.');
          }
        } catch (err) {
          setError('Не удалось загрузить отчет.');
          console.error('Ошибка загрузки отчета:', err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchReport();
    } else if (!initialReport && !dateParam) {
        setError('Отчет не указан.');
        setIsLoading(false);
    }
  }, [initialReport, dateParam]);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-light-bg dark:bg-primary-dark text-primary-light-text dark:text-white flex flex-col items-center justify-center p-4 animate-fadeIn">
        <NeonSpinner size="w-16 h-16" color={theme === 'dark' ? 'text-accent-cyan' : 'text-accent-cyan-light'} />
        <p className="mt-4 text-lg">Загрузка отчета...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary-light-bg dark:bg-primary-dark text-primary-light-text dark:text-white flex flex-col items-center justify-center p-4 animate-fadeIn">
        <div className="card w-full max-w-lg p-6 text-center bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-accent-pink text-red-700 dark:text-red-400">
           <XMarkIcon className="w-12 h-12 mx-auto mb-3 text-red-500 dark:text-accent-pink"/>
          <h2 className="text-xl font-semibold mb-2">Ошибка</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="btn btn-primary mt-4">На главную</button>
        </div>
      </div>
    );
  }

  if (!dailyReport) {
    // This case might occur if navigated directly without data or param
    // Potentially redirect or show a message. For now, we'll show an error.
    return (
      <div className="min-h-screen bg-primary-light-bg dark:bg-primary-dark text-primary-light-text dark:text-white flex flex-col items-center justify-center p-4 animate-fadeIn">
        <div className="card w-full max-w-md p-6 text-center bg-gray-100 dark:bg-gray-700">
            <FlagIcon className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500"/>
            <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">Отчет не найден</h2>
            <p className="text-gray-500 dark:text-gray-400">Запрошенный отчет отсутствует.</p>
            <button onClick={() => navigate('/')} className="btn btn-primary mt-4">На главную</button>
        </div>
      </div>
    );
  }

	const {
		number,
		date,
		gratitude,
		goal,
		motivation,
		mood,
		influence,
		habits = [],
		createdAt
	} = dailyReport;

	const motivationObj = motivationLevels.find(m => m.value === motivation) || {};
	const moodObj = moodOptions.find(m => m.label === mood) || {};

	const formattedCreatedAt = createdAt ? new Date(createdAt).toLocaleString('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	}) : 'N/A';

	return (
    <div className="min-h-screen bg-primary-light-bg dark:bg-primary-dark text-primary-light-text dark:text-white p-4 md:p-8 flex flex-col items-center animate-fadeIn">
      <div className="card w-full max-w-2xl p-6 space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-accent-cyan-light dark:text-accent-cyan mb-1">День #{number}</h1>
          <div className="text-lg text-gray-500 dark:text-gray-400">{formatDate(date)}</div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="form-label mb-1 text-lg text-accent-fuchsia-light dark:text-accent-fuchsia">Сегодня вы благодарны за:</h2>
            <p className="p-3 rounded-md bg-gray-200 dark:bg-gray-700/50 text-gray-800 dark:text-gray-300 min-h-[40px]">{gratitude || 'Не указано'}</p>
          </div>

          <div>
            <h2 className="form-label mb-1 text-lg text-accent-fuchsia-light dark:text-accent-fuchsia">Цель сегодняшней привычки:</h2>
            <p className="p-3 rounded-md bg-gray-200 dark:bg-gray-700/50 text-gray-800 dark:text-gray-300 min-h-[40px]">{goal || 'Не указано'}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h2 className="form-label text-lg text-accent-fuchsia-light dark:text-accent-fuchsia">Проверка мотивации:</h2>
            <div className="flex items-center p-3 rounded-md bg-gray-200 dark:bg-gray-700/50 min-h-[40px]">
              {motivationObj.icon && <span className="text-2xl mr-2">{motivationObj.icon}</span>}
              <span className="text-gray-800 dark:text-gray-300">{motivationObj.label || 'Не указано'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="form-label text-lg text-accent-fuchsia-light dark:text-accent-fuchsia">Настроение:</h2>
            <div className="flex items-center p-3 rounded-md bg-gray-200 dark:bg-gray-700/50 min-h-[40px]">
              {moodObj.emoji && <span className="text-3xl mr-2">{moodObj.emoji}</span>}
              <span className="text-gray-800 dark:text-gray-300">{moodObj.label || 'Не указано'}</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="form-label mb-1 text-lg text-accent-fuchsia-light dark:text-accent-fuchsia">Что сегодня влияет на вашу привычку?</h2>
          <p className="p-3 rounded-md bg-gray-200 dark:bg-gray-700/50 text-gray-800 dark:text-gray-300 min-h-[40px]">{influence || 'Не указано'}</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-accent-cyan-light dark:text-accent-cyan">Ежедневный контроль</h2>
          {habits.length > 0 ? (
            <ul className="space-y-3">
              {habits.map((habit, i) => (
                <li key={i} className="p-3 rounded-md bg-gray-200 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600">
                  <p className="font-medium text-gray-800 dark:text-gray-200">{habit.text}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${habit.completed ? 'bg-green-200 text-green-800 dark:bg-green-600/50 dark:text-green-300' : 'bg-red-200 text-red-800 dark:bg-red-600/50 dark:text-red-300'}`}>
                      {habit.completed ? '✓ Выполнено' : '✘ Не выполнено'}
                    </span>
                    {habit.problem && (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-200 text-yellow-800 dark:bg-yellow-500/30 dark:text-yellow-300">
                        ⚠ Проблема
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">Привычки не были отмечены.</p>
          )}
        </div>

        <div className="text-center text-gray-600 dark:text-gray-500 text-sm mt-6">
          <p>Отчет создан: {formattedCreatedAt}</p>
        </div>
      </form>

      <footer className="mt-8 text-center text-sm text-gray-600 dark:text-gray-500">
        <p>Дневник отслеживания привычек © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default DoneDailyReportPage;
