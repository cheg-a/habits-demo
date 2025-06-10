const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://api.habbit.local:3000'; // Используем переменную окружения с запасным вариантом


export const loginUser = async (username, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Добавляем для поддержки куки
    body: JSON.stringify({ username, password }),
  });

  

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Login failed and error response is not valid JSON' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  // Дополнительно проверяем, есть ли dailyReport в ответе
  return {
    ...data,
    // dailyReport: data.dailyReport || null
  };
};

export const logoutUser = async () => {
  const response = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Even if no body, good practice to set
    },
    credentials: 'include', // Добавляем для поддержки куки
    body: JSON.stringify({}), // Sending an empty object as body
    // No body is typically needed for logout
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Logout failed and error response is not valid JSON' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  // Logout might not return a body or specific data, just a success status
  return response.json(); // Or handle as needed, e.g., return { success: true }
};

export const submitQuestionnaire = async (questionnaireData) => {
  const response = await fetch(`${BASE_URL}/questionnaire`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Добавляем для поддержки куки
    body: JSON.stringify(questionnaireData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Questionnaire submission failed and error response is not valid JSON' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const submitDailyReport = async (dailyReportData) => {
  const response = await fetch(`${BASE_URL}/reports/daily`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Добавляем для поддержки куки
    body: JSON.stringify(dailyReportData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Daily report submission failed and error response is not valid JSON' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Функция для проверки активной сессии пользователя
// Добавляем кэширование для предотвращения дублирования запросов
let sessionCheckPromise = null;
let sessionCheckTimer = null;

export const checkSession = async () => {
  // Если уже идет запрос, возвращаем его промис
  if (sessionCheckPromise) {
    return sessionCheckPromise;
  }

  // Создаем новый запрос
  sessionCheckPromise = (async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/whoami`, {
        method: 'GET',
        credentials: 'include', // Важно для передачи куки
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Если статус 401 - пользователь не авторизован, не выбрасываем ошибку
        if (response.status === 401) {
          return { isLoggedIn: false };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const user = await response.json();
      return { 
        isLoggedIn: true, 
        user,
        // Определяем, нужен ли пользователю опросник
        needsQuestionnaire: user.needQuestionnaire !== undefined ? user.needQuestionnaire : false,
        // Добавляем проверку на наличие заполненного дневного отчета
        dailyReport: user.dailyReport || null,
        // Проверяем, установлен ли у пользователя дефолтный пароль
        hasDefaultPassword: user.isDefaultPassword === true
      };
    } catch (error) {
      console.error('Session check failed:', error);
      return { isLoggedIn: false };
    } finally {
      // Сбрасываем промис через небольшой таймаут, чтобы обработать быстрые последовательные вызовы
      clearTimeout(sessionCheckTimer);
      sessionCheckTimer = setTimeout(() => {
        sessionCheckPromise = null;
      }, 300);
    }
  })();

  return sessionCheckPromise;
};

export const updatePassword = async (newPassword) => {
  const response = await fetch(`${BASE_URL}/auth/update-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Важно для передачи куки
    body: JSON.stringify({ newPassword }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Не удалось обновить пароль' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};
