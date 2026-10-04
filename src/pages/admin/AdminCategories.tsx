import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRAWAQ, getCategoryTitle } from '../../hooks/useRAWAQ';
import { useNotification } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';

const AdminCategories = () => {
  const { categories, menuItems, loading, addCategory, updateCategory, deleteCategory } = useRAWAQ();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const { showNotification } = useNotification();
  const { direction, t, language } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    name_ar: '',
    icon: 'restaurant'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name_en || formData.name || formData.name_ar,
        name_en: formData.name_en || formData.name,
        name_ar: formData.name_ar || formData.name,
        icon: formData.icon || 'restaurant'
      };

      if (editingCategory) {
        await updateCategory(editingCategory.id, payload);
        showNotification(language === 'ar' ? 'تم تحديث التصنيف بنجاح' : 'Category updated successfully', 'success');
      } else {
        await addCategory(payload);
        showNotification(language === 'ar' ? 'تمت إضافة التصنيف بنجاح' : 'Category created successfully', 'success');
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', name_en: '', name_ar: '', icon: 'restaurant' });
    } catch {
      showNotification(language === 'ar' ? 'فشل حفظ التصنيف' : 'Failed to save category', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    const confirmMsg = language === 'ar' ? 'هل أنت متأكد من حذف هذا التصنيف؟' : 'Are you sure you want to delete this category?';
    if (window.confirm(confirmMsg)) {
      try {
        await deleteCategory(id);
        showNotification(language === 'ar' ? 'تم حذف التصنيف بنجاح' : 'Category deleted successfully', 'success');
      } catch {
        showNotification(language === 'ar' ? 'فشل حذف التصنيف' : 'Failed to delete category', 'error');
      }
    }
  };

  if (loading && categories.length === 0) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 sm:p-8 space-y-6 font-headline" dir={direction}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase">
            {t('admin.categories_management')}
          </h2>
          <p className="text-white/40 text-xs mt-1">
            {language === 'ar' ? 'تنظيم قائمة الطعام في أقسام وتصنيفات رئيسية' : 'Organize dishes into signature culinary sections'}
          </p>
        </div>
        
        <button 
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', name_en: '', name_ar: '', icon: 'restaurant' });
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-on-primary px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-primary/20"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          <span>{t('admin.add_category_btn')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {categories.map((cat) => {
          const count = menuItems.filter(m => m.category === cat.id).length;
          const title = getCategoryTitle(cat, language);

          return (
            <motion.div
              key={cat.id}
              layout
              className="bg-surface-container-low border border-white/5 rounded-2xl p-5 hover:border-white/15 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="w-11 h-11 bg-tertiary/10 rounded-xl flex items-center justify-center text-tertiary border border-tertiary/20">
                  <span className="material-symbols-outlined text-xl">{cat.icon || 'restaurant'}</span>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => {
                      setEditingCategory(cat);
                      setFormData({
                        name: cat.name,
                        name_en: cat.name_en || cat.name,
                        name_ar: cat.name_ar || cat.name,
                        icon: cat.icon || 'restaurant'
                      });
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 text-white/40 hover:text-primary rounded-lg hover:bg-white/5 transition-colors"
                    title="Edit"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.id)}
                    className="p-1.5 text-white/40 hover:text-error rounded-lg hover:bg-white/5 transition-colors"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{title}</h3>
                <p className="text-[11px] text-white/40 mt-1">
                  {language === 'ar' ? 'يحتوي على' : 'Contains'} <span className="text-primary font-bold">{count}</span> {count === 1 ? t('menu.dish') : t('menu.dishes')}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir={direction}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-surface-container-high rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl"
            >
              <h3 className="text-xl font-black text-white mb-6">
                {editingCategory
                  ? (language === 'ar' ? 'تعديل التصنيف' : 'Edit Category')
                  : (language === 'ar' ? 'إضافة تصنيف جديد' : 'New Category')}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-white/40">
                    {language === 'ar' ? 'اسم التصنيف (إنجليزي)' : 'Category Name (English)'}
                  </label>
                  <input
                    required
                    value={formData.name_en || formData.name}
                    onChange={e => setFormData({ ...formData, name_en: e.target.value, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-primary outline-none transition-colors"
                    placeholder="Main Course"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-white/40">
                    {language === 'ar' ? 'اسم التصنيف (عربي)' : 'Category Name (Arabic)'}
                  </label>
                  <input
                    value={formData.name_ar}
                    onChange={e => setFormData({ ...formData, name_ar: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-primary outline-none transition-colors"
                    placeholder="الأطباق الرئيسية"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-white/40">
                    {language === 'ar' ? 'رمز الأيقونة (Material Symbol)' : 'Icon Name (Material Symbol)'}
                  </label>
                  <input
                    value={formData.icon}
                    onChange={e => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-primary outline-none transition-colors"
                    placeholder="restaurant, lunch_dining, icecream, local_bar"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-xs font-bold text-white/50 hover:text-white transition-all"
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-primary text-on-primary text-xs font-bold hover:brightness-110 transition-all shadow-md shadow-primary/20"
                  >
                    {editingCategory
                      ? (language === 'ar' ? 'حفظ التعديلات' : 'Save Changes')
                      : (language === 'ar' ? 'إضافة التصنيف' : 'Create Category')}
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
