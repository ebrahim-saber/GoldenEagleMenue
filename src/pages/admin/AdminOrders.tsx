import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRAWAQ, type Order } from '../../hooks/useRAWAQ';
import { useNotification } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';

const AdminOrders = () => {
  const { orders, updateOrderStatus, loading } = useRAWAQ();
  const { showNotification } = useNotification();
  const { direction, t, language } = useLanguage();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  const handleUpdateStatus = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatus(orderId, status);
      showNotification(language === 'ar' ? 'تم تحديث حالة الطلب بنجاح' : 'Order status updated successfully', 'success');
    } catch {
      showNotification(language === 'ar' ? 'فشل تحديث حالة الطلب' : 'Failed to update order status', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'preparing': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'ready': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'served': return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return t('admin.status_pending');
      case 'preparing': return t('admin.status_preparing');
      case 'ready': return t('admin.status_ready');
      case 'served': return t('admin.status_served');
      default: return status;
    }
  };

  const formatOrderTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? '' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  if (loading && orders.length === 0) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 sm:p-8 space-y-6 font-headline" dir={direction}>
      {/* Header and Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white">
            {t('admin.orders_management')}
          </h2>
          <p className="text-white/40 text-xs mt-1">
            {t('admin.orders_sub')}
          </p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 overflow-x-auto hide-scrollbar">
          {[
            { id: 'all', label: t('admin.status_all') },
            { id: 'pending', label: t('admin.status_pending') },
            { id: 'preparing', label: t('admin.status_preparing') },
            { id: 'ready', label: t('admin.status_ready') },
            { id: 'served', label: t('admin.status_served') }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                filterStatus === tab.id ? 'bg-primary text-on-primary shadow-sm' : 'text-white/50 hover:text-white'
              }`}
            >
              {tab.label} ({tab.id === 'all' ? orders.length : orders.filter(o => o.status === tab.id).length})
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.map((order) => (
          <motion.div
            key={order.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-low border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex flex-col items-center justify-center text-primary border border-primary/20 shrink-0">
                  <span className="text-xs font-bold opacity-70">{t('nav.table')}</span>
                  <span className="text-base font-black leading-none">{order.table_number?.replace(/\D/g, '') || order.table_number || '1'}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-bold text-white">{order.customer_name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/40">
                    #{order.id.slice(0, 8)} · {formatOrderTime(order.created_at)} · {order.customer_phone || (language === 'ar' ? 'بدون هاتف' : 'No phone')}
                  </p>
                  <p className="text-xs font-bold text-tertiary">
                    {language === 'ar' ? 'المجموع' : 'Total'}: {order.total_amount} {t('currency')}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                {order.status === 'pending' && (
                  <button 
                    onClick={() => handleUpdateStatus(order.id, 'preparing')}
                    className="flex-1 md:flex-initial px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    {t('admin.action_start_preparing')}
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button 
                    onClick={() => handleUpdateStatus(order.id, 'ready')}
                    className="flex-1 md:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    {t('admin.action_mark_ready')}
                  </button>
                )}
                {order.status === 'ready' && (
                  <button 
                    onClick={() => handleUpdateStatus(order.id, 'served')}
                    className="flex-1 md:flex-initial px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    {t('admin.action_mark_served')}
                  </button>
                )}
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/80 text-xs font-bold rounded-xl transition-all border border-white/5"
                >
                  {t('admin.bill_details')}
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl space-y-2">
            <span className="material-symbols-outlined text-4xl text-white/20">receipt_long</span>
            <p className="text-white/40 text-xs font-bold">
              {language === 'ar' ? 'لا توجد طلبات في هذا القسم حالياً' : 'No orders found in this category'}
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" dir={direction}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-surface-container-high rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-xl font-black text-white">{t('admin.bill_details')}</h3>
                  <p className="text-xs text-white/40 mt-0.5">{t('nav.table')}: {selectedOrder.table_number}</p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)} 
                  className="p-1 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-3">
                  {selectedOrder.order_items?.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 flex items-center justify-center bg-primary/20 text-primary rounded text-[10px] font-black">
                          {item.quantity}x
                        </span>
                        <span className="text-white font-bold">{item.menu_items?.name || (language === 'ar' ? 'صنف طعام' : 'Dish')}</span>
                      </div>
                      <span className="font-bold text-tertiary">{item.price_at_time * item.quantity} {t('currency')}</span>
                    </div>
                  ))}
                  
                  <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                    <span className="text-xs font-black text-white">{t('checkout.final_total')}</span>
                    <span className="text-lg font-black text-primary">{selectedOrder.total_amount} {t('currency')}</span>
                  </div>
                </div>

                {selectedOrder.note && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs">
                    <p className="font-black text-amber-400 mb-0.5">{language === 'ar' ? 'ملاحظات العميل:' : 'Guest Notes:'}</p>
                    <p className="text-white/80">{selectedOrder.note}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <p className="text-white/30 text-[10px] mb-0.5">{t('checkout.guest_name')}</p>
                    <p className="font-bold text-white">{selectedOrder.customer_name}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <p className="text-white/30 text-[10px] mb-0.5">{t('checkout.guest_phone')}</p>
                    <p className="font-bold text-white">{selectedOrder.customer_phone || (language === 'ar' ? 'غير مسجل' : 'N/A')}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button 
                  onClick={() => window.print()}
                  className="w-full py-3 bg-white text-black rounded-xl font-bold text-xs hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">print</span>
                  {t('admin.print_bill')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;
