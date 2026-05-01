import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((message: string, type: NotificationType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed bottom-32 right-8 z-[100] space-y-4 pointer-events-none font-headline">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              className="pointer-events-auto"
            >
              <div className="bg-[#121413]/80 backdrop-blur-xl border border-white/5 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px]">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  n.type === 'success' ? 'bg-primary/20 text-primary' : 
                  n.type === 'error' ? 'bg-error/20 text-error' : 
                  'bg-tertiary/20 text-tertiary'
                }`}>
                  <span className="material-symbols-outlined text-sm">
                    {n.type === 'success' ? 'check_circle' : n.type === 'error' ? 'error' : 'info'}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-0.5">Notification</p>
                  <p className="text-white text-xs font-bold tracking-tight">{n.message}</p>
                </div>
                <button 
                  onClick={() => setNotifications((prev) => prev.filter((notif) => notif.id !== n.id))}
                  className="ml-auto text-white/20 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-xs">close</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};
