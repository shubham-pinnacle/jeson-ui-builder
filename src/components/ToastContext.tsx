import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

const ToastContext = createContext<{
  showToast: (options: ToastOptions) => void;
}>({
  showToast: () => {},
});

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const [duration, setDuration] = useState(3000);

  const showToast = ({ message, type = 'info', duration = 3000 }: ToastOptions) => {
    setMessage(message);
    setType(type);
    setDuration(duration);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const getAlertStyle = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: '#4caf50', color: '#fff' }; // green
      case 'error':
        return { backgroundColor: '#f44336', color: '#fff' }; // red
      case 'info':
        return { backgroundColor: '#2196f3', color: '#fff' }; // blue
      case 'warning':
        return { backgroundColor: '#ff9800', color: '#fff' }; // orange
      default:
        return {};
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={type}
          variant="filled"
          sx={{
            width: '100%',
            ...getAlertStyle(),
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};
