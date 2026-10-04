import { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';

const AdminSettings = () => {
  const { direction, t, language } = useLanguage();
  const [settings, setSettings] = useState({
    resort_name: 'GOLDEN EAGLE',
    is_open: true,
    contact_phone: '+966 50 000 0000',
    address: language === 'ar' ? 'الرياض - منتجع رواق الملكي' : 'Riyadh - Rawaq Royal Sanctuary',
    tax_percentage: 15,
    currency: 'SAR'
  });
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = async () => {
    showNotification(language === 'ar' ? 'تم حفظ الإعدادات بنجاح' : 'Settings saved successfully', 'success');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 sm:p-8 space-y-8 font-headline" dir={direction}>
      <div>
        <h2 className="text-3xl font-black tracking-tight text-white uppercase">
          {t('admin.settings_title')}
        </h2>
        <p className="text-white/40 text-xs mt-1">
          {t('admin.settings_sub')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="bg-surface-container-low border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-black text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">storefront</span>
            {language === 'ar' ? 'معلومات المنتجع' : 'Sanctuary Information'}
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/40 px-1">
                {language === 'ar' ? 'اسم المنتجع والمطعم' : 'Brand Name'}
              </label>
              <input
                value={settings.resort_name}
                onChange={e => setSettings({ ...settings, resort_name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/40 px-1">
                {language === 'ar' ? 'رقم التواصل' : 'Contact Phone'}
              </label>
              <input
                value={settings.contact_phone}
                onChange={e => setSettings({ ...settings, contact_phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-primary outline-none transition-all"
                placeholder="+966..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/40 px-1">
                {language === 'ar' ? 'العنوان والموقع' : 'Venue Location & Address'}
              </label>
              <textarea
                rows={3}
                value={settings.address}
                onChange={e => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-primary outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Operational Settings */}
        <div className="bg-surface-container-low border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-black text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-tertiary">settings_applications</span>
            {language === 'ar' ? 'الإعدادات التشغيلية' : 'Operational Status'}
          </h3>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10">
              <div>
                <p className="font-bold text-white text-xs">
                  {language === 'ar' ? 'حالة استقبال الطلبات' : 'Kitchen & Lounge Orders Status'}
                </p>
                <p className="text-[11px] text-white/40 mt-0.5">
                  {language === 'ar' ? 'تحديد ما إذا كان المطعم متاحاً للطلبات حالياً' : 'Toggle live dining and order intake'}
                </p>
              </div>
              <button 
                onClick={() => setSettings({ ...settings, is_open: !settings.is_open })}
                className={`w-14 h-8 rounded-full transition-all relative flex items-center px-1 ${settings.is_open ? 'bg-primary' : 'bg-white/10'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full transition-all shadow-md ${
                  settings.is_open 
                    ? (direction === 'rtl' ? 'translate-x-0' : 'translate-x-6')
                    : (direction === 'rtl' ? '-translate-x-6' : 'translate-x-0')
                }`} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/40 px-1">
                  {language === 'ar' ? 'نسبة الضريبة (%)' : 'VAT Rate (%)'}
                </label>
                <input
                  type="number"
                  value={settings.tax_percentage}
                  onChange={e => setSettings({ ...settings, tax_percentage: Number(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/40 px-1">
                  {language === 'ar' ? 'العملة' : 'Currency'}
                </label>
                <input
                  value={settings.currency}
                  onChange={e => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          className="bg-primary text-on-primary px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20"
        >
          {language === 'ar' ? 'حفظ جميع التغييرات' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
