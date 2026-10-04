import { useState, useRef } from 'react';
import {
  useRAWAQ,
  getDishName,
  getDishDescription,
  getCategoryTitle,
  type MenuItem
} from '../../hooks/useRAWAQ';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const AdminMenu = () => {
  const { menuItems, categories, loading, updateMenuItem, deleteMenuItem, addMenuItem, uploadImage } = useRAWAQ();
  const { direction, t, language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    name_en: '',
    name_ar: '',
    description: '',
    description_en: '',
    description_ar: '',
    price: 0,
    category: '',
    image_url: '',
    ingredients: [],
    is_available: true,
    tag: 'Signature',
    calories: ''
  });

  const [ingredientsText, setIngredientsText] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadImage(file);
      setFormData(prev => ({ ...prev, image_url: url }));
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedIngredients = ingredientsText
        ? ingredientsText.split(/[,،]+/).map(i => i.trim()).filter(Boolean)
        : (formData.ingredients || []);

      const payload = {
        ...formData,
        name: formData.name_en || formData.name || formData.name_ar || 'Dish',
        name_en: formData.name_en || formData.name,
        name_ar: formData.name_ar || formData.name,
        description: formData.description_en || formData.description || formData.description_ar || '',
        description_en: formData.description_en || formData.description,
        description_ar: formData.description_ar || formData.description,
        category: formData.category || categories[0]?.id || 'cat-mains',
        ingredients: parsedIngredients
      };

      if (editingItem) {
        await updateMenuItem(editingItem.id, payload);
      } else {
        await addMenuItem(payload as Omit<MenuItem, 'id' | 'created_at'>);
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Operation failed:', err);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      ...item,
      name_en: item.name_en || item.name,
      name_ar: item.name_ar || item.name,
      description_en: item.description_en || item.description,
      description_ar: item.description_ar || item.description,
    });
    setIngredientsText(Array.isArray(item.ingredients) ? item.ingredients.join(', ') : '');
    setIsModalOpen(true);
  };

  const toggleAvailability = async (id: string, current: boolean) => {
    try {
      await updateMenuItem(id, { is_available: !current });
    } catch (err) {
      console.error('Failed to toggle availability:', err);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmMsg = language === 'ar' 
      ? 'هل أنت متأكد من حذف هذا الطبق من قائمة الطعام؟'
      : 'Are you sure you want to delete this dish from the menu?';
    if (window.confirm(confirmMsg)) {
      try {
        await deleteMenuItem(id);
      } catch (err) {
        console.error('Failed to delete item:', err);
      }
    }
  };

  if (loading && menuItems.length === 0) return (
    <div className="p-8">
      <TableSkeleton />
    </div>
  );

  return (
    <div className="p-6 sm:p-8 space-y-6 font-headline" dir={direction}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase">
            {t('admin.menu_management')}
          </h2>
          <p className="text-white/40 text-xs mt-1">
            {t('admin.menu_sub')}
          </p>
        </div>
        <button 
          onClick={() => {
            setEditingItem(null);
            setFormData({
              name: '',
              name_en: '',
              name_ar: '',
              description: '',
              description_en: '',
              description_ar: '',
              price: 120,
              category: categories[0]?.id || 'cat-mains',
              image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
              ingredients: [],
              is_available: true,
              tag: 'Chef Signature',
              calories: '450 kcal'
            });
            setIngredientsText('');
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-on-primary px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-primary/20"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          <span>{t('admin.add_dish_btn')}</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: language === 'ar' ? 'إجمالي الأطباق' : 'Total Dishes', val: menuItems.length, color: 'text-primary' },
          { label: language === 'ar' ? 'الأطباق المتاحة' : 'Available Dishes', val: menuItems.filter(i => i.is_available).length, color: 'text-emerald-400' },
          { label: language === 'ar' ? 'غير متوفر حالياً' : 'Unavailable', val: menuItems.filter(i => !i.is_available).length, color: 'text-error' },
          { label: language === 'ar' ? 'التصنيفات المفعلة' : 'Active Categories', val: categories.length, color: 'text-tertiary' },
        ].map(stat => (
          <div key={stat.label} className="bg-surface-container-low p-4 rounded-xl border border-white/5 space-y-1">
            <p className="text-[11px] text-white/40 font-bold">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Menu Table */}
      <div className="bg-surface-container-low rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className={`w-full border-collapse text-xs ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
            <thead>
              <tr className="bg-white/5 text-white/40 border-b border-white/5">
                <th className="px-6 py-4 font-bold">{language === 'ar' ? 'الطبق' : 'Dish'}</th>
                <th className="px-6 py-4 font-bold">{language === 'ar' ? 'التصنيف' : 'Category'}</th>
                <th className="px-6 py-4 font-bold text-center">{language === 'ar' ? 'السعر' : 'Price'}</th>
                <th className="px-6 py-4 font-bold text-center">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="px-6 py-4 font-bold text-end">{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {menuItems.map((item) => {
                const dishName = getDishName(item, language);
                const dishDesc = getDishDescription(item, language);
                const catObj = categories.find(c => c.id === item.category);
                const catTitle = catObj ? getCategoryTitle(catObj, language) : item.category;

                return (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-surface overflow-hidden border border-white/10 shrink-0">
                          <img src={item.image_url} alt={dishName} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white text-sm truncate">{dishName}</p>
                          <p className="text-[11px] text-white/40 line-clamp-1">{dishDesc}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 text-white/60 text-[11px] font-bold border border-white/5">
                        {catTitle}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-black text-tertiary text-sm">{item.price} {t('currency')}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => toggleAvailability(item.id, item.is_available)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all border ${
                          item.is_available 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {item.is_available
                          ? (language === 'ar' ? 'متاح للطلب' : 'Available')
                          : (language === 'ar' ? 'غير متوفر' : 'Unavailable')}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-end">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="p-2 text-white/50 hover:text-tertiary hover:bg-white/5 rounded-lg transition-all"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-white/50 hover:text-error hover:bg-white/5 rounded-lg transition-all"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir={direction}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-xl bg-surface-container-high rounded-3xl border border-white/10 p-6 sm:p-8 overflow-y-auto max-h-[90vh] shadow-2xl"
            >
              <h3 className="text-2xl font-black text-white mb-6">
                {editingItem
                  ? (language === 'ar' ? 'تعديل بيانات الطبق' : 'Edit Dish Details')
                  : (language === 'ar' ? 'إضافة طبق جديد' : 'Add New Signature Dish')}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-white/40">
                      {language === 'ar' ? 'اسم الطبق (إنجليزي)' : 'Dish Name (English)'}
                    </label>
                    <input
                      required
                      value={formData.name_en || formData.name || ''}
                      onChange={e => setFormData({ ...formData, name_en: e.target.value, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-primary outline-none transition-colors"
                      placeholder="Royal Wagyu Ribeye"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-white/40">
                      {language === 'ar' ? 'اسم الطبق (عربي)' : 'Dish Name (Arabic)'}
                    </label>
                    <input
                      value={formData.name_ar || ''}
                      onChange={e => setFormData({ ...formData, name_ar: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-primary outline-none transition-colors"
                      placeholder="ستيك ريب آي فاخر"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-white/40">
                      {language === 'ar' ? 'السعر (ريال)' : 'Price (SAR)'}
                    </label>
                    <input
                      required
                      type="number"
                      value={formData.price ?? 0}
                      onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-primary outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-white/40">
                      {language === 'ar' ? 'التصنيف' : 'Category'}
                    </label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-primary outline-none transition-colors"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id} className="bg-surface">
                          {getCategoryTitle(cat, language)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-white/40">
                      {language === 'ar' ? 'السعرات الحرارية' : 'Calories'}
                    </label>
                    <input
                      value={formData.calories || ''}
                      onChange={e => setFormData({ ...formData, calories: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-primary outline-none transition-colors"
                      placeholder="650 kcal"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-white/40">
                    {language === 'ar' ? 'رابط صورة الطبق' : 'Image URL'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={formData.image_url || ''}
                      onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-primary outline-none transition-colors"
                      placeholder="https://..."
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="px-4 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-bold whitespace-nowrap text-white"
                    >
                      {uploading ? '...' : (language === 'ar' ? 'رفع صورة' : 'Upload')}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-white/40">
                    {language === 'ar' ? 'المكونات (مفصولة بفاصلة)' : 'Ingredients (Comma separated)'}
                  </label>
                  <input
                    value={ingredientsText}
                    onChange={e => setIngredientsText(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-primary outline-none transition-colors"
                    placeholder="Wagyu beef, Truffle oil, Herb butter..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-white/40">
                      {language === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description_en || formData.description || ''}
                      onChange={e => setFormData({ ...formData, description_en: e.target.value, description: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-primary outline-none transition-colors resize-none"
                      placeholder="Exquisite 45-day dry aged ribeye steak..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-white/40">
                      {language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description_ar || ''}
                      onChange={e => setFormData({ ...formData, description_ar: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-primary outline-none transition-colors resize-none"
                      placeholder="شريحة ريب آي معتقة 45 يوماً مشوية بعناية..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all"
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-primary text-on-primary text-xs font-bold hover:brightness-110 transition-all shadow-md shadow-primary/20"
                  >
                    {editingItem
                      ? (language === 'ar' ? 'حفظ التعديلات' : 'Save Changes')
                      : (language === 'ar' ? 'إضافة الطبق' : 'Create Dish')}
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

export default AdminMenu;
