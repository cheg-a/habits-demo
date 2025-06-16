import React, { useState, useEffect } from 'react';
import { submitQuestionnaire } from '../services/api'; // Import submitQuestionnaire
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

// Добавление списка жизненных сфер для оценки
const lifeAreas = [
  { id: 1, name: 'СЕМЕЙНЫЕ ОТНОШЕНИЯ' },
  { id: 2, name: 'ДРУЖБА' },
  { id: 3, name: 'РОМАНТИЧЕСКИЕ ОТНОШЕНИЯ' },
  { id: 4, name: 'РАБОТА / КАРЬЕРА' },
  { id: 5, name: 'ОБРАЗОВАНИЕ' },
  { id: 6, name: 'ЛИЧНОСТНОЕ РАЗВИТИЕ' },
  { id: 7, name: 'ОТДЫХ И ДОСУГ' },
  { id: 8, name: 'ДУХОВНОСТЬ ИЛИ РЕЛИГИЯ' },
  { id: 9, name: 'ПОМОЩЬ ОКРУЖАЮЩИМ' },
  { id: 10, name: 'ЗДОРОВЬЕ' }
];

const questionnaireSteps = [
  {
    id: "welcome",
    title: "Добро пожаловать!",
    introText: "Этот опросник поможет вам лучше понять ваши текущие привычки и мотивацию. Пожалуйста, отвечайте честно и развернуто. Ваши ответы помогут вам сформировать более эффективные стратегии для достижения ваших целей. Нажмите 'Далее', чтобы начать.",
    placeholder: "Это поле не для ввода на первом шаге.",
    needsInput: false,
  },
  {
    id: "self_analysis",
    title: "Самоанализ и жизненные приоритеты",
    introText: "Этот шаг поможет вам определить ваши приоритеты и направления для развития.",
    type: "combinedStep",
    needsInput: true,
    sections: [
      {
        title: `Ваши ценности отражают самое главное для вас в жизни, это основные принципы вашего существования. В идеале ваша жизнь и то, чему вы уделяете время, это отображение таковых ценностей. К сожалению, некоторые наши жизненные предпочтения не соответствуют этим ценностям. \n\nПоразмыслите над вопросом: какова ваша главнейшая в жизни цель? Какие черты вы хотите в себе развить?`,
        placeholder: "Опишите качества, которые вы хотели бы в себе развить...",
        fieldName: "qualities"
      },
      {
        title: "Пронумеруйте важность следующих сфер жизни от 1 (наиболее важная для вас) до 10 (совсем незначимая). Вам необходимо определить приоритет у всех сфер. Это непростое задание, своеобразный вызов себе. Вопросы к самим себе сейчас могут навернуть вас на неожиданное открытие в себе.",
        fieldName: "lifeAreas"
      },
      {
        title: "Теперь попробуйте обобщить итоги двух предыдущих упражнений и определить, что для вас наиболее важно",
        placeholder: "Исходя из оценки жизненных сфер и качеств для развития, что для вас наиболее важно...",
        fieldName: "summary"
      }
    ]
  },
  {
    id: "goal_setting",
    title: "Какую цель ставите перед собой?",
    introText: `Cледующим шагом на пути изменений привычек после осознания ценностей должно стать определение цели, многих намерений. \n\nЧего именно хотите достичь?`,
    placeholder: "Чего именно хотите достичь?",
    needsInput: true,
  },
  {
    id: "habits_analysis",
    title: "Анализ привычек",
    introText: `Ваши привычки -- это ежедневные действия, которые приближают вас к вашей цели или отдаляют от нее. Хорошо подумайте, какие привычки способствуют вашему развитию, а какие, наоборот, мешают.`,
    type: "combinedStep",
    needsInput: true,
    sections: [
      {
        title: "Какие текущие привычки мешают вам достигать целей?",
        placeholder: "Опишите привычки, которые вы хотели бы изменить...",
        fieldName: "habitsBad"
      },
      {
        title: "Какие новые полезные привычки вы хотите развивать?",
        placeholder: "Исходя из оценки жизненных сфер и качеств для развития, что для вас наиболее важно...",
        fieldName: "habitsGood"
      }
    ]
  },
  {
    id: "kvdrch_formulation",
    title: "Формулирование привычки по КВДРЧ",
    introText: "Чтобы повысить шансы на успех, убедитесь, что ваша привычка соответствует пяти критериям, которые сокращенно называют КВДРЧ. Опишите вашу привычку согласно каждому из критериев.",
    type: "combinedStepKVDRCH",
    needsInput: false,
    sections: [
      {
        title: "К - Конкретная",
        introText: "Ваши действия должны быть конкретными. Что именно вы хотите делать?",
        placeholder: "Например: «Читать книжки» — это слишком абстрактно, а «читать художественную литературу» — конкретнее.",
        fieldName: "konkretna"
      },
      {
        title: "В - Вимірювана (Измеримая)",
        introText: "Ваша цель должна быть измеримой. Как вы определите, выполнили вы её или нет?",
        placeholder: "Например: «Читай 15 минут в день» — измеримо, потому что можно определить, реализовали ли вы это.",
        fieldName: "vymiriuvana"
      },
      {
        title: "Д - Досяжна (Достижимая)",
        introText: "Ваша привычка должна быть немного сложнее того, что вы делаете сейчас, но достижимой.",
        placeholder: "Например: «Читать 15 минут три раза в неделю» — вполне достижимо.",
        fieldName: "dosyazhna"
      },
      {
        title: "Р - Релевантна (Значимая)",
        introText: "Ваша привычка должна быть важной именно для вас, а не для семьи, друзей или окружения.",
        placeholder: "Например: «Чтение важно для меня, потому что развивает уверенность в себе и соответствует моим ценностям — личностному развитию».",
        fieldName: "relevantna"
      },
      {
        title: "Ч - Часове визначення (Ограниченная по времени)",
        introText: "У вас должен быть четкий план внедрения привычки. Эта методика предполагает 12 недель на то, чтобы закрепить новую привычку.",
        placeholder: "Например: «Буду внедрять привычку чтения в течение 12 недель».",
        fieldName: "chasova"
      }
    ]
  },
  {
    id: "habits_impact",
    title: "Влияние привычек на жизнь",
    type: "combinedStep",
    needsInput: true,
    sections: [
      {
        title: "Теперь, когда вы определились с привычкой, от которой хотите избавиться,которую хотите изменить или улучшить, поразмыслите, как именно эта привычка поможет вам изменить жизнь так, чтобы она лучше соответствовала вашим ценностям. Какую ценность выбранная привычка добавит в вашу жизнь?",
        placeholder: "Опишите, какую ценность добавит выбранная привычка в вашу жизнь...",
        fieldName: "newValue"
      },
      {
        title: "Останеться ли она для вас актуальной через пару лет? Какие намерения и ценности из тех, которым соответствует привычка, будут актуальны для вас в будущем?",
        placeholder: "Исходя из оценки жизненных сфер и качеств для развития, что для вас наиболее важно...",
        fieldName: "habitFuture"
      }
    ]
  }
];

