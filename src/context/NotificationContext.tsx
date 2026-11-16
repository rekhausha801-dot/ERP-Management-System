import React, { createContext, useContext, useState } from 'react';
import { message } from 'antd';

interface NotificationContextType {
  success: (msg: string) => void;
  error: (msg: string) => void;
  info: (msg: string) => void;
  warning: (msg: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const success = (msg: string) => message.success(msg);
  const error = (msg: string) => message.error(msg);
  const info = (msg: string) => message.info(msg);
  const warning = (msg: string) => message.warning(msg);

  return (
    <NotificationContext.Provider value={{ success, error, info, warning }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useAppNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useAppNotification must be used within NotificationProvider');
  return context;
};
