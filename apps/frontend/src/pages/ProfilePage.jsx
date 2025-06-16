import React, { useEffect, useState } from 'react';
import { getMonthlyDailyReports, getProfileSummaryData } from '../services/api';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

// Neon Icons
import XMarkIcon from '../components/icons/XMarkIcon';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';
import HeartIcon from '../components/icons/HeartIcon';
import FlagIcon from '../components/icons/FlagIcon';
import UserIcon from '../components/icons/UserIcon';
import CalendarDaysIcon from '../components/icons/CalendarDaysIcon';
import NeonSpinner from '../components/NeonSpinner';

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const ProfileHeader = ({ userName }) => (
  <div className="flex items-center mb-8 p-6 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-lg">
    <div className="w-20 h-20 bg-accent-cyan-light dark:bg-accent-cyan rounded-full flex items-center justify-center mr-6 shadow-md ring-4 ring-accent-cyan-light/50 dark:ring-accent-cyan/50">
      <UserIcon className="w-10 h-10 text-primary-dark dark:text-primary-dark" /> {/* Icon color might need adjustment based on theme */}
    </div>
    <div>
      <h1 className="text-3xl font-bold text-primary-light-text dark:text-white">Мой профиль</h1>
      {userName && (
        <p className="text-lg text-gray-700 dark:text-gray-300">{userName}</p>
      )}
    </div>
  </div>
);

