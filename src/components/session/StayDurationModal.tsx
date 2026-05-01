import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../../context/SessionContext';

const StayDurationModal: React.FC = () => {
  const { stayDuration, setStayDuration } = useSession();
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!stayDuration) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [stayDuration]);

  if (stayDuration) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!arrivalDate || !departureDate) {
      setError('Both dates are required');
      return;
    }

    const arrival = new Date(arrivalDate);
    const departure = new Date(departureDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (arrival < today) {
      setError('Arrival date cannot be in the past');
      return;
    }

    if (departure <= arrival) {
      setError('Departure date must be after arrival date');
      return;
    }

    setStayDuration({ arrivalDate, departureDate });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-background/95 backdrop-blur-xl"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative w-full max-w-md bg-surface-container-high border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-primary text-3xl">calendar_today</span>
            </div>
            <h2 className="text-2xl font-headline font-black text-on-surface uppercase tracking-tight">Welcome to Golden Eagle</h2>
            <p className="text-white/40 text-sm mt-2">Please provide your stay dates to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Arrival Date</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm pointer-events-none">login</span>
                <input
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary/40 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Departure Date</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm pointer-events-none">logout</span>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary/40 transition-colors"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-error text-xs font-medium text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-container text-on-primary font-black uppercase tracking-[0.2em] py-5 rounded-2xl transition-all duration-300 shadow-lg shadow-primary/20"
            >
              Start Experience
            </button>
          </form>

          <p className="text-[9px] text-center text-white/20 mt-8 uppercase tracking-[0.1em] font-medium">
            This information is required to process your orders.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StayDurationModal;
