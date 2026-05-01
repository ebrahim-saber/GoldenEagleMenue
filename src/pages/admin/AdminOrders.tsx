import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRAWAQ, type Order } from '../../hooks/useRAWAQ';
import { useNotification } from '../../context/NotificationContext';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const AdminOrders = () => {
  const { orders, updateOrderStatus, loading } = useRAWAQ();
  const { showNotification } = useNotification();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  const handleUpdateStatus = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatus(orderId, status);
      showNotification('تم تحديث حالة الطلب بنجاح', 'success');
    } catch (err) {
      showNotification('فشل تحديث حالة الطلب', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'preparing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'ready': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'served': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'قيد الانتظار';
      case 'preparing': return 'جاري التحضير';
      case 'ready': return 'جاهز للتقديم';
      case 'served': return 'تم التقديم';
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
          <h2 className="text-4xl font-headline font-black tracking-tight text-white">إدارة الطلبات</h2>
          <p className="text-white/40 font-body text-sm mt-2">تتبع وإدارة جميع طلبات المطعم في الوقت الفعلي</p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
          {['all', 'pending', 'preparing', 'ready', 'served'].map((status) => (
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

      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.map((order) => (
          <motion.div
            key={order.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] transition-all group"
          >
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex gap-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                  <span className="text-2xl font-black">{order.table_number}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-black text-white">{order.customer_name}</h3>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <p className="text-xs text-white/40">
                    رقم الطلب: #{order.id.slice(0, 8)} • {format(new Date(order.created_at), 'HH:mm', { locale: ar })}
                  </p>
                  <p className="text-xs text-white/40">{order.customer_phone}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {order.status === 'pending' && (
                  <button 
                    onClick={() => handleUpdateStatus(order.id, 'preparing')}
                    className="px-6 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all"
                  >
                    بدء التحضير
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button 
                    onClick={() => handleUpdateStatus(order.id, 'ready')}
                    className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all"
                  >
                    جاهز للتقديم
                  </button>
                )}
                {order.status === 'ready' && (
                  <button 
                    onClick={() => handleUpdateStatus(order.id, 'served')}
                    className="px-6 py-2.5 bg-slate-600 text-white text-xs font-bold rounded-xl hover:bg-slate-700 transition-all"
                  >
                    تم التوصيل
                  </button>
                )}
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="px-6 py-2.5 bg-white/5 text-white text-xs font-bold rounded-xl hover:bg-white/10 transition-all border border-white/5"
                >
                  تفاصيل الفاتورة
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
            <span className="material-symbols-outlined text-4xl text-white/10 mb-4">receipt_long</span>
            <p className="text-white/20 font-bold">لا توجد طلبات في هذا القسم</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-surface-container-low rounded-[32px] border border-white/5 p-8 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black text-white">تفاصيل الطلب</h3>
                  <p className="text-xs text-white/40 mt-1">طاولة رقم {selectedOrder.table_number}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-white/20 hover:text-white transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5">
                  <div className="space-y-4">
                    {selectedOrder.order_items?.map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 flex items-center justify-center bg-primary/10 text-primary rounded text-[10px] font-black">
                            {item.quantity}x
                          </span>
                          <span className="text-sm font-bold text-white">{item.menu_items?.name}</span>
                        </div>
                        <span className="text-sm font-black text-tertiary">{item.price_at_time * item.quantity} ريال</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                    <span className="text-lg font-black text-white">المجموع الإجمالي</span>
                    <span className="text-2xl font-black text-primary">{selectedOrder.total_amount} ريال</span>
                  </div>
                </div>

                {selectedOrder.note && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">ملاحظة العميل</p>
                    <p className="text-sm text-white/80 italic">"{selectedOrder.note}"</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                    <p className="text-[10px] font-black text-white/20 uppercase mb-1">اسم العميل</p>
                    <p className="text-sm font-bold text-white">{selectedOrder.customer_name}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                    <p className="text-[10px] font-black text-white/20 uppercase mb-1">رقم الهاتف</p>
                    <p className="text-sm font-bold text-white">{selectedOrder.customer_phone}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button 
                  onClick={() => window.print()}
                  className="w-full py-4 bg-white text-black rounded-2xl font-black text-sm hover:bg-white/90 transition-all flex items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined text-lg">print</span>
                  طباعة الفاتورة
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
