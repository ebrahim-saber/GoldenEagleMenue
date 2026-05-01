import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRAWAQ, type Reservation } from '../../hooks/useRAWAQ';
import { notificationService } from '../../services/notificationService';
import { useNotification } from '../../context/NotificationContext';

const AdminDashboard = () => {
  const { orders, reservations, updateOrderStatus, updateReservationStatus, loading } = useRAWAQ();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<'orders' | 'reservations'>('orders');

  const handleUpdateStatus = async (orderId: string, currentStatus: string) => {
    let nextStatus: 'pending' | 'preparing' | 'ready' | 'served' = 'pending';
    const status = currentStatus.toLowerCase();
    
    if (status === 'pending') nextStatus = 'preparing';
    else if (status === 'preparing') nextStatus = 'ready';
    else if (status === 'ready') nextStatus = 'served';

    try {
      await updateOrderStatus(orderId, nextStatus);
      
      // Notify guest on first update (Preparing)
      if (nextStatus === 'preparing') {
        const order = orders.find(o => o.id === orderId);
        if (order) {
          notificationService.sendEmail({
            recipientEmail: 'guest@example.com', // Managed in profiles in production
            recipientName: order.customer_name,
            type: 'order_confirmed',
            id: orderId,
            details: `Your order for table ${order.table_number} is now being prepared by our Chef.`
          });
          showNotification('Guest notified via Imperial Email.', 'success');
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleConfirmReservation = async (res: Reservation) => {
    try {
      await updateReservationStatus(res.id, 'confirmed');
      notificationService.sendEmail({
        recipientEmail: res.guest_email,
        recipientName: res.guest_name,
        type: 'reservation_confirmed',
        id: res.id,
        details: `Your imperial table for ${res.guest_count} guests on ${res.date} at ${res.time} has been secured.`
      });
      showNotification('Imperial confirmation sent.', 'success');
    } catch (err) {
      console.error(err);
    }
  };



  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-8 space-y-12" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-headline font-black tracking-tighter text-white uppercase">نظرة عامة</h2>
          <p className="text-white/40 font-headline text-xs uppercase tracking-widest mt-2 font-bold">
            متابعة أداء المطعم والطلبات المباشرة
          </p>
        </div>
        
        <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/5 font-headline">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-8 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
              activeTab === 'orders' ? 'bg-primary text-on-primary shadow-xl shadow-primary/10' : 'text-white/40 hover:text-white'
            }`}
          >
            الطلبات المباشرة ({orders.filter(o => o.status !== 'served').length})
          </button>
          <button 
            onClick={() => setActiveTab('reservations')}
            className={`px-8 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
              activeTab === 'reservations' ? 'bg-tertiary text-on-surface shadow-xl shadow-tertiary/10' : 'text-white/40 hover:text-white'
            }`}
          >
            حجوزات اليوم ({reservations.length})
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'orders' ? (
          <motion.div 
            key="orders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {orders.filter(o => o.status !== 'served').map((order) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-white/[0.02] p-6 rounded-2xl border ${
                  order.status === 'pending' ? 'border-error/20 ring-1 ring-error/5' : 'border-white/5'
                } hover:bg-white/[0.04] transition-all group relative overflow-hidden`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-3xl font-black text-tertiary font-headline">
                      طاولة {order.table_number || '??'}
                    </span>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">
                      #{order.id.slice(0, 4)} • {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    order.status === 'pending' ? 'bg-error/10 text-error border-error/20' :
                    order.status === 'preparing' ? 'bg-primary/10 text-primary border-primary/20' :
                    'bg-tertiary/10 text-tertiary border-tertiary/20'
                  }`}>
                    {order.status === 'pending' ? 'جديد' : order.status === 'preparing' ? 'يُحضر' : 'جاهز'}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {order.order_items?.map((item, i: number) => (
                    <div key={i} className="flex justify-between items-center text-white">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 flex items-center justify-center bg-white/5 rounded text-[10px] font-black text-tertiary">
                          {item.quantity}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider">
                          {item.menu_items?.name || 'صنف غير معروف'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {order.note && (
                  <div className="p-4 rounded-xl border-r-4 mb-6 bg-tertiary/10 border-tertiary font-headline">
                    <p className="text-[9px] font-black uppercase tracking-tighter mb-1 text-tertiary">ملاحظة</p>
                    <p className="text-xs text-white/80 font-medium leading-relaxed italic">"{order.note}"</p>
                  </div>
                )}

                <button 
                  onClick={() => handleUpdateStatus(order.id, order.status)}
                  className="w-full bg-primary text-on-primary py-3 text-[10px] font-black uppercase tracking-widest rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/10"
                >
                  {order.status === 'pending' ? 'قبول الطلب' : order.status === 'preparing' ? 'جاهز للتقديم' : 'تم التقديم والإغلاق'}
                </button>
              </motion.div>
            ))}
            
            <div className="border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center p-8 text-white/10 group hover:border-white/10 transition-all min-h-[250px] font-headline">
              <span className="material-symbols-outlined text-4xl mb-3 font-light group-hover:rotate-12 transition-transform">hourglass_empty</span>
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">في انتظار طلبات جديدة</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="reservations"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/[0.02] border border-white/5 rounded-[32px] overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-right font-headline border-collapse">
                <thead>
                  <tr className="bg-white/[0.03]">
                    <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest">تفاصيل الضيف</th>
                    <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest">الحضور</th>
                    <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest">التوقيت</th>
                    <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest">الحالة</th>
                    <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-white/[0.01] transition-all group">
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="font-black text-white uppercase tracking-wider">{res.guest_name}</p>
                          <p className="text-[10px] text-white/20 uppercase font-black">{res.guest_email}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-tertiary text-lg">group</span>
                          <span className="text-sm font-black text-white uppercase">{res.guest_count} أفراد</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="text-sm font-black text-white">{new Date(res.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          <p className="text-[10px] text-primary font-black tracking-widest uppercase">{res.time}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                          res.status === 'confirmed' ? 'bg-primary/10 text-primary border-primary/40' :
                          res.status === 'pending' ? 'bg-tertiary/10 text-tertiary border-tertiary/40' :
                          'bg-error/10 text-error border-error/40'
                        }`}>
                          {res.status === 'confirmed' ? 'مؤكد' : res.status === 'pending' ? 'معلق' : 'ملغي'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-start gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          {res.status !== 'confirmed' && (
                            <button 
                              onClick={() => handleConfirmReservation(res)}
                              className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
                            >
                              <span className="material-symbols-outlined text-lg">check</span>
                            </button>
                          )}
                          {res.status !== 'cancelled' && (
                            <button 
                              onClick={() => updateReservationStatus(res.id, 'cancelled')}
                              className="w-10 h-10 rounded-xl bg-white/5 text-error border border-error/20 flex items-center justify-center hover:bg-error hover:text-white transition-all shadow-lg"
                            >
                              <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {reservations.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-[10px] font-black uppercase tracking-[0.4em] text-white/10 italic">
                        لا توجد حجوزات لعرضها...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pt-12 border-t border-white/5">
        {[
          { label: 'الطلبات النشطة', value: orders.filter(o => o.status !== 'served').length.toString(), unit: 'الآن', icon: 'speed', trend: 'مباشر', trendColor: 'text-primary', chart: [30, 50, 40, 70, 60, 90] },
          { label: 'ضغط المطبخ', value: Math.min(orders.filter(o => o.status === 'preparing').length * 20 + 30, 95).toString(), unit: '%', icon: 'local_fire_department', trend: 'طبيعي', trendColor: 'text-primary', chart: [40, 45, 50, 48, 55, 60] },
          { label: 'وقت التحضير', value: '14', unit: 'دقيقة', icon: 'timer', trend: '-2 دقيقة', trendColor: 'text-primary', chart: [80, 75, 70, 65, 60, 55] },
          { label: 'إيراد اليوم', value: '14.2', unit: 'ألف', icon: 'payments', trend: '+12%', trendColor: 'text-primary', chart: [20, 40, 30, 70, 50, 95] },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/[0.01] p-8 rounded-2xl border border-white/5 group hover:bg-white/[0.03] transition-all relative overflow-hidden font-headline">
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">{stat.label}</span>
              <div className="h-10 w-24 opacity-20 group-hover:opacity-60 transition-opacity">
                <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={stat.icon === 'local_fire_department' ? 'text-error' : 'text-primary'}
                    points={stat.chart.map((val, idx) => `${idx * 20},${40 - val}`).join(' ')}
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-5xl font-black text-white tracking-tighter">{stat.value}</h3>
              <span className="text-sm font-bold text-white/20 uppercase tracking-widest">{stat.unit}</span>
            </div>
            <div className={`mt-4 text-[9px] font-black uppercase tracking-widest flex items-center ${stat.trendColor}`}>
              <span className={`material-symbols-outlined text-[10px] ml-2 ${stat.trend === 'مباشر' ? 'animate-pulse' : ''}`}>
                {stat.trend === 'مباشر' ? 'radio_button_checked' : 'trending_up'}
              </span>
              {stat.trend}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
