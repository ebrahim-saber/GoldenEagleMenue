import { useState } from 'react';

import { useRAWAQ, type Reservation } from '../../hooks/useRAWAQ';
import { useNotification } from '../../context/NotificationContext';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const AdminReservations = () => {
  const { reservations, updateReservationStatus, loading } = useRAWAQ();
  const { showNotification } = useNotification();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredReservations = filterStatus === 'all' 
    ? reservations 
    : reservations.filter(r => r.status === filterStatus);

  const handleUpdateStatus = async (id: string, status: Reservation['status']) => {
    try {
      await updateReservationStatus(id, status);
      showNotification('تم تحديث حالة الحجز بنجاح', 'success');
    } catch (err) {
      showNotification('فشل تحديث حالة الحجز', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'confirmed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'cancelled': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'قيد المراجعة';
      case 'confirmed': return 'مؤكد';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-8 space-y-8" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-headline font-black tracking-tight text-white">إدارة الحجوزات</h2>
          <p className="text-white/40 font-body text-sm mt-2">إدارة وتنظيم حجوزات الطاولات والضيوف</p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
          {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
            <button 
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all ${
                filterStatus === status ? 'bg-primary text-on-primary' : 'text-white/40 hover:text-white'
              }`}
            >
              {status === 'all' ? 'الكل' : getStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-white/[0.03]">
                <th className="px-8 py-5 text-xs font-black text-white/40 uppercase tracking-widest">الضيف</th>
                <th className="px-8 py-5 text-xs font-black text-white/40 uppercase tracking-widest text-center">عدد الأفراد</th>
                <th className="px-8 py-5 text-xs font-black text-white/40 uppercase tracking-widest">التاريخ والوقت</th>
                <th className="px-8 py-5 text-xs font-black text-white/40 uppercase tracking-widest">الحالة</th>
                <th className="px-8 py-5 text-xs font-black text-white/40 uppercase tracking-widest text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredReservations.map((res) => (
                <tr key={res.id} className="hover:bg-white/[0.01] transition-all group">
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="font-black text-white">{res.guest_name}</p>
                      <p className="text-xs text-white/20">{res.guest_phone} • {res.guest_email}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                      <span className="material-symbols-outlined text-sm text-tertiary">groups</span>
                      <span className="text-sm font-black text-white">{res.guest_count}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">
                        {format(new Date(res.date), 'dd MMMM yyyy', { locale: ar })}
                      </p>
                      <p className="text-xs text-primary font-black uppercase tracking-widest">{res.time}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border transition-all ${getStatusColor(res.status)}`}>
                      {getStatusLabel(res.status)}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-left">
                    <div className="flex justify-start gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {res.status !== 'confirmed' && (
                        <button 
                          onClick={() => handleUpdateStatus(res.id, 'confirmed')}
                          className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
                        >
                          <span className="material-symbols-outlined text-lg">check</span>
                        </button>
                      )}
                      {res.status !== 'cancelled' && (
                        <button 
                          onClick={() => handleUpdateStatus(res.id, 'cancelled')}
                          className="w-10 h-10 rounded-xl bg-white/5 text-rose-500 border border-rose-500/20 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                        >
                          <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReservations.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-white/10 italic text-sm font-bold">
                    لا توجد حجوزات لعرضها في هذا القسم
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
