import React, { useState } from 'react';
import { submitWeeklyReport } from '../services/api';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for potential redirection
import NeonSpinner from '../components/NeonSpinner'; // Assuming NeonSpinner might be used for submitting state
import { useTheme } from '../context/ThemeContext'; // Import useTheme

// Helper function (can be moved to a utils file if used elsewhere)
function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
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

  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const navigate = useNavigate();
  const { theme } = useTheme(); // Get current theme

  const handleInputChange = (questionId, value) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    const reportData = {
      weekNumber: weekNum,
      date: new Date().toISOString(),
      answers: questions.map(q => ({
        question: q.title,
        answer: answers[q.id] || ''
      }))
    };
    
    try {
      await submitWeeklyReport(reportData);
      setSubmitMessage('Еженедельный отчет успешно отправлен!');
      // Optionally reset form or navigate away
      // setAnswers({}); // Reset form
      setTimeout(() => {
        setSubmitMessage('');
        // navigate('/'); // Example: navigate to home after a delay
      }, 3000);
    } catch (error) {
      console.error('Ошибка при отправке еженедельного отчета:', error);
      setSubmitMessage(`Ошибка: ${error.response?.data?.message || error.message || 'Не удалось сохранить отчет.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = formatDate(new Date());

  return (
    <div className="min-h-screen bg-primary-light-bg dark:bg-primary-dark text-primary-light-text dark:text-white p-4 md:p-8 flex flex-col items-center animate-fadeIn">
      <form className="card w-full max-w-2xl p-6 md:p-8 space-y-6" onSubmit={handleSubmit}>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-accent-cyan-light dark:text-accent-cyan mb-1">Еженедельный отчет #{weekNum || '?'}</h1>
          <div className="text-lg text-gray-600 dark:text-gray-400">{today}</div>
        </div>

        {questions.map((question) => (
          <div key={question.id} className="space-y-2">
            <label htmlFor={question.id} className="form-label text-lg text-accent-fuchsia-light dark:text-accent-fuchsia">{question.title}</label>
            <textarea
              id={question.id}
              rows={4}
              placeholder="Ваш ответ..."
              value={answers[question.id] || ""}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              className="form-textarea" // This class is now theme-aware from components.css
            />
          </div>
        ))}

        {submitMessage && (
          <div className={`p-3 rounded-md text-sm text-center ${submitMessage.startsWith('Ошибка')
            ? 'bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-400'
            : 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-400'}`
          }>
            {submitMessage}
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            className={`w-full btn ${isSubmitting ? 'btn-disabled' : 'btn-primary'} py-3 text-lg flex items-center justify-center`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <NeonSpinner size="w-5 h-5" color={theme === 'dark' ? 'text-accent-cyan' : 'text-accent-cyan-light'} />
                <span className="ml-2">Отправка...</span>
              </>
            ) : (
              'Сохранить еженедельный отчет'
            )}
          </button>
        </div>
      </form>

      <footer className="mt-8 text-center text-sm text-gray-600 dark:text-gray-500">
        <p>Дневник отслеживания привычек © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default WeeklyReportPage;
