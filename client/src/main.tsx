import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Intercept and ignore benign Vite HMR WebSocket connection errors
if (typeof window !== 'undefined') {
  const ignorePatterns = ['WebSocket', 'websocket', 'vite', 'HMR'];
  
  const originalHandler = window.onunhandledrejection;
  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message || String(event.reason || '');
    if (ignorePatterns.some(pattern => message.toLowerCase().includes(pattern.toLowerCase()))) {
      event.preventDefault();
      event.stopPropagation();
      console.warn('[Vite Ignored Rejection] Handled benign HMR WebSocket disconnect gracefully.');
    } else if (originalHandler) {
      originalHandler.call(window, event);
    }
  });

  const originalErrorHandler = window.onerror;
  window.addEventListener('error', (event) => {
    const message = event.message || '';
    if (ignorePatterns.some(pattern => message.toLowerCase().includes(pattern.toLowerCase()))) {
      event.preventDefault();
      event.stopPropagation();
      console.warn('[Vite Ignored Error] Handled benign HMR WebSocket disconnect gracefully.');
    } else if (originalErrorHandler) {
      // @ts-ignore
      originalErrorHandler.call(window, event.message, event.filename, event.lineno, event.colno, event.error);
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
