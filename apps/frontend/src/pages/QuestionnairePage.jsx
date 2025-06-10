import React, { useState } from 'react';
import { submitQuestionnaire } from '../services/api'; // Import submitQuestionnaire
import '../App.css'; // Assuming styles from App.css are needed

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
        title: `Ваши ценности отражают самое главное для вас в жизни, это основные принципы вашего существования. В идеале ваша жизнь и то, чему вы уделяете время, это отображение таковых ценностей. К сожалению, некоторые наши жизненные предпочтения не соответствуют этим ценностям. 
    
        Поразмыслите над вопросом: какова ваша главнейшая в жизни цель? Какие черты вы хотите в себе развить?`,
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
    introText: `Cледующим шагом на пути изменений привычек после осознания ценностей должно стать определение цели, многих намерений. 
    
    Чего именно хотите достичь?`,
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
  const [currentStep, setCurrentStep] = useState(0); // Default to first step
  const [answers, setAnswers] = useState({});
  // Добавляем состояние для оценки жизненных сфер
  const [lifeAreaRatings, setLifeAreaRatings] = useState(
    lifeAreas.reduce((acc, area) => {
      acc[area.id] = ''; // Изначально рейтинги пустые
      return acc;
    }, {})
  );
  // Состояния для комбинированного шага
  const [combinedStepAnswers, setCombinedStepAnswers] = useState({
    qualities: '',
    summary: '',
    habitsBad: '',
    habitsGood: '',
    discipline: '',
    smallChange: '', // Для шага start_small
    // Поля для КВДРЧ
    konkretna: '',
    vymiriuvana: '',
    dosyazhna: '',
    relevantna: '',
    chasova: '',
    // Поля для шага "Влияние привычек на жизнь"
    newValue: '',
    habitFuture: '' // Переименовываем, чтобы избежать конфликта
  });
  // Флаг для проверки уникальности оценок
  const [hasUniqueRatings, setHasUniqueRatings] = useState(true);
  // State for API submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleAnswerChange = (e) => {
    const currentStepId = questionnaireSteps[currentStep].id;
    setAnswers(prev => ({
      ...prev,
      [currentStepId]: e.target.value
    }));
  };

  // Обработчик изменения полей в комбинированном шаге
  const handleCombinedStepChange = (fieldName, value) => {
    setCombinedStepAnswers(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Обработчик изменения рейтинга жизненной сферы
  const handleRatingChange = (areaId, value) => {
    // Приводим к числу и проверяем диапазон 1-10
    let numValue = parseInt(value);

    // Если пустое значение, сохраняем как пустую строку
    if (isNaN(numValue) || value === '') {
      setLifeAreaRatings(prev => ({ ...prev, [areaId]: '' }));
      return;
    }

    // Ограничиваем значение диапазоном 1-10
    numValue = Math.max(1, Math.min(10, numValue));

    setLifeAreaRatings(prev => {
      const newRatings = { ...prev, [areaId]: numValue };

      // Проверяем уникальность значений (не считая пустые строки)
      const values = Object.values(newRatings).filter(val => val !== '');
      const uniqueValues = new Set(values);
      setHasUniqueRatings(values.length === uniqueValues.size);

      return newRatings;
    });
  };

  // Проверяем, все ли оценки заполнены
  const isLifeAreasStepComplete = () => {
    const values = Object.values(lifeAreaRatings);
    return values.every(val => val !== '') && hasUniqueRatings;
  };

  // Проверяем, заполнен ли комбинированный шаг
  const isCombinedStepComplete = () => {
    const currentStepData = questionnaireSteps[currentStep];

    // Убедимся, что мы на шаге с типом combinedStep или combinedStepKVDRCH
    if (!currentStepData || (!currentStepData.type?.startsWith("combinedStep")) || !currentStepData.sections) {
      return true; // Не комбинированный шаг, возвращаем true
    }

    // Для типа combinedStepKVDRCH (шаг с 5 полями КВДРЧ)
    if (currentStepData.type === "combinedStepKVDRCH") {
      return combinedStepAnswers.konkretna.trim() !== '' &&
        combinedStepAnswers.vymiriuvana.trim() !== '' &&
        combinedStepAnswers.dosyazhna.trim() !== '' &&
        combinedStepAnswers.relevantna.trim() !== '' &&
        combinedStepAnswers.chasova.trim() !== '';
    }

    // Для обычного типа combinedStep
    if (currentStepData.type === "combinedStep") {
      // Определяем, какой тип комбинированного шага у нас по fieldName
      if (currentStepData.sections.length === 2) {
        const fieldNames = currentStepData.sections.map(section => section.fieldName);

        if (fieldNames.includes('habitsBad') && fieldNames.includes('habitsGood')) {
          // Шаг с полями habitsBad и habitsGood
          return combinedStepAnswers.habitsBad.trim() !== '' &&
            combinedStepAnswers.habitsGood.trim() !== '';
        }
        else if (fieldNames.includes('discipline') && fieldNames.includes('smallChange')) {
          // Шаг с полями discipline и smallChange
          return combinedStepAnswers.discipline.trim() !== '' &&
            combinedStepAnswers.smallChange.trim() !== '';
        }
        else if (fieldNames.includes('newValue') && fieldNames.includes('habitFuture')) {
          // Шаг "Влияние привычек на жизнь" с полями newValue и habitFuture
          return combinedStepAnswers.newValue.trim() !== '' &&
            combinedStepAnswers.habitFuture.trim() !== '';
        }
      } else if (currentStepData.sections.length === 3) {
        // Старый шаг с тремя полями (qualities, lifeAreas, summary)
        return combinedStepAnswers.qualities.trim() !== '' &&
          combinedStepAnswers.summary.trim() !== '' &&
          isLifeAreasStepComplete();
      }
    }

    // По умолчанию возвращаем true, чтобы не блокировать переход
    return true;
  };

  const handleNextStep = async () => { // Made async
    // Проверяем, является ли текущий шаг комбинированным и заполнены ли все поля
    const currentStepData = questionnaireSteps[currentStep];
    if (currentStepData.type?.startsWith("combinedStep") && !isCombinedStepComplete()) {
      alert('Пожалуйста, заполните все поля этого шага.');
      return;
    }

    if (currentStep < questionnaireSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // This is the last step, prepare and submit data
      setIsSubmitting(true);
      setSubmitError('');

      // Подготавливаем данные для отправки на бэкенд
      const formData = { ...answers };

      // Добавляем данные из комбинированных шагов, используя id шага в качестве ключа

      // Шаг self_analysis - первый комбинированный шаг
      formData.self_analysis = {
        qualities: combinedStepAnswers.qualities,
        lifeAreaRatings,
        summary: combinedStepAnswers.summary
      };

      // Шаг habits_analysis - шаг с habitsBad и habitsGood
      formData.habits_analysis = {
        habitsBad: combinedStepAnswers.habitsBad,
        habitsGood: combinedStepAnswers.habitsGood
      };

      // Шаг start_small - шаг с discipline и smallChange
      formData.start_small = {
        discipline: combinedStepAnswers.discipline,
        smallChange: combinedStepAnswers.smallChange
      };

      // Шаг habits_impact - шаг с newValue и habitFuture
      formData.habits_impact = {
        newValue: combinedStepAnswers.newValue,
        habitFuture: combinedStepAnswers.habitFuture // Используем переименованное поле, но ключ оставляем как в API
      };

      // Шаг kvdrch_formulation - шаг с КВДРЧ
      formData.kvdrch_formulation = {
        konkretna: combinedStepAnswers.konkretna,
        vymiriuvana: combinedStepAnswers.vymiriuvana,
        dosyazhna: combinedStepAnswers.dosyazhna,
        relevantna: combinedStepAnswers.relevantna,
        chasova: combinedStepAnswers.chasova
      };

      const { welcome, ...payload } = formData; // Удаляем поле welcome, если оно есть
      try {
        await submitQuestionnaire(payload); // Отправляем данные на бэкенд
        if (onQuestionnaireComplete) {
          onQuestionnaireComplete();
        }
        // Optionally, show success message or redirect here
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
    <div className="app-container">
      <div className="journal-header">
        <h1 className="journal-title">Анкета: Шаг {currentStep + 1} из {questionnaireSteps.length}</h1>
      </div>
      <div className="questionnaire-container habit-journal">
        <div className="section">
          <h2 className="section-title">{currentStepData.title}</h2>
          <p style={{ whiteSpace: 'pre-line', marginBottom: '1rem' }}>{currentStepData.introText}</p>
        </div>

        {currentStepData.needsInput && !currentStepData.type?.startsWith("combinedStep") && (
          <div className="section">
            <textarea
              rows={8} // Consistent large text input
              placeholder={currentStepData.placeholder}
              value={answers[currentStepData.id] || ''}
              onChange={handleAnswerChange}
              className="questionnaire-textarea" // Added class for specific styling if needed
            />
          </div>
        )}

        {currentStepData.type === "combinedStepKVDRCH" && (
          <div className="section combined-step-section kvdrch-step">
            {/* Отображаем 5 полей для критериев КВДРЧ */}
            {currentStepData.sections.map((section, index) => (
              <div key={index} className="combined-section" style={{ marginBottom: index < 4 ? '30px' : '0' }}>
                <h3 style={{ marginBottom: '12px', color: '#2a6496' }}>{section.title}</h3>
                {section.introText && (
                  <p style={{ marginBottom: '15px' }}>{section.introText}</p>
                )}
                <textarea
                  rows={4}
                  placeholder={section.placeholder}
                  value={combinedStepAnswers[section.fieldName]}
                  onChange={(e) => handleCombinedStepChange(section.fieldName, e.target.value)}
                  className="questionnaire-textarea"
                  style={{ borderLeft: '4px solid #2a6496' }}
                />
              </div>
            ))}
          </div>
        )}

        {currentStepData.type === "combinedStep" && (
          <div className="section combined-step-section">
            {/* Проверяем, какой тип комбинированного шага (с 2 или 3 секциями) */}
            {currentStepData.sections.length === 2 ? (
              // Шаг с двумя секциями
              <>
                {/* Определяем, какой именно комбинированный шаг с двумя секциями */}
                {currentStepData.sections[0].fieldName === 'habitsBad' ? (
                  // Шаг с полями habitsBad и habitsGood
                  <>
                    {/* Первая секция - Плохие привычки */}
                    <div className="combined-section" style={{ marginBottom: '30px' }}>
                      <h3 style={{ marginBottom: '12px' }}>{currentStepData.sections[0].title}</h3>
                      <textarea
                        rows={5}
                        placeholder={currentStepData.sections[0].placeholder}
                        value={combinedStepAnswers.habitsBad}
                        onChange={(e) => handleCombinedStepChange('habitsBad', e.target.value)}
                        className="questionnaire-textarea"
                      />
                    </div>

                    {/* Вторая секция - Хорошие привычки */}
                    <div className="combined-section">
                      <h3 style={{ marginBottom: '12px' }}>{currentStepData.sections[1].title}</h3>
                      {currentStepData.sections[1].introText && (
                        <p style={{ marginBottom: '15px' }}>{currentStepData.sections[1].introText}</p>
                      )}
                      <textarea
                        rows={5}
                        placeholder={currentStepData.sections[1].placeholder}
                        value={combinedStepAnswers.habitsGood}
                        onChange={(e) => handleCombinedStepChange('habitsGood', e.target.value)}
                        className="questionnaire-textarea"
                      />
                    </div>
                  </>
                ) : currentStepData.sections[0].fieldName === 'newValue' ? (
                  // Шаг "Влияние привычек на жизнь" с полями newValue и smallChange
                  <>
                    {/* Первая секция - Влияние на жизнь */}
                    <div className="combined-section" style={{ marginBottom: '30px' }}>
                      <h3 style={{ marginBottom: '12px' }}>{currentStepData.sections[0].title}</h3>
                      <textarea
                        rows={5}
                        placeholder={currentStepData.sections[0].placeholder}
                        value={combinedStepAnswers.newValue}
                        onChange={(e) => handleCombinedStepChange('newValue', e.target.value)}
                        className="questionnaire-textarea"
                      />
                    </div>

                    {/* Вторая секция - Актуальность в будущем */}
                    <div className="combined-section">
                      <h3 style={{ marginBottom: '12px' }}>{currentStepData.sections[1].title}</h3>
                      {currentStepData.sections[1].introText && (
                        <p style={{ marginBottom: '15px' }}>{currentStepData.sections[1].introText}</p>
                      )}
                      <textarea
                        rows={5}
                        placeholder={currentStepData.sections[1].placeholder}
                        value={combinedStepAnswers.habitFuture}
                        onChange={(e) => handleCombinedStepChange('habitFuture', e.target.value)}
                        className="questionnaire-textarea"
                      />
                    </div>
                  </>
                ) : currentStepData.sections[0].fieldName === 'discipline' ? (
                  // Шаг с полями discipline и smallChange
                  <>
                    {/* Первая секция - Дисциплина */}
                    <div className="combined-section" style={{ marginBottom: '30px' }}>
                      <h3 style={{ marginBottom: '12px' }}>{currentStepData.sections[0].title}</h3>
                      <textarea
                        rows={5}
                        placeholder={currentStepData.sections[0].placeholder}
                        value={combinedStepAnswers.discipline}
                        onChange={(e) => handleCombinedStepChange('discipline', e.target.value)}
                        className="questionnaire-textarea"
                      />
                    </div>

                    {/* Вторая секция - Небольшое изменение */}
                    <div className="combined-section">
                      <h3 style={{ marginBottom: '12px' }}>{currentStepData.sections[1].title}</h3>
                      {currentStepData.sections[1].introText && (
                        <p style={{ marginBottom: '15px' }}>{currentStepData.sections[1].introText}</p>
                      )}
                      <textarea
                        rows={5}
                        placeholder={currentStepData.sections[1].placeholder}
                        value={combinedStepAnswers.smallChange}
                        onChange={(e) => handleCombinedStepChange('smallChange', e.target.value)}
                        className="questionnaire-textarea"
                      />
                    </div>
                  </>
                ) : (
                  // Неизвестный тип с двумя секциями
                  <p>Неизвестный тип комбинированного шага</p>
                )}
              </>
            ) : (
              // Старый комбинированный шаг с тремя секциями
              <>
                {/* Первая секция - Качества для развития */}
                <div className="combined-section" style={{ marginBottom: '30px' }}>
                  <h3 style={{ marginBottom: '12px' }}>{currentStepData.sections[0].title}</h3>
                  <textarea
                    rows={5}
                    placeholder={currentStepData.sections[0].placeholder}
                    value={combinedStepAnswers.qualities}
                    onChange={(e) => handleCombinedStepChange('qualities', e.target.value)}
                    className="questionnaire-textarea"
                  />
                </div>

                {/* Вторая секция - Оценка жизненных сфер */}
                <div className="combined-section" style={{ marginBottom: '30px' }}>
                  <h3 style={{ marginBottom: '12px' }}>{currentStepData.sections[1].title}</h3>
                  <p style={{ marginBottom: '15px' }}>{currentStepData.sections[1].introText}</p>
                  <div className="life-areas-container" style={{ marginBottom: '20px' }}>
                    {lifeAreas.map((area, ind) => (
                      <div key={area.id} className="life-area-item" style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '12px',
                        padding: '8px',
                        borderRadius: '4px',
                        backgroundColor: '#f5f5f5'
                      }}>
                        <div className="life-area-name" style={{ flex: 1, fontWeight: 'bold' }}>
                          {area.name}
                        </div>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={lifeAreaRatings[area.id]}
                          onChange={(e) => handleRatingChange(area.id, e.target.value)}
                          style={{
                            width: '60px',
                            textAlign: 'center',
                            padding: '8px',
                            borderRadius: '4px',
                            border: hasUniqueRatings ? '1px solid #ccc' : '1px solid red'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  {!hasUniqueRatings && (
                    <p style={{ color: 'red', marginBottom: '15px' }}>
                      Каждой сфере необходимо присвоить уникальную оценку от 1 до 10!
                    </p>
                  )}
                </div>

                {/* Третья секция - Обобщение результатов */}
                <div className="combined-section">
                  <h3 style={{ marginBottom: '12px' }}>{currentStepData.sections[2].title}</h3>
                  <p style={{ marginBottom: '15px' }}>{currentStepData.sections[2].introText}</p>
                  <textarea
                    rows={5}
                    placeholder={currentStepData.sections[2].placeholder}
                    value={combinedStepAnswers.summary}
                    onChange={(e) => handleCombinedStepChange('summary', e.target.value)}
                    className="questionnaire-textarea"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {currentStepData.type === "lifeAreas" && (
          <div className="section life-areas-section">
            <div className="life-areas-container" style={{ marginBottom: '20px' }}>
              {lifeAreas.map((area) => (
                <div key={area.id} className="life-area-item" style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px',
                  padding: '8px',
                  borderRadius: '4px',
                  backgroundColor: '#f5f5f5'
                }}>
                  <div className="life-area-name" style={{ flex: 1, fontWeight: 'bold' }}>
                    {area.name}
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={lifeAreaRatings[area.id]}
                    onChange={(e) => handleRatingChange(area.id, e.target.value)}
                    style={{
                      width: '60px',
                      textAlign: 'center',
                      padding: '8px',
                      borderRadius: '4px',
                      border: hasUniqueRatings ? '1px solid #ccc' : '1px solid red'
                    }}
                  />
                </div>
              ))}
            </div>
            {!hasUniqueRatings && (
              <p style={{ color: 'red', marginBottom: '15px' }}>
                Каждой сфере необходимо присвоить уникальную оценку от 1 до 10!
              </p>
            )}
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
            disabled={(currentStepData.needsInput && currentStepData.type !== "combinedStep" && (!answers[currentStepData.id] || answers[currentStepData.id].trim() === '')) ||
              (currentStepData.type === "lifeAreas" && !isLifeAreasStepComplete()) ||
              (currentStepData.type === "combinedStep" && !isCombinedStepComplete()) ||
              (currentStep === questionnaireSteps.length - 1 && isSubmitting) // Disable on last step if submitting
            }
          >
            {currentStep === questionnaireSteps.length - 1
              ? (isSubmitting ? 'Отправка...' : 'Завершить')
              : 'Далее'}
            {currentStep < questionnaireSteps.length - 1 && <span style={{ marginLeft: '5px' }}>➔</span>}
          </button>
        </div>
        {submitError && (
          <div className="error-message" style={{ marginTop: '15px', textAlign: 'center' }}>
            {submitError}
          </div>
        )}
      </div>
      <footer className="app-footer">
        <p>Дневник отслеживания привычек © 2025</p>
      </footer>
    </div>
  );
};

export default QuestionnairePage;
