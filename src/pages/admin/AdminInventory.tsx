import { motion } from 'framer-motion';

const AdminInventory = () => {
  const stock = [
    { name: 'Black Truffle (Périgord)', sku: 'TRF-001', health: 4, remaining: '120g', velocity: '+12%', image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=100&q=80' },
    { name: 'A5 Wagyu Ribeye', sku: 'WGY-502', health: 22, remaining: '8.5kg', velocity: '-3%', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=100&q=80' },
    { name: 'Organic Garden Root Mix', sku: 'VEG-990', health: 82, remaining: '45kg', velocity: '+2%', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&q=80' },
    { name: 'Extra Virgin Olive Oil', sku: 'OIL-012', health: 65, remaining: '18L', velocity: '0%', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100&q=80' },
  ];

  return (
    <div className="p-8 pb-32 space-y-12" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-headline font-black tracking-tighter text-white uppercase mb-2">مزامنة المخزون</h2>
          <p className="text-white/40 font-headline text-xs uppercase tracking-widest font-bold">مراقبة حية للمكونات وتوقعات التوريد</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-4 bg-white/[0.03] border border-white/5 text-white/40 font-headline font-black text-[10px] uppercase tracking-widest rounded-xl hover:text-white transition-all">سجل التوريدات</button>
          <button className="px-8 py-4 bg-tertiary text-on-tertiary font-headline font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-tertiary/10">طلب مكونات</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-primary/5 to-transparent p-8 rounded-2xl border border-primary/10 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <span className="p-3 bg-primary/10 rounded-xl text-primary material-symbols-outlined text-2xl">trending_up</span>
            <span className="text-[10px] font-black text-primary bg-primary/20 px-3 py-1 rounded-full uppercase tracking-widest">+12% متوقع</span>
          </div>
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] font-headline">الاستهلاك اليومي التقديري</p>
          <h3 className="text-5xl font-headline font-black text-white mt-2">1,420 <span className="text-lg font-bold text-white/20 tracking-normal uppercase mr-2">وحدة</span></h3>
          <p className="text-xs text-white/40 mt-6 leading-relaxed max-w-sm font-medium">توقعات بارتفاع الطلب على الخضروات العضوية خلال الـ 72 ساعة القادمة.</p>
        </div>

        <div className="bg-white/[0.02] p-8 rounded-2xl border-r-[6px] border-error/40 border-y border-l border-white/5">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] font-headline mb-4">نقص حرج</p>
          <h3 className="text-5xl font-headline font-black text-error">03</h3>
          <p className="text-xs text-white/40 mt-6 font-medium leading-relaxed">بحاجة لتوريد فوري: واغيو، ترافل، سي باس.</p>
        </div>

        <div className="bg-white/[0.02] p-8 rounded-2xl border-r-[6px] border-tertiary/40 border-y border-l border-white/5">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] font-headline mb-4">تنبيهات انخفاض</p>
          <h3 className="text-5xl font-headline font-black text-tertiary">08</h3>
          <p className="text-xs text-white/40 mt-6 font-medium leading-relaxed">يتوقع نفاد الزيوت الخاصة خلال 48 ساعة.</p>
        </div>
      </div>

      <div className="bg-white/[0.02] rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <h3 className="font-headline font-black text-sm uppercase tracking-widest text-white/60">مصفوفة صحة المكونات</h3>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary"><span className="w-1.5 h-1.5 rounded-full bg-primary mb-0.5"></span> ممتاز</div>
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-tertiary"><span className="w-1.5 h-1.5 rounded-full bg-tertiary mb-0.5"></span> منخفض</div>
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-error"><span className="w-1.5 h-1.5 rounded-full bg-error mb-0.5"></span> حرج</div>
          </div>
        </div>
        
        <div className="divide-y divide-white/5">
          {stock.map((item, idx) => (
            <div key={idx} className="p-8 flex flex-col md:flex-row md:items-center gap-10 hover:bg-white/[0.03] transition-all group">
              <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden border border-white/5 shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all filter grayscale group-hover:grayscale-0" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-headline font-black text-white text-base uppercase tracking-wider">{item.name}</h4>
                <p className="text-[10px] text-white/20 font-black tracking-widest mt-1 uppercase">كود: {item.sku} • المصدر: توريد إقليمي</p>
              </div>

              <div className="w-full md:w-64 space-y-3">
                <div className="flex justify-between items-end text-[9px] font-black uppercase tracking-[0.2em]">
                  <span className="text-white/40">المتبقي: {item.remaining}</span>
                  <span className={item.health < 10 ? 'text-error' : item.health < 30 ? 'text-tertiary' : 'text-primary'}>{item.health}% من المخزون</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.health}%` }}
                    className={`h-full ${item.health < 10 ? 'bg-error' : item.health < 30 ? 'bg-tertiary' : 'bg-primary'}`}
                  />
                </div>
              </div>

              <div className="flex-1 text-center hidden lg:block">
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">الاستهلاك</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-black text-white">{item.velocity.replace(/[+-]/, '')}/يوم</span>
                  <span className={`text-[9px] font-black ${item.velocity.startsWith('+') ? 'text-error' : 'text-primary'}`}>
                    {item.velocity.startsWith('+') ? '↑' : '↓'} {item.velocity.slice(1)}
                  </span>
                </div>
              </div>

              <button className="bg-white/[0.03] border border-white/5 text-white/40 px-6 py-3 rounded-xl font-headline font-black text-[10px] uppercase tracking-widest hover:text-white hover:border-primary/50 transition-all shrink-0">
                إدارة الصنف
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;
