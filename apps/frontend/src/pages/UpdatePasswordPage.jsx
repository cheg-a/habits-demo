import React, { useState } from 'react';
import { updatePassword, checkSession } from '../services/api';
import '../App.css';

const UpdatePasswordPage = ({ onPasswordUpdated }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Проверка совпадения паролей
    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    // Проверка минимальной длины пароля
    if (newPassword.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      await updatePassword(newPassword);
      setSuccessMessage('Пароль успешно обновлен');
      
      // Даем пользователю немного времени, чтобы увидеть сообщение об успехе
      setTimeout(() => {
        if (onPasswordUpdated) {
          onPasswordUpdated();
        }
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'Произошла ошибка при обновлении пароля');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="login-page-container">
      <div className="login-form-wrapper">
        <div className="login-header">
          <h1 className="login-title">Обновление пароля</h1>
          <p className="login-subtitle">Необходимо сменить стандартный пароль на новый для продолжения работы</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          
          <div className="input-group">
            <label htmlFor="newPassword">Новый пароль</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Введите новый пароль"
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="confirmPassword">Подтверждение пароля</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Подтвердите новый пароль"
              required
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="submit-button login-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Обновление...' : 'Обновить пароль'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
