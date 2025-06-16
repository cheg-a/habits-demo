import React from 'react';
import ReactDOM from 'react-dom/client'; // Corrected import for createRoot
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './components.css'; // Import custom component styles
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx'; // Corrected path

const root = ReactDOM.createRoot(document.getElementById('root')); // Use createRoot from react-dom/client
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
