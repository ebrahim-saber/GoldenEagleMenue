import { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    resort_name: 'GOLDEN EAGLE',
    is_open: true,
    contact_phone: '',
    address: '',
    tax_percentage: 15,
    currency: 'SAR'
  });
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  // Note: Usually settings are in a dedicated table. Let's assume 'settings' table exists or use local storage for demo if not.
  // For this implementation, I'll use a mock fetch/save to demonstrate the UI.
  
  useEffect(() => {
    // Mock fetch
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleSave = async () => {
    // Mock save
    showNotification('تم حفظ الإعدادات بنجاح', 'success');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-8 space-y-8" dir="rtl">
      <div>
        <h2 className="text-4xl font-headline font-black tracking-tight text-white">إعدادات النظام</h2>
        <p className="text-white/40 font-body text-sm mt-2">تخصيص معلومات المنتجع وإعدادات المنيو</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-6">
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">storefront</span>
            معلومات المنتجع
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-white/20 px-2">اسم المنتجع</label>
              <input
                value={settings.resort_name}
                onChange={e => setSettings({ ...settings, resort_name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-white/20 px-2">رقم التواصل</label>
              <input
                value={settings.contact_phone}
                onChange={e => setSettings({ ...settings, contact_phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="+966..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-white/20 px-2">العنوان</label>
              <textarea
                rows={3}
                value={settings.address}
                onChange={e => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Operational Settings */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-6">
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-tertiary">settings_applications</span>
            الإعدادات التشغيلية
          </h3>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10">
              <div>
                <p className="font-black text-white">حالة الاستقبال</p>
                <p className="text-xs text-white/40">تحديد ما إذا كان المطعم متاحاً للطلبات حالياً</p>
              </div>
              <button 
                onClick={() => setSettings({ ...settings, is_open: !settings.is_open })}
                className={`w-14 h-8 rounded-full transition-all relative flex items-center px-1 ${settings.is_open ? 'bg-primary' : 'bg-white/10'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full transition-all shadow-md ${settings.is_open ? 'translate-x-0' : 'translate-x-6'}`} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-white/20 px-2">نسبة الضريبة (%)</label>
                <input
                  type="number"
                  value={settings.tax_percentage}
                  onChange={e => setSettings({ ...settings, tax_percentage: Number(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-white/20 px-2">العملة</label>
                <input
                  value={settings.currency}
                  onChange={e => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          className="bg-primary text-on-primary px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20"
        >
          حفظ جميع التغييرات
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
