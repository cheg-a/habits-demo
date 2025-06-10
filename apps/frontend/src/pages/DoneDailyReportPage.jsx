import React from 'react';
import '../App.css'; // Используем те же стили из App.css
import './DoneDailyReport.css'; // Импортируем наши специфичные стили

// Импортируем константы из DailyReportPage.jsx
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

const DoneDailyReportPage = ({ dailyReport }) => {
	// Получаем необходимые данные из отчета
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
	} = dailyReport || {};

	// Находим объект мотивации по значению
	const motivationObj = motivationLevels.find(m => m.value === motivation) || {};

	// Находим объект настроения по метке
	const moodObj = moodOptions.find(m => m.label === mood) || {};

	// Форматируем дату создания
	const formattedCreatedAt = new Date(createdAt).toLocaleString('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});

	return (
		<div className="app-container">
			<div className="habit-journal">
				<div className="journal-header">
					<h1 className="journal-title">День №{number} </h1>
					<div className="journal-date">{date}</div>
				</div>

				<div className="section">
					<h2 className="section-title">Сегодня вы благодарны за:</h2>
					<div className="readonly-field">{gratitude}</div>
				</div>

				<div className="section">
					<h2 className="section-title">Цель сегодняшней привычки:</h2>
					<div className="readonly-field">{goal}</div>
				</div>

				<div className="section">
					<h2 className="section-title">Проверка мотивации:</h2>
					<div className="readonly-motivation">
						{motivationObj.icon && <span className="motivation-icon">{motivationObj.icon}</span>}
						<span className="motivation-label">{motivationObj.label || 'Не указано'}</span>
					</div>
				</div>

				<div className="section">
					<h2 className="section-title">Настроение:</h2>
					<div className="readonly-mood">
						{moodObj.emoji && <span className="mood-emoji">{moodObj.emoji}</span>}
						<span className="mood-label">{moodObj.label || 'Не указано'}</span>
					</div>
				</div>

				<div className="section">
					<h2 className="section-title">Что сегодня влияет на вашу привычку?</h2>
					<div className="readonly-field">{influence}</div>
				</div>

				<div className="section habits-section">
					<div className="section-header">
						<h2 className="section-title">Ежедневный контроль</h2>
					</div>

					<div className="daily-control">
						{habits.map((habit, i) => (
							<div key={i} className="habit-item readonly">
								<div className="habit-text">
									{habit.text}
								</div>
								<div className="habit-status readonly">
									<div className={`status-label ${habit.completed ? 'completed' : ''}`}>
										{habit.completed ? '✓ Выполнено' : '✘ Не выполнено'}
									</div>
									{habit.problem && (
										<div className="status-label problem">
											⚠ Проблема
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="report-info">
					<p>Отчет создан: {formattedCreatedAt}</p>
				</div>
			</div>

			<footer className="app-footer">
				<p>Дневник отслеживания привычек © 2025</p>
			</footer>
		</div>
	);
};

export default DoneDailyReportPage;
