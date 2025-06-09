import React, { useState } from 'react';
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
    title: "Самоанализ и жизненные приоритеты",
    introText: "Этот шаг поможет вам определить ваши приоритеты и направления для развития.",
    type: "combinedStep",
    needsInput: true,
    sections: [
      {
        title: "Какие качества вы хотите развивать в себе?",
        placeholder: "Опишите качества, которые вы хотели бы в себе развить...",
        fieldName: "qualities"
      },
      {
        title: "Оценка жизненных сфер",
        introText: "Пронумеруйте важность следующих сфер жизни от 1 (наиболее важная для вас) до 10 (совсем незначимая). Вам необходимо определить приоритет у всех сфер. Это непростое задание, своеобразный вызов себе. Вопросы к самим себе сейчас могут навернуть вас на неожиданное открытие в себе.",
        fieldName: "lifeAreas"
      },
      {
        title: "Обобщение результатов",
        introText: "Теперь попробуйте обобщить итоги двух предыдущих упражнений и определить, что для вас наиболее важно",
        placeholder: "Исходя из оценки жизненных сфер и качеств для развития, что для вас наиболее важно...",
        fieldName: "summary"
      }
    ]
  },
  {
    title: "Какую цель ставите перед собой?",
    introText: "Что мотивирует вас работать над этими привычками? Какие конкретные цели вы связываете с их успешным формированием?",
    placeholder: "Чего именно хотите достичь?",
    needsInput: true,
  },
   {
    title: "Самоанализ и жизненные приоритеты",
    introText: "Этот шаг поможет вам определить ваши приоритеты и направления для развития.",
    type: "combinedStep",
    needsInput: true,
    sections: [
      {
        title: "Какие текущие привычки мешают вам достигать целей?",
        placeholder: "Опишите привычки, которые вы хотели бы изменить...",
        fieldName: "habitsBad"
      },
      {
        title: "Какие новые привычки вы хотите развивать?",
        introText: "Теперь попробуйте обобщить итоги двух предыдущих упражнений и определить, что для вас наиболее важно",
        placeholder: "Исходя из оценки жизненных сфер и качеств для развития, что для вас наиболее важно...",
        fieldName: "habitsGood"
      }
    ]
  },
  {
    title: "Начинаем с малого",
    introText: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illum nobis et doloribus excepturi laboriosam, enim sed voluptatibus nihil ea assumenda eligendi quod, ad eaque illo. Ipsum illo numquam veniam culpa harum ut porro aliquid. Ut quibusdam dolorum fugit? Optio consectetur architecto laudantium beatae aliquam molestiae! Illum sed eius mollitia accusamus modi optio repudiandae laboriosam iste, labore hic sapiente molestias inventore atque iure? Commodi vel ea est officiis explicabo dicta voluptates quae recusandae, accusantium in blanditiis vitae obcaecati fuga nobis facilis, nemo reiciendis aperiam beatae voluptatum aliquam quis itaque? Laboriosam, dolore! Unde dolor iure omnis molestiae, culpa voluptatibus facere ipsa? Consequatur quam pariatur autem similique dolor reiciendis quaerat! Eaque architecto quaerat nihil tenetur, cupiditate deleniti, soluta totam saepe mollitia modi est accusamus culpa fugit alias non, iure illo dolores esse quam ad blanditiis! Ducimus sit, necessitatibus tempora excepturi doloribus officiis iste sint ratione corrupti repellendus deserunt accusantium ipsum esse illo aspernatur aliquam animi reiciendis ex perspiciatis hic minus possimus numquam vel odio! Veniam placeat ipsa vel minus asperiores, corrupti dolorem culpa assumenda ducimus, dolore quisquam cupiditate excepturi veritatis at vitae neque recusandae iure minima omnis enim maxime nostrum sint eum. Itaque vel sint excepturi, minima ipsum a fugiat? Animi provident harum delectus, quis neque magni culpa atque molestias molestiae reprehenderit voluptatibus modi earum eaque alias officia maiores. Vitae corporis aliquam quaerat impedit eligendi consequuntur tenetur possimus. Impedit facere eveniet consequatur aliquam aut cumque eius officia enim atque maiores? Sint perspiciatis explicabo necessitatibus. Aperiam officia nobis quos rem. Voluptate laudantium nisi consectetur eum modi accusamus, numquam dolore assumenda sapiente earum, quisquam atque magni repellendus exercitationem autem voluptates a itaque! Et neque facere inventore blanditiis pariatur eaque sunt soluta placeat reiciendis tempora esse dolor, ullam quasi dicta quod dolores iure velit hic, saepe autem eius architecto provident. Rerum voluptates alias fuga accusantium, laboriosam doloribus magni! Iure, libero voluptas quo tempore ducimus facilis nemo! Rerum, ut. Molestiae vero nostrum sunt perferendis aliquam, reiciendis, dolorum modi ipsam delectus commodi facilis beatae nemo quas, vitae dignissimos sit esse eligendi suscipit. Ab ducimus ea quam harum sint? Beatae perspiciatis dolore expedita consectetur quas odit assumenda odio inventore explicabo eos veritatis tempore ratione illo, sit rerum optio minus dicta, placeat quaerat rem magnam, velit vel! Laboriosam repellat quia consequuntur illum nemo eligendi cupiditate atque explicabo impedit praesentium! Culpa nulla porro tempora amet, enim corporis reiciendis at, optio quisquam earum nesciunt consequuntur doloribus, dolorum provident molestiae! Itaque doloremque ex porro architecto eligendi quo nihil. Impedit, quia! Reiciendis ad, sunt ex incidunt facere, ullam aut reprehenderit est molestiae voluptas provident nostrum corporis aliquid exercitationem earum cumque ea labore possimus expedita deleniti? Dolor beatae accusantium quaerat illo tempora culpa dicta blanditiis libero officia porro. Ab aut veritatis possimus hic aliquid a eligendi ipsam, atque reiciendis cumque. Maiores iusto molestias, inventore excepturi, nesciunt nisi sapiente ipsa qui, odio repudiandae possimus odit cum omnis placeat necessitatibus quis laboriosam. Ipsum suscipit illum molestias eius? Suscipit debitis necessitatibus eum dolor. Quas possimus quia magni, ipsam repellat dolore consequuntur libero odit alias magnam consectetur omnis dolores! Dolores maxime id nisi. Maiores neque voluptate architecto eveniet?",
    type: "combinedStep",
    needsInput: true,
    sections: [
      {
        title: "Как часто вы придерживаетесь желаемого поведения?",
        placeholder: "Опишите привычки, которые вы хотели бы изменить...",
        fieldName: "discipline"
      },
      {
        title: "Какое небольшое изменение может вам пригодиться?",
        introText: "Теперь попробуйте обобщить итоги двух предыдущих упражнений и определить, что для вас наиболее важно",
        placeholder: "Исходя из оценки жизненных сфер и качеств для развития, что для вас наиболее важно...",
        fieldName: "smallChange"
      }
    ]
  },
  {
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
    smallChange: '',
    // Поля для КВДРЧ
    konkretna: '',
    vymiriuvana: '',
    dosyazhna: '',
    relevantna: '',
    chasova: ''
  });
  // Флаг для проверки уникальности оценок
  const [hasUniqueRatings, setHasUniqueRatings] = useState(true);

  const handleAnswerChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = e.target.value;
    setAnswers(newAnswers);
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
      setLifeAreaRatings(prev => ({...prev, [areaId]: ''}));
      return;
    }
    
    // Ограничиваем значение диапазоном 1-10
    numValue = Math.max(1, Math.min(10, numValue));
    
    setLifeAreaRatings(prev => {
      const newRatings = {...prev, [areaId]: numValue};
      
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

  const handleNextStep = () => {
    // Проверяем, является ли текущий шаг комбинированным и заполнены ли все поля
    if ((currentStep === 3 || currentStep === 4 || currentStep === 5) && !isCombinedStepComplete()) {
      alert('Пожалуйста, заполните все поля комбинированного шага.');
      return;
    }
    
    if (currentStep < questionnaireSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // This is the last step, call onQuestionnaireComplete
      if (onQuestionnaireComplete) {
        // Включаем ответы комбинированного шага в ответы
        const completeAnswers = [...answers];
        
        // Сохраняем данные комбинированных шагов
        // Шаг с habitsBad и habitsGood
        if (questionnaireSteps[4] && questionnaireSteps[4].type === "combinedStep") {
          completeAnswers[4] = JSON.stringify({
            habitsBad: combinedStepAnswers.habitsBad,
            habitsGood: combinedStepAnswers.habitsGood
          });
        }
        
        // Шаг с discipline и smallChange
        if (questionnaireSteps[5] && questionnaireSteps[5].type === "combinedStep") {
          completeAnswers[5] = JSON.stringify({
            discipline: combinedStepAnswers.discipline,
            smallChange: combinedStepAnswers.smallChange
          });
        }
        
        // Шаг с КВДРЧ
        if (questionnaireSteps[6] && questionnaireSteps[6].type === "combinedStepKVDRCH") {
          completeAnswers[6] = JSON.stringify({
            konkretna: combinedStepAnswers.konkretna,
            vymiriuvana: combinedStepAnswers.vymiriuvana,
            dosyazhna: combinedStepAnswers.dosyazhna,
            relevantna: combinedStepAnswers.relevantna,
            chasova: combinedStepAnswers.chasova
          });
        }
        
        // Старый шаг с qualities, lifeAreas и summary (если есть)
        if (questionnaireSteps.some(step => step.type === "combinedStep" && step.sections && step.sections.length === 3)) {
          const stepIndex = questionnaireSteps.findIndex(step => 
            step.type === "combinedStep" && step.sections && step.sections.length === 3);
          
          if (stepIndex !== -1) {
            completeAnswers[stepIndex] = JSON.stringify({
              lifeAreaRatings,
              qualities: combinedStepAnswers.qualities,
              summary: combinedStepAnswers.summary
            });
          }
        }
        
        console.log("Questionnaire answers:", completeAnswers); // Optional: log answers
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

        {currentStepData.needsInput && !currentStepData.type?.startsWith("combinedStep") && (
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
            disabled={(currentStepData.needsInput && currentStepData.type !== "combinedStep" && answers[currentStep].trim() === '') || 
                      (currentStepData.type === "lifeAreas" && !isLifeAreasStepComplete()) ||
                      (currentStepData.type === "combinedStep" && !isCombinedStepComplete())}
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
