import React, { useState } from 'react';
import { updatePassword } from '../services/api'; // Removed checkSession as it's not directly used here

const UpdatePasswordPage = ({ onPasswordUpdated }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
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
    <div className="min-h-screen bg-primary-light-bg dark:bg-primary-dark text-primary-light-text dark:text-white flex flex-col items-center justify-center p-4 animate-fadeIn">
      <div className="card w-full max-w-md p-8 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-accent-cyan-light dark:text-accent-cyan mb-2">Обновление пароля</h1>
          <p className="text-gray-600 dark:text-gray-400">Необходимо сменить стандартный пароль на новый для продолжения работы</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="form-error-message p-3 bg-red-100 dark:bg-red-700/30 text-red-700 dark:text-red-400 rounded-md text-sm text-center">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="p-3 bg-green-100 dark:bg-green-700/30 text-green-700 dark:text-green-400 rounded-md text-sm text-center">
              {successMessage}
            </div>
          )}
          
          <div>
            <label htmlFor="newPassword" className="form-label">Новый пароль</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              className={`form-input mt-1 ${(error && newPassword !== confirmPassword) || (error && newPassword.length < 6) ? 'form-input-error' : ''}`}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Введите новый пароль"
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="form-label">Подтверждение пароля</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={`form-input mt-1 ${(error && newPassword !== confirmPassword) ? 'form-input-error' : ''}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Подтвердите новый пароль"
              required
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className={`w-full btn ${isLoading || successMessage ? 'btn-disabled' : 'btn-primary'} py-3 text-lg`}
            disabled={isLoading || !!successMessage} // Disable button after successful submission too
          >
            {isLoading ? 'Обновление...' : 'Обновить пароль'}
          </button>
        </form>
      </div>
      <footer className="mt-8 text-center text-sm text-gray-700 dark:text-gray-500">
        <p>Дневник отслеживания привычек © 2025</p>
      </footer>
    </div>
  );
};

export default UpdatePasswordPage;
