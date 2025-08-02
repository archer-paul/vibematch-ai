import { useState, useEffect } from 'react';
import { CheckCircle, X, Heart, Info, AlertCircle } from 'lucide-react';
import { Card } from './card';

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'like';
  message: string;
  duration?: number;
}

interface NotificationToastProps {
  notifications: ToastNotification[];
  onRemove: (id: string) => void;
}

export function NotificationToast({ notifications, onRemove }: NotificationToastProps) {
  useEffect(() => {
    notifications.forEach((notification) => {
      const duration = notification.duration || 4000;
      const timer = setTimeout(() => {
        onRemove(notification.id);
      }, duration);

      return () => clearTimeout(timer);
    });
  }, [notifications, onRemove]);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={`
            p-4 max-w-sm shadow-lg border-l-4 animate-in slide-in-from-right duration-300
            ${notification.type === 'success' ? 'border-l-green-500 bg-green-50' : ''}
            ${notification.type === 'error' ? 'border-l-red-500 bg-red-50' : ''}
            ${notification.type === 'info' ? 'border-l-blue-500 bg-blue-50' : ''}
            ${notification.type === 'like' ? 'border-l-pink-500 bg-pink-50' : ''}
          `}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {notification.type === 'success' && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              {notification.type === 'error' && (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              {notification.type === 'info' && (
                <Info className="w-5 h-5 text-blue-600" />
              )}
              {notification.type === 'like' && (
                <Heart className="w-5 h-5 text-pink-600 fill-current" />
              )}
            </div>
            
            <div className="flex-1">
              <p className={`
                text-sm font-medium
                ${notification.type === 'success' ? 'text-green-800' : ''}
                ${notification.type === 'error' ? 'text-red-800' : ''}
                ${notification.type === 'info' ? 'text-blue-800' : ''}
                ${notification.type === 'like' ? 'text-pink-800' : ''}
              `}>
                {notification.message}
              </p>
            </div>
            
            <button
              onClick={() => onRemove(notification.id)}
              className={`
                flex-shrink-0 p-0.5 rounded-full hover:bg-white/50
                ${notification.type === 'success' ? 'text-green-600' : ''}
                ${notification.type === 'error' ? 'text-red-600' : ''}
                ${notification.type === 'info' ? 'text-blue-600' : ''}
                ${notification.type === 'like' ? 'text-pink-600' : ''}
              `}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}