const Section = ({ title, icon, children, className }) => (
  <div className={`card mb-6 ${className}`}> {/* .card class handles its own light/dark theming */}
    <div className="flex items-center p-4 border-b border-card-light-border dark:border-gray-700">
      {icon && React.cloneElement(icon, { className: "w-6 h-6 mr-3 text-accent-cyan-light dark:text-accent-cyan" })}
      <h2 className="text-xl font-semibold text-accent-cyan-light dark:text-accent-cyan">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const CalendarDayDisplay = ({ date, isToday, hasReportForDay, isMissed }) => {
  let dayClasses = "aspect-square flex flex-col items-center justify-center rounded-lg relative font-medium text-sm transition-all duration-200 ease-in-out ";
  // Light theme defaults
  dayClasses += "bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600/70";

  if (isToday) {
    dayClasses = "aspect-square flex flex-col items-center justify-center rounded-lg relative font-medium text-sm transition-all duration-200 ease-in-out " +
                 "border-2 border-accent-fuchsia-light dark:border-accent-fuchsia bg-accent-fuchsia-light/20 dark:bg-accent-fuchsia/20 text-accent-fuchsia-light dark:text-white ring-2 ring-accent-fuchsia-light/50 dark:ring-accent-fuchsia/50";
  } else if (hasReportForDay) {
    dayClasses = "aspect-square flex flex-col items-center justify-center rounded-lg relative font-medium text-sm transition-all duration-200 ease-in-out " +
                 "bg-green-100 dark:bg-accent-cyan/20 text-green-700 dark:text-accent-cyan hover:bg-green-200 dark:hover:bg-accent-cyan/30";
  } else if (isMissed) {
    dayClasses = "aspect-square flex flex-col items-center justify-center rounded-lg relative font-medium text-sm transition-all duration-200 ease-in-out " +
                 "bg-red-100 dark:bg-accent-pink/20 text-red-700 dark:text-accent-pink hover:bg-red-200 dark:hover:bg-accent-pink/30";
  }

  const tooltipText = hasReportForDay
    ? "Отчет заполнен"
    : isMissed
      ? "Отчет пропущен"
      : isToday
        ? "Сегодня"
        : `Число: ${date.getDate()}`;

  return (
    <div title={tooltipText} className={dayClasses}>
      <span>{date.getDate()}</span>
      {hasReportForDay && (
        <CheckCircleIcon className="w-4 h-4 text-green-500 dark:text-accent-cyan absolute bottom-1 right-1 opacity-70" />
      )}
      {isMissed && (
        <XMarkIcon className="w-4 h-4 text-red-500 dark:text-accent-pink absolute bottom-1 right-1 opacity-70" />
      )}
    </div>
  );
};

const MonthlyCalendar = ({ monthlyReports }) => {
  const [currentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    // const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const days = [];
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    setCalendarDays(days);
  }, [currentDate]);
  
  const hasReport = (day) => {
    if (!monthlyReports || monthlyReports.length === 0) return false;
    return monthlyReports.some(report => parseInt(report.day, 10) === day);
  };
  
  let firstDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  firstDayOfWeek = (firstDayOfWeek === 0) ? 6 : firstDayOfWeek - 1;
  
  const monthName = currentDate.toLocaleString('ru-RU', { month: 'long' });
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  
  const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  const isDayToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  const isDayPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cellDate = new Date(date);
    cellDate.setHours(0,0,0,0);
    return cellDate < today;
  };

  return (
    <Section title={`${capitalizedMonth} ${currentDate.getFullYear()}`} icon={<CalendarDaysIcon />}>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day) => (
          <div key={day} className="text-center font-semibold text-xs text-gray-500 dark:text-gray-400 py-1">{day}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: firstDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square rounded-lg" />
        ))}
        
        {calendarDays.map((date) => {
          const isTodayFlag = isDayToday(date);
          const isPastFlag = isDayPast(date);
          const hasReportForDayFlag = hasReport(date.getDate());
          const isMissedFlag = isPastFlag && !isTodayFlag && !hasReportForDayFlag;
          
          return (
            <CalendarDayDisplay
              key={date.toISOString()}
              date={date}
              isToday={isTodayFlag}
              hasReportForDay={hasReportForDayFlag}
              isMissed={isMissedFlag}
            />
          );
        })}
      </div>

      <div className="mt-6 flex justify-center items-center gap-6 text-sm">
        <div className="flex items-center">
          <CheckCircleIcon className="w-5 h-5 text-green-500 dark:text-green-400 mr-2" />
          <span className="text-gray-700 dark:text-gray-300">Отчет заполнен</span>
        </div>
        <div className="flex items-center">
          <XMarkIcon className="w-5 h-5 text-red-500 dark:text-red-400 mr-2" />
          <span className="text-gray-700 dark:text-gray-300">Отчет пропущен</span>
        </div>
      </div>
    </Section>
  );
};

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [monthlyReports, setMonthlyReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme(); // Get current theme

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await getProfileSummaryData();
        setProfileData(data);
        
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        
        const reports = await getMonthlyDailyReports(month, year);
        setMonthlyReports(reports);
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
      <div className="min-h-screen bg-primary-light-bg dark:bg-primary-dark text-primary-light-text dark:text-white flex flex-col items-center justify-center p-4 animate-fadeIn">
        <NeonSpinner size="w-12 h-12" color={theme === 'dark' ? 'text-accent-cyan' : 'text-accent-cyan-light'} />
        <p className="mt-4 text-lg">Загрузка данных профиля...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary-light-bg dark:bg-primary-dark text-primary-light-text dark:text-white flex flex-col items-center justify-center p-4 animate-fadeIn">
        <div className="card w-full max-w-md p-6 text-center bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-accent-pink text-red-700 dark:text-red-400">
           <XMarkIcon className="w-12 h-12 mx-auto mb-3 text-red-500 dark:text-accent-pink"/>
          <h2 className="text-xl font-semibold mb-2">Ошибка загрузки</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-primary-light-bg dark:bg-primary-dark text-primary-light-text dark:text-white flex flex-col items-center justify-center p-4 animate-fadeIn">
         <div className="card w-full max-w-md p-6 text-center bg-gray-100 dark:bg-gray-700">
          <FlagIcon className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500"/>
          <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">Нет данных</h2>
          <p className="text-gray-500 dark:text-gray-400">Данные профиля не найдены.</p>
        </div>
      </div>
    );
  }

  const { questionnaireSummary, userName } = profileData;

  return (
    <div className="min-h-screen bg-primary-light-bg dark:bg-primary-dark text-primary-light-text dark:text-white p-4 md:p-8 animate-fadeIn">
      <ProfileHeader userName={userName} />

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6"> {/* Changed to 1 column for simplicity, can be adjusted */}
        <div>
          {questionnaireSummary ? (
            <Section title="Основная информация" icon={<FlagIcon />}>
              {questionnaireSummary.mainGoal && (
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-accent-fuchsia-light dark:text-accent-fuchsia mb-2">
                    Главная жизненная цель:
                  </h3>
                  <div className="p-4 rounded-md bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600">
                    <p className="text-gray-700 dark:text-gray-300">{questionnaireSummary.mainGoal}</p>
                  </div>
                </div>
              )}

              {questionnaireSummary.values && questionnaireSummary.values.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-accent-fuchsia-light dark:text-accent-fuchsia mb-2 flex items-center">
                    <HeartIcon className="w-5 h-5 mr-2 text-accent-pink-light dark:text-accent-pink" />
                    Мои ценности:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {questionnaireSummary.values.map((value, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm rounded-full bg-accent-cyan-light/20 text-accent-cyan-light border border-accent-cyan-light/50 dark:bg-accent-cyan/20 dark:text-accent-cyan dark:border-accent-cyan/50"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {questionnaireSummary.habitsToTrack && questionnaireSummary.habitsToTrack.length > 0 && (
                <div>
                  <h3 className="text-md font-semibold text-accent-fuchsia-light dark:text-accent-fuchsia mb-2">
                    Привычки в работе:
                  </h3>
                  <ul className="space-y-2">
                    {questionnaireSummary.habitsToTrack.map((habit, index) => (
                      <li key={index} className="flex items-center p-3 rounded-md bg-gray-100 dark:bg-gray-700/30 border border-gray-300 dark:border-gray-600">
                        <CheckCircleIcon className="w-5 h-5 mr-3 text-green-500 dark:text-green-400" />
                        <span className="text-gray-700 dark:text-gray-300">{habit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Section>
          ) : (
            <Section title="Основная информация" icon={<FlagIcon />}>
              <div className="text-center text-gray-500 dark:text-gray-400 p-4 bg-gray-100 dark:bg-gray-700/30 rounded-md">
                Данные анкеты не найдены или еще не заполнены.
              </div>
            </Section>
          )}
        </div>

        <div>
          <MonthlyCalendar monthlyReports={monthlyReports || []} /> {/* Ensure monthlyReports is an array */}
        </div>
      </div>

      <footer className="mt-8 pt-6 pb-2 text-center border-t border-gray-600 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-500">
        <p>Дневник отслеживания привычек © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default ProfilePage;
