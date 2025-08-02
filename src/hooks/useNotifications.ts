import { useState, useCallback } from 'react';

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'like';
  message: string;
  duration?: number;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const addNotification = useCallback((notification: Omit<ToastNotification, 'id'>) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { ...notification, id }]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const showSuccess = useCallback((message: string, duration?: number) => {
    addNotification({ type: 'success', message, duration });
  }, [addNotification]);

  const showError = useCallback((message: string, duration?: number) => {
    addNotification({ type: 'error', message, duration });
  }, [addNotification]);

  const showInfo = useCallback((message: string, duration?: number) => {
    addNotification({ type: 'info', message, duration });
  }, [addNotification]);

  const showLike = useCallback((message: string, duration?: number) => {
    addNotification({ type: 'like', message, duration });
  }, [addNotification]);

  return {
    notifications,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
    showLike
  };
}