import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import { useRAWAQ } from '../hooks/useRAWAQ';
import { useAuth } from '../context/AuthContext';

const Reservations = () => {
  const { showNotification } = useNotification();
  const { createReservation } = useRAWAQ();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(14);
  const [selectedTime, setSelectedTime] = useState('19:30');
  const [guests, setGuests] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const times = ['18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

  const handleConfirm = async () => {
    if (!formData.name || !formData.email) {
      showNotification('Please fill in your legal name and contact email.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const year = new Date().getFullYear();
      const month = '10'; // October
      const dateStr = `${year}-${month}-${selectedDate.toString().padStart(2, '0')}`;
      
      await createReservation({
        customer_id: user?.id,
        guest_name: formData.name,
        guest_email: formData.email,
        guest_phone: formData.phone,
        guest_count: guests,
        date: dateStr,
        time: selectedTime,
        notes: formData.notes
      });

      setIsSuccess(true);
      showNotification('Reservation secured. Welcome to RAWAQ.', 'success');
    } catch (err) {
      showNotification('Bespoke booking failed. Please contact the concierge.', 'error');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 mt-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full text-center space-y-12"
        >
          <div className="relative">
             <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               transition={{ type: "spring", damping: 12, delay: 0.2 }}
               className="w-32 h-32 bg-primary/20 rounded-full mx-auto flex items-center justify-center border border-primary/20"
             >
               <span className="material-symbols-outlined text-primary text-5xl">check_circle</span>
             </motion.div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-headline font-black uppercase tracking-tighter text-on-surface">Confirmed</h1>
            <p className="text-white/40 text-sm uppercase tracking-[0.3em] font-bold leading-relaxed max-w-sm mx-auto">
              Your table is prepared for Saturday, Oct {selectedDate} at {selectedTime}.
            </p>
          </div>

          <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] divide-y divide-white/5">
             <div className="flex justify-between py-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Guest Host</span>
                <span className="text-sm font-black text-on-surface uppercase">{formData.name}</span>
             </div>
             <div className="flex justify-between py-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Attendance</span>
                <span className="text-sm font-black text-on-surface uppercase">{guests} {guests === 1 ? 'Solo' : 'Guests'}</span>
             </div>
          </div>

          <button 
            onClick={() => window.location.href = '/'}
            className="w-full py-6 rounded-2xl bg-white/[0.03] border border-white/5 text-white/40 font-black uppercase tracking-[0.4em] text-[10px] hover:text-white hover:border-white/10 transition-all"
          >
            Return to Grand Lobby
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface font-headline min-h-screen">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative h-[80vh] flex items-end pb-32 overflow-hidden">
        <motion.div
           initial={{ scale: 1.1, opacity: 0 }}
           animate={{ scale: 1, opacity: 0.4 }}
           transition={{ duration: 2.5 }}
           className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1920&q=80" 
            alt="Rawaq Atmosphere" 
            className="w-full h-full object-cover grayscale"
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
        
        <div className="relative z-10 px-6 md:px-12 max-w-[1920px] mx-auto w-full space-y-10">
          <div className="flex items-center gap-6 text-tertiary text-[10px] font-black tracking-[0.6em] uppercase">
            <span className="w-12 h-[1px] bg-tertiary"></span>
            <span>Private Experiences</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[clamp(3rem,10vw,9rem)] font-black tracking-tighter uppercase leading-[0.85] text-on-surface"
          >
            Reserve Your <br/><span className="text-gradient-gold italic font-light">Moment</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/30 uppercase text-[10px] tracking-[0.3em] max-w-xl font-bold leading-relaxed"
          >
            Allow our maître d' to curate an evening of unmatched culinary distinction at the Imperial Plaza — Rawaq Private Vaults.
          </motion.p>
        </div>
      </section>

      {/* ── Booking Engine ──────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-6 -mt-32 pb-40 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Settings Column */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Step 1: Time Selection */}
            <div className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-12 backdrop-blur-3xl shadow-2xl space-y-16">
              <div className="flex items-center gap-8">
                <span className="text-primary font-black text-5xl opacity-10">01</span>
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter text-on-surface">Temporal Selection</h2>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold mt-1">Select your service window</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-20">
                {/* Visual Calendar */}
                <div className="space-y-8">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-tertiary font-black uppercase tracking-[0.3em] text-[10px]">October 2024</span>
                    <div className="flex gap-4">
                      <button className="text-white/20 hover:text-white transition-colors material-symbols-outlined text-sm">west</button>
                      <button className="text-white/20 hover:text-white transition-colors material-symbols-outlined text-sm">east</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-[9px] text-white/10 uppercase font-black mb-4">
                    <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {[...Array(31)].map((_, i) => {
                      const day = i + 1;
                      const isSelected = selectedDate === day;
                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedDate(day)}
                          className={`aspect-square flex items-center justify-center rounded-2xl text-[10px] transition-all relative group/day ${
                            isSelected 
                              ? 'bg-primary text-on-primary font-black shadow-[0_10px_30px_-10px_rgba(255,255,255,0.3)] z-10' 
                              : 'text-white/30 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {day}
                          {isSelected && (
                            <motion.div layoutId="calendarHighlight" className="absolute inset-0 border-2 border-primary/40 rounded-2xl animate-pulse" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Clock Slots */}
                <div className="space-y-10">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Available Services</label>
                  <div className="grid grid-cols-2 gap-4">
                    {times.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-5 px-6 rounded-[1.5rem] border transition-all text-[11px] font-black uppercase tracking-widest ${
                          selectedTime === time
                            ? 'bg-on-surface text-surface border-on-surface shadow-2xl'
                            : 'bg-transparent border-white/5 text-white/30 hover:border-primary/40'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  <div className="p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                    <p className="text-[9px] text-white/20 uppercase tracking-widest font-bold leading-relaxed">
                      All slots are subject to 15-minute grace transitions after the hour.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Information */}
            <div className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-12 backdrop-blur-3xl shadow-2xl space-y-16">
              <div className="flex items-center gap-8">
                <span className="text-primary font-black text-5xl opacity-10">02</span>
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter text-on-surface">Client Information</h2>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold mt-1">Imperial registry details</p>
                </div>
              </div>

              <div className="space-y-12">
                <div className="space-y-6">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Imperial Attendance</label>
                  <div className="flex flex-wrap gap-4">
                    {[1, 2, 3, 4, 5, 6, '8+'].map((num) => (
                      <button
                        key={num}
                        onClick={() => typeof num === 'number' && setGuests(num)}
                        className={`min-w-[4.5rem] h-16 rounded-[1.5rem] flex items-center justify-center border transition-all text-xs font-black ${
                          guests === num
                            ? 'bg-primary text-on-primary border-primary shadow-2xl scale-105'
                            : 'bg-white/[0.03] border-white/5 text-white/30 hover:text-white hover:border-white/20'
                        }`}
                      >
                        {num === 1 ? 'Solo' : num}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-12 pt-8">
                  <div className="space-y-4">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] ml-2">Full Legal Name</label>
                    <input 
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-transparent border-b-2 border-white/5 py-4 text-on-surface placeholder:text-white/5 focus:border-primary outline-none text-xl transition-all font-light" 
                      placeholder="e.g. Alexander Sterling" 
                      type="text" 
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] ml-2">Digital Contact</label>
                    <input 
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-transparent border-b-2 border-white/5 py-4 text-on-surface placeholder:text-white/5 focus:border-primary outline-none text-xl transition-all font-light" 
                      placeholder="sterling@vault.com" 
                      type="email" 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] ml-2">Gastronomic Deviations / Notes</label>
                  <textarea 
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-8 text-on-surface placeholder:text-white/5 focus:border-primary/30 outline-none text-lg transition-all h-40 resize-none font-light" 
                    placeholder="Allergies, seating preferences, or special requests..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Summary Card ──────────────────────────────────────────────────── */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <div className="bg-white/[0.03] rounded-[3rem] p-12 border border-white/10 backdrop-blur-xl relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[100px] -mr-20 -mt-20"></div>
                
                <div className="flex items-center gap-4 mb-16">
                  <div className="w-1.5 h-10 bg-tertiary rounded-full"></div>
                  <h3 className="text-xs font-black text-tertiary uppercase tracking-[0.5em]">Bespoke <br/>Summary</h3>
                </div>
                
                <div className="space-y-12">
                  <div className="flex items-start gap-8 group">
                    <span className="material-symbols-outlined text-primary text-2xl mt-1 opacity-40 group-hover:opacity-100 transition-opacity">event_seat</span>
                    <div className="space-y-2">
                      <p className="text-[9px] text-white/20 uppercase tracking-widest font-black">Service Date</p>
                      <p className="text-2xl font-black text-on-surface uppercase tracking-tighter">Oct {selectedDate}, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-8 group">
                    <span className="material-symbols-outlined text-primary text-2xl mt-1 opacity-40 group-hover:opacity-100 transition-opacity">schedule</span>
                    <div className="space-y-2">
                      <p className="text-[9px] text-white/20 uppercase tracking-widest font-black">Entry Time</p>
                      <p className="text-2xl font-black text-on-surface tracking-tighter">{selectedTime}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-8 group">
                    <span className="material-symbols-outlined text-primary text-2xl mt-1 opacity-40 group-hover:opacity-100 transition-opacity">wine_bar</span>
                    <div className="space-y-2">
                      <p className="text-[9px] text-white/20 uppercase tracking-widest font-black">Party Size</p>
                      <p className="text-2xl font-black text-on-surface tracking-tighter">{guests} {guests === 1 ? 'Guest' : 'Guests'}</p>
                    </div>
                  </div>

                  <div className="pt-16 border-t border-white/10 space-y-10">
                    <button 
                      onClick={handleConfirm}
                      disabled={isSubmitting}
                      className="w-full py-8 bg-primary text-on-primary font-black uppercase tracking-[0.5em] text-[10px] rounded-3xl hover:brightness-110 shadow-[0_20px_50px_rgba(255,255,255,0.1)] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                    >
                      {isSubmitting ? 'Securing Vault...' : 'Confirm Reservation'}
                    </button>
                    
                    <div className="text-center space-y-4">
                      <p className="text-[9px] text-white/15 leading-relaxed uppercase tracking-widest font-bold">
                         Secure 256-bit encrypted booking process
                      </p>
                      <div className="flex justify-center gap-4 text-white/10">
                         <span className="material-symbols-outlined text-sm">security</span>
                         <span className="material-symbols-outlined text-sm">verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Note */}
              <div className="bg-surface-container-low rounded-[2rem] p-10 border border-white/5 flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-tertiary/20 transition-all duration-700 shrink-0">
                  <span className="material-symbols-outlined text-tertiary text-xl">auto_awesome</span>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface font-black uppercase tracking-widest mb-1">Vault Membership</p>
                  <p className="text-[9px] text-white/20 uppercase tracking-tighter font-bold leading-relaxed">Reservations grant executive access to <br/>the Obsidian Lounge.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reservations;
