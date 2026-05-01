import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRAWAQ } from '../../hooks/useRAWAQ';
import { useNotification } from '../../context/NotificationContext';

interface Category {
  id: string;
  name: string;
  icon?: string;
  created_at: string;
}

const AdminCategories = () => {
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useRAWAQ();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const { showNotification } = useNotification();
  
  const [formData, setFormData] = useState({
    name: '',
    icon: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        showNotification('تم تحديث التصنيف بنجاح', 'success');
      } else {
        await addCategory(formData);
        showNotification('تم إضافة التصنيف بنجاح', 'success');
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', icon: '' });
    } catch (err) {
      showNotification('فشل حفظ التصنيف', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
      try {
        await deleteCategory(id);
        showNotification('تم حذف التصنيف بنجاح', 'success');
      } catch (err) {
        showNotification('فشل حذف التصنيف', 'error');
      }
    }
  };

  if (loading && categories.length === 0) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-8 space-y-8" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-headline font-black tracking-tight text-white">إدارة التصنيفات</h2>
          <p className="text-white/40 font-body text-sm mt-2">تنظيم قائمة الطعام في أقسام وتصنيفات</p>
        </div>
        
        <button 
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', icon: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-3 bg-primary text-on-primary px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/10"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          إضافة تصنيف جديد
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <motion.div
            key={cat.id}
            layout
            className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-tertiary/10 rounded-xl flex items-center justify-center text-tertiary border border-tertiary/20 text-2xl">
                {cat.icon || '🍽️'}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => {
                    setEditingCategory(cat);
                    setFormData({ name: cat.name, icon: cat.icon || '' });
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-white/20 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
                <button 
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 text-white/20 hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
            <h3 className="text-xl font-black text-white">{cat.name}</h3>
            <p className="text-xs text-white/20 mt-1 uppercase tracking-[0.2em] font-bold">تصنيف رئيسي</p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-surface-container-low rounded-[32px] border border-white/5 p-10 shadow-2xl"
            >
              <h3 className="text-2xl font-black text-white mb-8">
                {editingCategory ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-white/20 px-2">اسم التصنيف</label>
                  <input
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-1 focus:ring-primary outline-none"
                    placeholder="مثال: المقبلات"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-white/20 px-2">الأيقونة (إيموجي)</label>
                  <input
                    value={formData.icon}
                    onChange={e => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-1 focus:ring-primary outline-none"
                    placeholder="مثال: 🥗"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-8 py-4 rounded-xl border border-white/5 text-xs font-black text-white/40 hover:bg-white/5 transition-all"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-8 py-4 rounded-xl bg-primary text-on-primary text-xs font-black hover:brightness-110 transition-all shadow-xl shadow-primary/10"
                  >
                    {editingCategory ? 'حفظ التعديلات' : 'إضافة التصنيف'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCategories;
