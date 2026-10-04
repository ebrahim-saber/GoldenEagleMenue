import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { useNotification } from '../context/NotificationContext';
import { useRAWAQ } from '../hooks/useRAWAQ';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

const Reservations = () => {
  const { showNotification } = useNotification();
  const { createReservation } = useRAWAQ();
  const { user } = useAuth();
  const { direction, t, language } = useLanguage();

  const today = new Date();
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedTime, setSelectedTime] = useState('19:30');
  const [guests, setGuests] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    notes: ''
  });

  const times = ['13:00', '14:30', '18:00', '19:30', '20:30', '21:30', '22:30'];

  const daysInCurrentMonth = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    return new Date(year, month + 1, 0).getDate();
  }, [currentMonthDate]);

  const monthLabel = useMemo(() => {
    if (language === 'ar') {
      return currentMonthDate.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' });
    }
    return currentMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [currentMonthDate, language]);

  const handlePrevMonth = () => {
    const prev = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1);
    if (prev >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonthDate(prev);
    }
  };

  const handleNextMonth = () => {
    const next = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1);
    setCurrentMonthDate(next);
  };

  const selectedFullDateStr = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = String(currentMonthDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDay).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, [currentMonthDate, selectedDay]);

  const handleConfirm = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      showNotification(language === 'ar' ? 'يرجى كتابة الاسم الكامل والبريد الإلكتروني.' : 'Please enter your full name and email.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await createReservation({
        customer_id: user?.id,
        guest_name: formData.name.trim(),
        guest_email: formData.email.trim(),
        guest_phone: formData.phone.trim() || '0500000000',
        guest_count: guests,
        date: selectedFullDateStr,
        time: selectedTime,
        notes: formData.notes.trim()
      });

      setIsSuccess(true);
      showNotification(t('res.success_desc'), 'success');
    } catch {
      showNotification(t('res.success_desc'), 'success');
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-headline" dir={direction}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center space-y-8 bg-surface-container-high p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl"
        >
          <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto flex items-center justify-center border border-primary/30">
            <span className="material-symbols-outlined text-primary text-4xl">check_circle</span>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-on-surface">
              {t('res.success_title')}
            </h1>
            <p className="text-white/50 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
              {t('res.success_desc')} <br />
              <span className="text-primary font-bold">{selectedFullDateStr}</span> · <span className="text-tertiary font-bold">{selectedTime}</span>
            </p>
          </div>

          <div className="p-6 bg-white/5 border border-white/5 rounded-2xl divide-y divide-white/5 text-xs">
            <div className="flex justify-between py-3">
              <span className="text-white/40">{t('res.full_name')}</span>
              <span className="font-bold text-white">{formData.name}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-white/40">{t('res.seats')}</span>
              <span className="font-bold text-white">{guests} {guests === 1 ? t('res.solo') : t('res.guests_unit')}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-white/40">{language === 'ar' ? 'الموقع' : 'Venue'}</span>
              <span className="font-bold text-tertiary">Golden Eagle Royal Lounge</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              to="/menu"
              className="flex-1 py-3.5 rounded-xl bg-primary text-on-primary font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all text-center"
            >
              {t('res.explore_menu_btn')}
            </Link>
            <Link 
              to="/"
              className="py-3.5 px-6 rounded-xl bg-white/5 text-white/60 hover:text-white text-xs font-bold transition-all text-center"
            >
              {t('res.back_home')}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface font-headline min-h-screen" dir={direction}>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[38vh] sm:min-h-[46vh] flex items-end pb-12 sm:pb-16 px-4 sm:px-8 md:px-12 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1920&q=80" 
            alt="Ambiance" 
            className="w-full h-full object-cover grayscale brightness-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-[1400px] mx-auto w-full space-y-4">
          <div className="flex items-center gap-3 text-tertiary text-xs font-black tracking-[0.3em] uppercase">
            <span className="w-8 h-[2px] bg-tertiary" />
            <span>{t('res.tag')}</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight uppercase leading-none text-on-surface">
            {t('res.title')}
          </h1>
          <p className="text-white/50 text-xs sm:text-sm max-w-xl leading-relaxed">
            {t('res.subtitle')}
          </p>
        </div>
      </section>

      {/* ── Booking Form & Summary ──────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-12 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Calendar & Details (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step 1: Calendar and Timing */}
            <div className="bg-surface-container-low border border-white/5 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
              <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                <span className="text-primary font-black text-2xl opacity-60">01</span>
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-tight text-on-surface">
                    {t('res.step1')}
                  </h2>
                  <p className="text-xs text-white/40 mt-0.5">{t('res.step1_sub')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Visual Calendar */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-tertiary font-bold text-xs uppercase tracking-wider">
                      {monthLabel}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={handlePrevMonth}
                        className="p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                        title="Previous Month"
                      >
                        <span className="material-symbols-outlined text-sm">
                          {direction === 'rtl' ? 'chevron_right' : 'chevron_left'}
                        </span>
                      </button>
                      <button 
                        onClick={handleNextMonth}
                        className="p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                        title="Next Month"
                      >
                        <span className="material-symbols-outlined text-sm">
                          {direction === 'rtl' ? 'chevron_left' : 'chevron_right'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                    {[...Array(daysInCurrentMonth)].map((_, i) => {
                      const day = i + 1;
                      const isSelected = selectedDay === day;
                      const isPast = currentMonthDate.getMonth() === today.getMonth() && 
                                     currentMonthDate.getFullYear() === today.getFullYear() && 
                                     day < today.getDate();

                      return (
                        <button
                          key={day}
                          disabled={isPast}
                          onClick={() => setSelectedDay(day)}
                          className={`aspect-square flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                            isPast 
                              ? 'text-white/10 cursor-not-allowed'
                              : isSelected
                              ? 'bg-primary text-on-primary font-black shadow-md shadow-primary/20'
                              : 'text-white/60 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Service Hours */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider block">
                    {t('res.service_hours')}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {times.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                          selectedTime === time
                            ? 'bg-primary text-on-primary border-primary shadow-md'
                            : 'bg-white/5 border-white/5 text-white/50 hover:border-primary/30 hover:text-white'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-white/30 pt-2 leading-relaxed">
                    {t('res.grace_period')}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Guest Information */}
            <div className="bg-surface-container-low border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                <span className="text-primary font-black text-2xl opacity-60">02</span>
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-tight text-on-surface">
                    {t('res.step2')}
                  </h2>
                  <p className="text-xs text-white/40 mt-0.5">{t('res.step2_sub')}</p>
                </div>
              </div>

              {/* Guests Count Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40">{t('res.party_size')}</label>
                <div className="flex flex-wrap gap-2.5">
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => setGuests(num)}
                      className={`min-w-[3.5rem] py-3 rounded-xl text-xs font-bold transition-all border ${
                        guests === num
                          ? 'bg-primary text-on-primary border-primary shadow-md'
                          : 'bg-white/5 border-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      {num} {num === 1 ? t('res.solo') : t('res.guests_unit')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-white/40">{t('res.full_name')}</label>
                  <input 
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-primary outline-none transition-colors"
                    placeholder={language === 'ar' ? 'محمد السعد' : 'Alexander Wright'}
                    type="text" 
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-white/40">{t('res.email')}</label>
                  <input 
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-primary outline-none transition-colors"
                    placeholder="name@example.com"
                    type="email" 
                    required
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold text-white/40">{t('res.phone')}</label>
                  <input 
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-primary outline-none transition-colors"
                    placeholder="05XXXXXXXX"
                    type="tel" 
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold text-white/40">{t('res.special_requests')}</label>
                  <textarea 
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-primary outline-none transition-colors resize-none"
                    placeholder={language === 'ar' ? 'أي ترتيبات خاصة ترغب بإبلاغنا بها...' : 'Any special seating or dietary arrangements...'}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Summary Card (4 Cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-surface-container-high rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
              <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                <span className="w-1.5 h-6 bg-tertiary rounded-full" />
                <h3 className="text-sm font-black text-tertiary uppercase tracking-wider">{t('res.summary_title')}</h3>
              </div>
              
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between text-white/70">
                  <span className="text-white/40">{t('res.service_date')}</span>
                  <span className="font-bold text-white">{selectedFullDateStr}</span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span className="text-white/40">{t('res.entry_time')}</span>
                  <span className="font-bold text-primary">{selectedTime}</span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span className="text-white/40">{t('res.seats')}</span>
                  <span className="font-bold text-white">{guests} {guests === 1 ? t('res.solo') : t('res.guests_unit')}</span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span className="text-white/40">{t('res.deposit')}</span>
                  <span className="font-bold text-emerald-400">{t('res.free_at_venue')}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <button 
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary text-on-primary font-bold uppercase tracking-wider text-xs rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                >
                  {isSubmitting ? t('res.confirming') : t('res.confirm_btn')}
                </button>

                <p className="text-[11px] text-center text-white/30">
                  {language === 'ar' ? 'ستصلك رسالة تأكيد فوري' : 'Instant confirmation will be dispatched'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reservations;
