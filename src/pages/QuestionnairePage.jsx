import React, { useState } from 'react';
import '../App.css'; // Assuming styles from App.css are needed

const questionnaireSteps = [
  {
    title: "Добро пожаловать!",
    introText: "Этот опросник поможет вам лучше понять ваши текущие привычки и мотивацию. Пожалуйста, отвечайте честно и развернуто. Ваши ответы помогут вам сформировать более эффективные стратегии для достижения ваших целей. Нажмите 'Далее', чтобы начать.",
    placeholder: "Это поле не для ввода на первом шаге.",
    needsInput: false,
  },
  {
    title: "Осознание привычек",
    introText: "Опишите одну или две привычки, которые вы хотели бы развить или изменить. Почему эти привычки важны для вас?",
    placeholder: "Например: Хочу начать регулярно заниматься спортом, чтобы улучшить здоровье...",
    needsInput: true,
  },
  {
    title: "Мотивация и цели",
    introText: "Что мотивирует вас работать над этими привычками? Какие конкретные цели вы связываете с их успешным формированием?",
    placeholder: "Моя мотивация - чувствовать себя энергичнее. Цель - пробегать 5 км через 3 месяца...",
    needsInput: true,
  },
  {
    title: "Препятствия и вызовы",
    introText: "Какие потенциальные препятствия или вызовы вы видите на своем пути? Как вы могли бы их преодолеть?",
    placeholder: "Нехватка времени из-за работы. Могу попробовать заниматься утром...",
    needsInput: true,
  },
  {
    title: "Стратегии и поддержка",
    introText: "Какие стратегии вы планируете использовать для внедрения этих привычек? Нужна ли вам поддержка со стороны (друзья, семья, приложения)?",
    placeholder: "Буду использовать календарь для планирования. Расскажу другу о своих планах...",
    needsInput: true,
  },
  {
    title: "Завершение и настрой",
    introText: "Как вы будете отслеживать свой прогресс и вознаграждать себя за достижения? С каким настроем вы приступаете к этой работе над собой?",
    placeholder: "Буду вести дневник привычек. Настрой позитивный и решительный!",
    needsInput: true,
  }
];

const QuestionnairePage = ({ onQuestionnaireComplete }) => {
  const [currentStep, setCurrentStep] = useState(0); // Default to first step
  const [answers, setAnswers] = useState(Array(questionnaireSteps.length).fill(''));

  const handleAnswerChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleNextStep = () => {
    if (currentStep < questionnaireSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // This is the last step, call onQuestionnaireComplete
      if (onQuestionnaireComplete) {
        console.log("Questionnaire answers:", answers); // Optional: log answers
        onQuestionnaireComplete();
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = questionnaireSteps[currentStep];

  return (
    <div className="app-container">
      <div className="journal-header">
        <h1 className="journal-title">Анкета: Шаг {currentStep + 1} из {questionnaireSteps.length}</h1>
      </div>
      <div className="questionnaire-container habit-journal">
        <div className="section">
          <h2 className="section-title">{currentStepData.title}</h2>
          <p style={{ whiteSpace: 'pre-line', marginBottom: '1rem' }}>{currentStepData.introText}</p>
        </div>

        {currentStepData.needsInput && (
          <div className="section">
            <textarea
              rows={8} // Consistent large text input
              placeholder={currentStepData.placeholder}
              value={answers[currentStep]}
              onChange={handleAnswerChange}
              className="questionnaire-textarea" // Added class for specific styling if needed
            />
          </div>
        )}

        <div className="form-actions questionnaire-actions">
          {currentStep > 0 && (
            <button
              type="button"
              className="submit-button secondary-button" // Added secondary-button for different styling
              onClick={handlePreviousStep}
            >
              <span>⇐</span> Назад
            </button>
          )}
          <button
            type="button"
            className="submit-button"
            onClick={handleNextStep}
            // Disable next if it's an input step and answer is empty (optional)
            // disabled={currentStepData.needsInput && answers[currentStep].trim() === ''}
          >
            {currentStep === questionnaireSteps.length - 1 ? 'Завершить' : 'Далее'}
            {currentStep < questionnaireSteps.length - 1 && <span style={{ marginLeft: '5px' }}>➔</span>}
          </button>
        </div>
      </div>
      <footer className="app-footer">
        <p>Дневник отслеживания привычек © 2025</p>
      </footer>
    </div>
  );
};

export default QuestionnairePage;
