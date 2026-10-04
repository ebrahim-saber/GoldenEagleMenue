import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../../context/SessionContext';
import { useLanguage } from '../../context/LanguageContext';

const StayDurationModal: React.FC = () => {
  const { stayDuration, setStayDuration } = useSession();
  const { direction, t, language } = useLanguage();
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem('stay_modal_dismissed') === 'true';
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [arrivalDate, setArrivalDate] = useState(todayStr);
  const [departureDate, setDepartureDate] = useState(tomorrowStr);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!stayDuration && !isDismissed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [stayDuration, isDismissed]);

  if (stayDuration || isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('stay_modal_dismissed', 'true');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!arrivalDate || !departureDate) {
      setError(language === 'ar' ? 'يرجى تحديد تاريخي الوصول والمغادرة' : 'Please provide arrival and departure dates');
      return;
    }

    const arrival = new Date(arrivalDate);
    const departure = new Date(departureDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (arrival < today) {
      setError(language === 'ar' ? 'لا يمكن أن يكون تاريخ الوصول في الماضي' : 'Arrival date cannot be in the past');
      return;
    }

    if (departure <= arrival) {
      setError(language === 'ar' ? 'يجب أن يكون تاريخ المغادرة بعد تاريخ الوصول' : 'Departure date must be after arrival date');
      return;
    }

    setStayDuration({ arrivalDate, departureDate });
    handleDismiss();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" dir={direction}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleDismiss}
          className="absolute inset-0 bg-background/80 backdrop-blur-xl"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-surface-container-high border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl font-headline"
        >
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className={`absolute top-5 ${direction === 'rtl' ? 'left-5' : 'right-5'} text-white/40 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors`}
            title={language === 'ar' ? 'إغلاق والتصفح كزائر' : 'Close and browse as guest'}
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>

          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-primary/20">
              <span className="material-symbols-outlined text-primary text-2xl">hotel</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-on-surface uppercase tracking-tight">
              {t('stay.welcome')}
            </h2>
            <p className="text-white/50 text-xs mt-1">
              {t('stay.desc')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/50 px-1">{t('stay.arrival')}</label>
              <div className="relative">
                <span className={`material-symbols-outlined absolute ${
                  direction === 'rtl' ? 'right-3.5' : 'left-3.5'
                } top-1/2 -translate-y-1/2 text-white/30 text-sm pointer-events-none`}>
                  login
                </span>
                <input
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 text-xs text-white focus:outline-none focus:border-primary transition-colors ${
                    direction === 'rtl' ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
                  }`}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/50 px-1">{t('stay.departure')}</label>
              <div className="relative">
                <span className={`material-symbols-outlined absolute ${
                  direction === 'rtl' ? 'right-3.5' : 'left-3.5'
                } top-1/2 -translate-y-1/2 text-white/30 text-sm pointer-events-none`}>
                  logout
                </span>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 text-xs text-white focus:outline-none focus:border-primary transition-colors ${
                    direction === 'rtl' ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
                  }`}
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-error text-xs font-medium text-center">
                {error}
              </p>
            )}

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-on-primary font-black uppercase tracking-wider py-3.5 rounded-xl text-xs transition-all shadow-lg shadow-primary/20"
              >
                {t('stay.confirm')}
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="w-full py-2.5 text-xs text-white/40 hover:text-white transition-colors"
              >
                {t('stay.browse_first')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StayDurationModal;
