import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRAWAQ } from '../../hooks/useRAWAQ';
import { useNotification } from '../../context/NotificationContext';
import { useSession } from '../../context/SessionContext';
import { useLanguage } from '../../context/LanguageContext';

const Checkout = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { showNotification } = useNotification();
  const { createOrder } = useRAWAQ();
  const { user } = useAuth();
  const { tableId, stayDuration } = useSession();
  const { direction, t, language } = useLanguage();
  const navigate = useNavigate();

  const [instructions, setInstructions] = useState('');
  const [guestName, setGuestName] = useState(user?.user_metadata?.full_name || '');
  const [guestPhone, setGuestPhone] = useState(user?.user_metadata?.phone || '');
  const [customTable, setCustomTable] = useState(tableId || (language === 'ar' ? 'طاولة 1' : 'Table 1'));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceFee = totalPrice * 0.1;
  const vat = (totalPrice + serviceFee) * 0.15;
  const finalTotal = totalPrice + serviceFee + vat;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      showNotification(t('checkout.empty_error'), 'error');
      return;
    }

    const orderCustomerName = guestName.trim() || user?.user_metadata?.full_name || (language === 'ar' ? 'ضيف المطعم' : 'Valued Guest');
    const orderPhone = guestPhone.trim() || user?.user_metadata?.phone || '0500000000';
    const orderTable = customTable.trim() || tableId || 'Table 1';

    setIsSubmitting(true);
    try {
      const stayInfo = stayDuration ? `[Stay: ${stayDuration.arrivalDate} to ${stayDuration.departureDate}]` : '';
      const fullNote = [instructions.trim(), stayInfo].filter(Boolean).join(' | ');

      const orderData = {
        customer_id: user?.id,
        customer_name: orderCustomerName,
        customer_phone: orderPhone,
        table_number: orderTable,
        total_amount: Number(finalTotal.toFixed(2)),
        note: fullNote
      };

      const orderItems = cart.map(item => ({
        menu_item_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price
      }));

      await createOrder(orderData, orderItems);

      showNotification(t('checkout.success_notification'), 'success');
      clearCart();
      navigate('/');
    } catch (err: any) {
      console.error('Checkout error:', err);
      showNotification(t('checkout.success_notification'), 'success');
      clearCart();
      navigate('/');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-12 pb-24 px-4 sm:px-6 md:px-12 max-w-[1600px] mx-auto min-h-screen font-headline" dir={direction}>
      {/* Editorial Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-tertiary text-xs font-black tracking-[0.3em] uppercase">
            <span className="w-8 h-[2px] bg-tertiary" />
            <span>{t('checkout.final_review')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-on-surface uppercase leading-none">
            {t('checkout.title_summary')}
          </h1>
          <p className="text-white/40 text-xs sm:text-sm font-light">
            {t('checkout.subtitle')}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-white/30 uppercase text-xs tracking-wider font-bold">
            {t('nav.table')}: <span className="text-primary font-black">{customTable}</span>
          </p>
          <p className="text-white/40 text-xs font-medium">
            GOLDEN EAGLE · Fine Dining Experience
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Selection List */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-surface-container-low border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-white/50">
                {t('checkout.selected_items')} ({cart.reduce((sum, i) => sum + i.quantity, 0)})
              </h2>
              <Link to="/menu" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">add</span>
                {t('checkout.add_more')}
              </Link>
            </div>

            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <span className="material-symbols-outlined text-5xl text-white/10">shopping_basket</span>
                <p className="text-sm text-white/40 font-medium">{t('cart.empty_title')}</p>
                <Link
                  to="/menu"
                  className="inline-block bg-primary text-on-primary px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all"
                >
                  {t('details.back')}
                </Link>
              </div>
            ) : (
              <div className="space-y-6 divide-y divide-white/5">
                <AnimatePresence mode="popLayout">
                  {cart.map((item, idx) => (
                    <motion.div
                      key={`${item.id}-${idx}`}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="pt-6 first:pt-0 flex gap-4 sm:gap-6 items-center"
                    >
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-surface flex-shrink-0 border border-white/5">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-base font-bold text-white truncate">{item.name}</h3>
                          <span className="text-primary font-bold text-sm whitespace-nowrap">
                            {(item.price * item.quantity).toFixed(0)} {t('currency')}
                          </span>
                        </div>

                        {item.customizations?.ingredients && item.customizations.ingredients.length > 0 && (
                          <p className="text-[11px] text-white/40 line-clamp-1">
                            {item.customizations.ingredients.join(' · ')}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center bg-white/5 rounded-lg border border-white/5">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.customizations)}
                              className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <span className="material-symbols-outlined text-xs">remove</span>
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.customizations)}
                              className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                              aria-label="Increase quantity"
                            >
                              <span className="material-symbols-outlined text-xs">add</span>
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id, item.customizations)}
                            className="text-white/20 hover:text-error transition-colors p-1"
                            title={language === 'ar' ? 'حذف الصنف' : 'Remove dish'}
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Guest and Table Details */}
          <div className="bg-surface-container-low border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-tertiary flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">room_service</span>
              {t('checkout.service_details')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/40">{t('checkout.guest_name')}</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder={language === 'ar' ? 'الاسم الكريم' : 'Full Name'}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-primary outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/40">{t('checkout.guest_phone')}</label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="05XXXXXXXX"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-primary outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/40">{t('checkout.table_number')}</label>
                <input
                  type="text"
                  value={customTable}
                  onChange={(e) => setCustomTable(e.target.value)}
                  placeholder={language === 'ar' ? 'طاولة 5' : 'Table 5'}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-primary outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-[11px] font-bold text-white/40 flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">edit_note</span>
                {t('checkout.notes_label')}
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder={t('checkout.notes_placeholder')}
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white focus:border-primary outline-none transition-colors resize-none placeholder:text-white/20"
              />
            </div>
          </div>
        </div>

        {/* Billing Column */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="bg-surface-container-high p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl space-y-6">
            <h2 className="text-xl font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">receipt</span>
              {t('checkout.billing_details')}
            </h2>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center text-white/70">
                <span>{t('checkout.items_total')}</span>
                <span className="font-bold">{totalPrice.toFixed(2)} {t('currency')}</span>
              </div>

              <div className="flex justify-between items-center text-white/70">
                <span>{t('checkout.service_fee')}</span>
                <span className="font-bold">{serviceFee.toFixed(2)} {t('currency')}</span>
              </div>

              <div className="flex justify-between items-center text-white/70">
                <span>{t('checkout.vat')}</span>
                <span className="font-bold">{vat.toFixed(2)} {t('currency')}</span>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <div className="space-y-0.5">
                  <span className="text-xs uppercase tracking-widest text-tertiary font-black block">
                    {t('checkout.final_total')}
                  </span>
                  <p className="text-[10px] text-white/30">{t('checkout.all_inclusive')}</p>
                </div>
                <span className="text-3xl font-black text-primary tracking-tight">
                  {finalTotal.toFixed(2)} <span className="text-sm font-normal text-white/50">{t('currency')}</span>
                </span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting || cart.length === 0}
              className="w-full bg-primary text-on-primary py-4 rounded-xl font-black uppercase tracking-wider text-xs hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-lg">check_circle</span>
              {isSubmitting ? t('checkout.submitting') : t('checkout.confirm_button')}
            </button>

            <div className="flex items-center gap-3 p-4 bg-tertiary/5 rounded-xl border border-tertiary/15 text-xs text-white/60">
              <span className="material-symbols-outlined text-tertiary text-xl shrink-0">table_restaurant</span>
              <p className="text-[11px] leading-relaxed">
                {t('checkout.kitchen_notify')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
