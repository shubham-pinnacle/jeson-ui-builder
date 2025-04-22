import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import GlobalStyles from './styles/GlobalStyles';
import './index.css';
import { ToastProvider } from './components/ToastContext';

// Create root element
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

ReactDOM.createRoot(rootElement).render(
  // <React.StrictMode>
    <Provider store={store}>
      <ToastProvider>
      <GlobalStyles />
      <App />
      </ToastProvider>
    </Provider>
  // </React.StrictMode>,
);
