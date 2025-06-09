import React, { useState } from 'react';
import '../App.css'; // Убедитесь, что App.css импортирован

const LoginPage = ({ onLoginSuccess }) => {
  // Состояния для хранения введенных данных
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Состояния для отслеживания процесса входа и ошибок
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы
    setIsLoading(true); // Включаем состояние загрузки
    setError(''); // Сбрасываем предыдущие ошибки

    // Замените 'YOUR_API_HOST' на реальный адрес вашего API
    const apiHost = 'http://127.0.0.1:3000'; 

    try {
      const response = await fetch(`${apiHost}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        // Если сервер вернул ошибку (например, 401 Unauthorized)
        const errorData = await response.json();
        throw new Error(errorData.message || 'Неверные учетные данные.');
      }

      // Получаем данные пользователя из ответа
      const data = await response.json();
      console.log('Login successful, response data:', data);
      
      // Вызываем колбэк успешного входа и передаем данные о необходимости анкеты
      if (onLoginSuccess) {
        // Проверяем наличие объекта user и свойства needQuestionnaire
        const needQuestionnaire = data.user && data.user.needQuestionnaire !== undefined 
          ? data.user.needQuestionnaire 
          : false;
        
        onLoginSuccess(needQuestionnaire);
      }

    } catch (err) {
      // Обрабатываем ошибки сети или ошибки от сервера
      setError(err.message);
    } finally {
      setIsLoading(false); // Выключаем состояние загрузки
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-wrapper">
        <div className="login-header">
          <h1 className="login-title">Вход в систему</h1>
          <p className="login-subtitle">Добро пожаловать! Пожалуйста, введите ваши данные.</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="input-group">
            <label htmlFor="username">Имя пользователя</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите ваше имя пользователя"
              required
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите ваш пароль"
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="submit-button login-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;