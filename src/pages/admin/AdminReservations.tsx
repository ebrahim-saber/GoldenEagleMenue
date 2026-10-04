import { useState } from 'react';
import { useRAWAQ, type Reservation } from '../../hooks/useRAWAQ';
import { useNotification } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';

const AdminReservations = () => {
  const { reservations, updateReservationStatus, loading } = useRAWAQ();
  const { showNotification } = useNotification();
  const { direction, t, language } = useLanguage();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredReservations = filterStatus === 'all' 
    ? reservations 
    : reservations.filter(r => r.status === filterStatus);

  const handleUpdateStatus = async (id: string, status: Reservation['status']) => {
    try {
      await updateReservationStatus(id, status);
      showNotification(language === 'ar' ? 'تم تحديث حالة الحجز بنجاح' : 'Reservation status updated successfully', 'success');
    } catch {
      showNotification(language === 'ar' ? 'فشل تحديث حالة الحجز' : 'Failed to update reservation status', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'confirmed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'cancelled': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return language === 'ar' ? 'قيد المراجعة' : 'Pending Review';
      case 'confirmed': return language === 'ar' ? 'مؤكد' : 'Confirmed';
      case 'cancelled': return language === 'ar' ? 'ملغي' : 'Cancelled';
      default: return status;
    }
  };

  const formatSafeDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  if (loading && reservations.length === 0) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 sm:p-8 space-y-6 font-headline" dir={direction}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase">
            {t('admin.reservations_management')}
          </h2>
          <p className="text-white/40 text-xs mt-1">
            {language === 'ar' ? 'متابعة وتأكيد حجوزات الضيوف والأجنحة الخاصة' : 'Track and confirm guest dining and suite bookings'}
          </p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 overflow-x-auto hide-scrollbar">
          {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
            <button 
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                filterStatus === status ? 'bg-primary text-on-primary shadow-sm' : 'text-white/40 hover:text-white'
              }`}
            >
              {status === 'all' ? (language === 'ar' ? 'الكل' : 'All') : getStatusLabel(status)} ({status === 'all' ? reservations.length : reservations.filter(r => r.status === status).length})
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface-container-low border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className={`w-full border-collapse text-xs ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
            <thead>
              <tr className="bg-white/5 text-white/40 border-b border-white/5">
                <th className="px-6 py-4 font-bold">{t('res.step2_sub')}</th>
                <th className="px-6 py-4 font-bold text-center">{t('res.party_size')}</th>
                <th className="px-6 py-4 font-bold">{t('res.service_date')}</th>
                <th className="px-6 py-4 font-bold text-center">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="px-6 py-4 font-bold text-end">{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredReservations.map((res) => (
                <tr key={res.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-white text-sm">{res.guest_name}</p>
                    <p className="text-[11px] text-white/40">{res.guest_phone} · {res.guest_email}</p>
                    {res.notes && (
                      <p className="text-[11px] text-amber-300/80 mt-1 italic">"{res.notes}"</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 rounded-lg font-bold text-white">
                      <span className="material-symbols-outlined text-sm text-tertiary">group</span>
                      <span>{res.guest_count}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-white">{formatSafeDate(res.date)}</p>
                    <p className="text-primary font-bold text-[11px]">{res.time}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(res.status)}`}>
                      {getStatusLabel(res.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-end">
                    <div className="flex justify-end gap-2">
                      {res.status !== 'confirmed' && (
                        <button 
                          onClick={() => handleUpdateStatus(res.id, 'confirmed')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all"
                        >
                          {language === 'ar' ? 'تأكيد' : 'Confirm'}
                        </button>
                      )}
                      {res.status !== 'cancelled' && (
                        <button 
                          onClick={() => handleUpdateStatus(res.id, 'cancelled')}
                          className="px-3 py-1.5 bg-white/5 hover:bg-rose-500/20 text-white/50 hover:text-rose-400 font-bold rounded-lg transition-all"
                        >
                          {language === 'ar' ? 'إلغاء' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReservations.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-white/30 font-bold">
                    {language === 'ar' ? 'لا توجد طلبات حجز مسجلة في هذا القسم' : 'No reservations recorded in this category'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReservations;
