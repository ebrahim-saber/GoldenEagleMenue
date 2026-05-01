import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface StayDuration {
  arrivalDate: string;
  departureDate: string;
}

interface SessionContextType {
  tableId: string | null;
  stayDuration: StayDuration | null;
  setStayDuration: (duration: StayDuration) => void;
  isSessionActive: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [tableId, setTableId] = useState<string | null>(null);
  const [stayDuration, setStayDuration] = useState<StayDuration | null>(() => {
    const saved = localStorage.getItem('stayDuration');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const table = params.get('table');
    if (table) {
      setTableId(table);
      localStorage.setItem('tableId', table);
    } else {
      const savedTable = localStorage.getItem('tableId');
      if (savedTable) setTableId(savedTable);
    }
  }, [location]);

  const handleSetStayDuration = (duration: StayDuration) => {
    setStayDuration(duration);
    localStorage.setItem('stayDuration', JSON.stringify(duration));
  };

  useEffect(() => {
    if (stayDuration) {
      const departure = new Date(stayDuration.departureDate);
      departure.setHours(12, 0, 0, 0);
      const now = new Date();
      if (now > departure) {
        setStayDuration(null);
        localStorage.removeItem('stayDuration');
      }
    }
  }, [stayDuration]);

  const isSessionActive = !!stayDuration;

  return (
    <SessionContext.Provider value={{ 
      tableId, 
      stayDuration, 
      setStayDuration: handleSetStayDuration,
      isSessionActive
    }}>
      {children}
    </SessionContext.Provider>
  );
};


export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
