import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRAWAQ, type Reservation } from '../../hooks/useRAWAQ';
import { notificationService } from '../../services/notificationService';
import { useNotification } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';

const AdminDashboard = () => {
  const { orders, reservations, updateOrderStatus, updateReservationStatus, loading } = useRAWAQ();
  const { showNotification } = useNotification();
  const { direction, t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'orders' | 'reservations'>('orders');

  const handleUpdateStatus = async (orderId: string, currentStatus: string) => {
    let nextStatus: 'pending' | 'preparing' | 'ready' | 'served' = 'pending';
    const status = currentStatus.toLowerCase();
    
    if (status === 'pending') nextStatus = 'preparing';
    else if (status === 'preparing') nextStatus = 'ready';
    else if (status === 'ready') nextStatus = 'served';

    try {
      await updateOrderStatus(orderId, nextStatus);
      
      if (nextStatus === 'preparing') {
        const order = orders.find(o => o.id === orderId);
        if (order) {
          notificationService.sendEmail({
            recipientEmail: 'guest@example.com',
            recipientName: order.customer_name,
            type: 'order_confirmed',
            id: orderId,
            details: `Order for table ${order.table_number} is now being prepared in the kitchen.`
          });
          showNotification(language === 'ar' ? 'تم إشعار العميل ببدء التحضير' : 'Guest notified of prep start', 'success');
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
        details: `Your royal table reservation for ${res.guest_count} guests on ${res.date} at ${res.time} has been confirmed.`
      });
      showNotification(language === 'ar' ? 'تم تأكيد الحجز وإرسال الإشعار' : 'Reservation confirmed and email dispatched', 'success');
    } catch (err) {
      console.error(err);
    }
  };

  const activeOrdersCount = orders.filter(o => o.status !== 'served').length;
  const preparingOrdersCount = orders.filter(o => o.status === 'preparing').length;

  if (loading && orders.length === 0) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 sm:p-8 space-y-8 font-headline" dir={direction}>
      {/* Overview Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase">
            {t('admin.overview')}
          </h2>
          <p className="text-white/40 text-xs mt-1">
            {t('admin.overview_sub')}
          </p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-5 sm:px-6 py-2.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'orders' ? 'bg-primary text-on-primary shadow-sm' : 'text-white/40 hover:text-white'
            }`}
          >
            {t('admin.live_orders')} ({activeOrdersCount})
          </button>
          <button 
            onClick={() => setActiveTab('reservations')}
            className={`px-5 sm:px-6 py-2.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'reservations' ? 'bg-tertiary text-on-surface shadow-sm font-black' : 'text-white/40 hover:text-white'
            }`}
          >
            {t('admin.today_reservations')} ({reservations.length})
          </button>
        </div>
      </div>

      {/* Tabs Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'orders' ? (
          <motion.div 
            key="orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {orders.filter(o => o.status !== 'served').map((order) => (
              <div
                key={order.id}
                className={`bg-surface-container-low p-5 rounded-2xl border ${
                  order.status === 'pending' ? 'border-amber-500/30 ring-1 ring-amber-500/10' : 'border-white/5'
                } hover:border-white/15 transition-all flex flex-col justify-between space-y-4`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xl font-black text-tertiary">
                        {language === 'ar' ? 'طاولة' : 'Table'} {order.table_number || '1'}
                      </span>
                      <p className="text-[10px] text-white/30 font-bold mt-0.5">
                        #{order.id.slice(0, 6)} · {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      order.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                      order.status === 'preparing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {order.status === 'pending'
                        ? t('admin.status_pending')
                        : order.status === 'preparing'
                        ? t('admin.status_preparing')
                        : t('admin.status_ready')}
                    </span>
                  </div>

                  {/* Order items summary */}
                  <div className="space-y-2 py-2 border-y border-white/5 text-xs text-white/80">
                    {order.order_items?.map((item, i: number) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="truncate">{item.menu_items?.name || (language === 'ar' ? 'صنف' : 'Item')}</span>
                        <span className="font-bold text-primary mx-2">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {order.note && (
                    <p className="mt-2 text-[11px] text-amber-300/80 bg-amber-500/10 p-2 rounded-lg">
                      {order.note}
                    </p>
                  )}
                </div>

                <button 
                  onClick={() => handleUpdateStatus(order.id, order.status)}
                  className="w-full bg-primary hover:bg-primary/90 text-on-primary py-2.5 text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  {order.status === 'pending'
                    ? t('admin.action_start_preparing')
                    : order.status === 'preparing'
                    ? t('admin.action_mark_ready')
                    : t('admin.action_mark_served')}
                </button>
              </div>
            ))}
            
            {activeOrdersCount === 0 && (
              <div className="col-span-full border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-12 text-white/30 space-y-2">
                <span className="material-symbols-outlined text-4xl">check_circle</span>
                <p className="text-xs font-bold uppercase tracking-wider">
                  {language === 'ar' ? 'لا توجد طلبات معلقة حالياً - الصالة جاهزة' : 'No active orders currently pending'}
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="reservations"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-surface-container-low border border-white/5 rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className={`w-full border-collapse text-xs ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                <thead>
                  <tr className="bg-white/5 border-b border-white/5 text-white/40">
                    <th className="px-6 py-4 font-bold">{t('res.full_name')}</th>
                    <th className="px-6 py-4 font-bold">{t('res.seats')}</th>
                    <th className="px-6 py-4 font-bold">{t('res.service_date')}</th>
                    <th className="px-6 py-4 font-bold">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                    <th className="px-6 py-4 font-bold">{language === 'ar' ? 'الإجراء' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-white">{res.guest_name}</p>
                        <p className="text-[11px] text-white/30">{res.guest_phone} · {res.guest_email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-white">{res.guest_count} {res.guest_count === 1 ? t('res.solo') : t('res.guests_unit')}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white font-bold">{res.date}</p>
                        <p className="text-primary text-[11px] font-bold">{res.time}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          res.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                          res.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                          'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}>
                          {res.status === 'confirmed' ? (language === 'ar' ? 'مؤكد' : 'Confirmed') :
                           res.status === 'pending' ? (language === 'ar' ? 'معلق' : 'Pending') :
                           (language === 'ar' ? 'ملغي' : 'Cancelled')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {res.status !== 'confirmed' && (
                            <button 
                              onClick={() => handleConfirmReservation(res)}
                              className="px-3 py-1.5 bg-primary text-on-primary text-xs font-bold rounded-lg hover:brightness-110 transition-all"
                            >
                              {language === 'ar' ? 'تأكيد الحجز' : 'Confirm'}
                            </button>
                          )}
                          {res.status !== 'cancelled' && (
                            <button 
                              onClick={() => updateReservationStatus(res.id, 'cancelled')}
                              className="px-3 py-1.5 bg-white/5 hover:bg-error/20 text-white/50 hover:text-error text-xs font-bold rounded-lg transition-all"
                            >
                              {language === 'ar' ? 'إلغاء' : 'Cancel'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {reservations.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-white/30 font-bold">
                        {language === 'ar' ? 'لا توجد حجوزات مسجلة حالياً' : 'No reservations recorded yet'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-white/5">
        {[
          { label: t('admin.live_orders'), value: activeOrdersCount.toString(), unit: language === 'ar' ? 'طلب الآن' : 'Active now', icon: 'speed', color: 'text-primary' },
          { label: language === 'ar' ? 'أطباق قيد التحضير' : 'In Kitchen Prep', value: preparingOrdersCount.toString(), unit: language === 'ar' ? 'في المطبخ' : 'Cooking', icon: 'local_fire_department', color: 'text-tertiary' },
          { label: t('admin.today_reservations'), value: reservations.length.toString(), unit: language === 'ar' ? 'حجز مسجل' : 'Bookings', icon: 'event_seat', color: 'text-white' },
          { label: language === 'ar' ? 'متوسط وقت التقديم' : 'Average Service Time', value: '18', unit: language === 'ar' ? 'دقيقة' : 'min', icon: 'timer', color: 'text-primary' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container-low p-5 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-white/40">
              <span className="text-xs font-bold">{stat.label}</span>
              <span className="material-symbols-outlined text-lg">{stat.icon}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black ${stat.color}`}>{stat.value}</span>
              <span className="text-xs text-white/30">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