const QuestionnairePage = ({ onQuestionnaireComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [lifeAreaRatings, setLifeAreaRatings] = useState(
    lifeAreas.reduce((acc, area) => {
      acc[area.id] = '';
      return acc;
    }, {})
  );
  const [combinedStepAnswers, setCombinedStepAnswers] = useState({
    qualities: '',
    summary: '',
    habitsBad: '',
    habitsGood: '',
    discipline: '',
    smallChange: '',
    konkretna: '',
    vymiriuvana: '',
    dosyazhna: '',
    relevantna: '',
    chasova: '',
    newValue: '',
    habitFuture: ''
  });
  const [hasUniqueRatings, setHasUniqueRatings] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  const handleAnswerChange = (e) => {
    const currentStepId = questionnaireSteps[currentStep].id;
    setAnswers(prev => ({
      ...prev,
      [currentStepId]: e.target.value
    }));
  };

  const handleCombinedStepChange = (fieldName, value) => {
    setCombinedStepAnswers(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleRatingChange = (areaId, value) => {
    let numValue = parseInt(value);
    if (isNaN(numValue) || value === '') {
      setLifeAreaRatings(prev => ({ ...prev, [areaId]: '' }));
      return;
    }
    numValue = Math.max(1, Math.min(10, numValue));
    setLifeAreaRatings(prev => {
      const newRatings = { ...prev, [areaId]: numValue };
      const values = Object.values(newRatings).filter(val => val !== '');
      const uniqueValues = new Set(values);
      setHasUniqueRatings(values.length === uniqueValues.size);
      return newRatings;
    });
  };

  const isStepComplete = () => {
    const currentStepData = questionnaireSteps[currentStep];
    if (currentStepData.needsInput && !currentStepData.type?.startsWith("combinedStep")) {
      return answers[currentStepData.id] && answers[currentStepData.id].trim() !== '';
    }
    if (currentStepData.type === "combinedStepKVDRCH") {
      return currentStepData.sections.every(section => combinedStepAnswers[section.fieldName].trim() !== '');
    }
    if (currentStepData.type === "combinedStep") {
      if (currentStepData.sections.some(s => s.fieldName === "lifeAreas")) {
        return currentStepData.sections.every(section => {
          if (section.fieldName === "lifeAreas") return isLifeAreasStepComplete();
          return combinedStepAnswers[section.fieldName]?.trim() !== '';
        });
      }
      return currentStepData.sections.every(section => combinedStepAnswers[section.fieldName]?.trim() !== '');
    }
    return true; // For steps like "welcome"
  };

  const isLifeAreasStepComplete = () => {
    const values = Object.values(lifeAreaRatings);
    const filledValues = values.filter(val => val !== '');
    if (filledValues.length !== lifeAreas.length) return false; // All areas must be rated
    const uniqueValues = new Set(filledValues);
    return filledValues.length === uniqueValues.size; // All ratings must be unique
  };

  const handleNextStep = async () => {
    const currentStepData = questionnaireSteps[currentStep];
    if (currentStepData.needsInput && !isStepComplete()) {
        if (currentStepData.sections?.some(s => s.fieldName === "lifeAreas") && !hasUniqueRatings) {
             alert('Пожалуйста, присвойте уникальную оценку для каждой сферы жизни.');
        } else {
            alert('Пожалуйста, заполните все поля этого шага.');
        }
      return;
    }

    if (currentStep < questionnaireSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsSubmitting(true);
      setSubmitError('');
      const formData = { ...answers };
      formData.self_analysis = {
        qualities: combinedStepAnswers.qualities,
        lifeAreaRatings,
        summary: combinedStepAnswers.summary
      };
      formData.habits_analysis = {
        habitsBad: combinedStepAnswers.habitsBad,
        habitsGood: combinedStepAnswers.habitsGood
      };
      formData.start_small = { // Assuming 'start_small' was intended for discipline/smallChange
        discipline: combinedStepAnswers.discipline,
        smallChange: combinedStepAnswers.smallChange
      };
      formData.habits_impact = {
        newValue: combinedStepAnswers.newValue,
        habitFuture: combinedStepAnswers.habitFuture
      };
      formData.kvdrch_formulation = {
        konkretna: combinedStepAnswers.konkretna,
        vymiriuvana: combinedStepAnswers.vymiriuvana,
        dosyazhna: combinedStepAnswers.dosyazhna,
        relevantna: combinedStepAnswers.relevantna,
        chasova: combinedStepAnswers.chasova
      };

      const { welcome, ...payload } = formData;
      try {
        await submitQuestionnaire(payload);
        if (onQuestionnaireComplete) {
          onQuestionnaireComplete();
        }
        navigate('/'); // Redirect to home or dashboard after completion
      } catch (error) {
        console.error("Failed to submit questionnaire:", error);
        setSubmitError(error.message || "Не удалось отправить анкету. Пожалуйста, попробуйте еще раз.");
      } finally {
        setIsSubmitting(false);
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
    <div className="min-h-screen bg-primary-dark text-white p-4 md:p-8 flex flex-col items-center">
      <div className="card w-full max-w-2xl p-6 space-y-6"> {/* Adjusted max-width for better form layout */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-accent-cyan">Анкета: Шаг {currentStep + 1} из {questionnaireSteps.length}</h1>
        </div>

        <div className="mb-6 p-4 bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-accent-cyan mb-3">{currentStepData.title}</h2>
          <p className="text-gray-300 whitespace-pre-line">{currentStepData.introText}</p>
        </div>

        {currentStepData.needsInput && !currentStepData.type?.startsWith("combinedStep") && (
          <div className="space-y-2">
            <textarea
              rows={8}
              placeholder={currentStepData.placeholder}
              value={answers[currentStepData.id] || ''}
              onChange={handleAnswerChange}
              className="form-textarea"
            />
          </div>
        )}

        {currentStepData.type === "combinedStepKVDRCH" && (
          <div className="space-y-6">
            {currentStepData.sections.map((section, index) => (
              <div key={index} className="p-4 bg-gray-800 rounded-lg shadow">
                <h3 className="form-label mb-2">{section.title}</h3>
                {section.introText && (
                  <p className="text-sm text-gray-400 mb-2">{section.introText}</p>
                )}
                <textarea
                  rows={3}
                  placeholder={section.placeholder}
                  value={combinedStepAnswers[section.fieldName]}
                  onChange={(e) => handleCombinedStepChange(section.fieldName, e.target.value)}
                  className="form-textarea border-accent-cyan/50 focus:border-accent-cyan"
                />
              </div>
            ))}
          </div>
        )}

        {currentStepData.type === "combinedStep" && (
          <div className="space-y-6">
            {currentStepData.sections.map((section, index) => (
              <div key={index} className="p-4 bg-gray-800 rounded-lg shadow">
                <h3 className="form-label mb-2">{section.title}</h3>
                {section.introText && (
                  <p className="text-sm text-gray-400 mb-2 whitespace-pre-line">{section.introText}</p>
                )}
                {section.fieldName === "lifeAreas" ? (
                  <div>
                    <div className="space-y-3">
                      {lifeAreas.map((area) => (
                        <div key={area.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-md">
                          <span className="text-gray-200">{area.name}</span>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={lifeAreaRatings[area.id]}
                            onChange={(e) => handleRatingChange(area.id, e.target.value)}
                            className={`form-input w-20 text-center ${!hasUniqueRatings && Object.values(lifeAreaRatings).filter(r => r === lifeAreaRatings[area.id]).length > 1 ? 'border-red-500' : 'border-gray-600'}`}
                          />
                        </div>
                      ))}
                    </div>
                    {!hasUniqueRatings && (
                      <p className="form-error-message mt-2">
                        Каждой сфере необходимо присвоить уникальную оценку от 1 до 10!
                      </p>
                    )}
                  </div>
                ) : (
                  <textarea
                    rows={5}
                    placeholder={section.placeholder}
                    value={combinedStepAnswers[section.fieldName]}
                    onChange={(e) => handleCombinedStepChange(section.fieldName, e.target.value)}
                    className="form-textarea"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-6">
          {currentStep > 0 && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handlePreviousStep}
            >
              <span>⇐</span> Назад
            </button>
          )}
          <div className="flex-grow"></div> {/* Spacer */}
          <button
            type="button"
            className={`btn ${isSubmitting || (currentStepData.needsInput && !isStepComplete()) ? 'btn-disabled' : 'btn-primary'}`}
            onClick={handleNextStep}
            disabled={isSubmitting || (currentStepData.needsInput && !isStepComplete())}
          >
            {currentStep === questionnaireSteps.length - 1
              ? (isSubmitting ? 'Отправка...' : 'Завершить')
              : 'Далее'}
            {currentStep < questionnaireSteps.length - 1 && <span className="ml-2">➔</span>}
          </button>
        </div>
        {submitError && (
          <div className="form-error-message mt-4 p-3 bg-red-700/30 text-red-400 rounded-md text-center">
            {submitError}
          </div>
        )}
      </div>
      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>Дневник отслеживания привычек © 2025</p>
      </footer>
    </div>
  );
};

export default QuestionnairePage;
>>>>>>> REPLACE
