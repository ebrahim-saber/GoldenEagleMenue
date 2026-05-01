import { useState, useRef } from 'react';
import { useRAWAQ, type MenuItem } from '../../hooks/useRAWAQ';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import { motion, AnimatePresence } from 'framer-motion';

const AdminMenu = () => {
  const { menuItems, categories, loading, updateMenuItem, deleteMenuItem, addMenuItem, uploadImage } = useRAWAQ();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    image_url: '',
    ingredients: [],
    is_available: true,
    tag: 'Royal Selection',
    calories: ''
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadImage(file);
      setFormData(prev => ({ ...prev, image_url: url }));
    } catch (err) {
      console.error('Upload failed:', err);
      alert('فشل رفع الصورة. تأكد من إنشاء bucket باسم menu-items في Supabase Storage.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateMenuItem(editingItem.id, formData);
      } else {
        await addMenuItem(formData as Omit<MenuItem, 'id' | 'created_at'>);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({ name: '', description: '', price: 0, category: '', image_url: '', ingredients: [], is_available: true, tag: 'Royal Selection', calories: '' });
    } catch (err) {
      console.error('Operation failed:', err);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData(item);
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
    if (window.confirm('Are you sure you want to remove this creation?')) {
      try {
        await deleteMenuItem(id);
      } catch (err) {
        console.error('Failed to delete item:', err);
      }
    }
  };

  if (loading) return (
    <div className="p-8">
      <TableSkeleton />
    </div>
  );

  return (
    <div className="p-8" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-headline font-black tracking-tighter text-white mb-2 uppercase">إدارة قائمة الطعام</h2>
          <p className="text-white/40 font-body text-sm leading-relaxed max-w-lg">
            قم بإدارة أصناف الطعام المتاحة، تحديث الأسعار، وإضافة إبداعات جديدة لقائمة منتجع GOLDEN EAGLE.
          </p>
        </div>
        <button 
          onClick={() => {
            setEditingItem(null);
            setFormData({ name: '', description: '', price: 0, category: categories[0]?.id || '', image_url: '', ingredients: [], is_available: true, tag: 'Royal Selection', calories: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-3 bg-primary text-on-primary px-8 py-4 rounded-xl font-headline font-extrabold text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/10"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          إضافة صنف جديد
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'الأصناف النشطة', val: menuItems.length.toString(), color: 'text-primary' },
          { label: 'غير متوفر', val: menuItems.filter(i => !i.is_available).length.toString(), color: 'text-error' },
          { label: 'التصنيفات', val: categories.length.toString(), color: 'text-tertiary' },
          { label: 'متوسط السعر', val: (menuItems.reduce((acc, i) => acc + i.price, 0) / menuItems.length || 0).toFixed(0), color: 'text-white' },
        ].map(stat => (
          <div key={stat.label} className="bg-white/[0.02] p-6 rounded-xl border border-white/5">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <p className={`text-3xl font-headline font-black ${stat.color}`}>{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/[0.02] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse font-headline">
            <thead>
              <tr className="bg-white/[0.03]">
                <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest">تفاصيل الصنف</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest">التصنيف</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest text-center">السعر</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest text-left">التوفر</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {menuItems.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.03] transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg bg-white/5 overflow-hidden border border-white/5">
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div>
                        <p className="font-extrabold text-white text-sm uppercase tracking-wider">{item.name}</p>
                        <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] mt-1 font-bold">صنف مميز</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1.5 rounded-md bg-white/5 text-white/40 text-[9px] font-black uppercase tracking-widest border border-white/5 group-hover:text-primary transition-colors">
                      {categories.find(c => c.id === item.category)?.name || item.category}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <p className="font-black text-tertiary text-sm">{item.price} ريال</p>
                  </td>
                  <td className="px-8 py-6 text-left">
                    <button 
                      onClick={() => toggleAvailability(item.id, item.is_available)}
                      className={`p-1.5 rounded-full transition-all ${item.is_available ? 'text-primary bg-primary/10' : 'text-white/10 bg-white/5'}`}
                    >
                      <span className="material-symbols-outlined text-xl">{item.is_available ? 'toggle_on' : 'toggle_off'}</span>
                    </button>
                  </td>
                  <td className="px-8 py-6 text-left">
                    <div className="flex justify-start gap-3">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="p-2.5 text-white/20 hover:text-tertiary hover:bg-white/5 rounded-lg transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2.5 text-white/20 hover:text-error hover:bg-white/5 rounded-lg transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl bg-surface-container-low rounded-3xl border border-white/5 p-12 overflow-y-auto max-h-[90vh] shadow-2xl"
             dir="rtl">
              <h3 className="text-3xl font-headline font-black text-white uppercase tracking-tighter mb-8">
                {editingItem ? 'تعديل الصنف' : 'إضافة صنف جديد'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest px-4">اسم الصنف</label>
                    <input
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="مثال: واغيو تارتار"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest px-4">السعر (ريال)</label>
                    <input
                      required
                      type="number"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest px-4">التصنيف</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id} className="bg-surface">{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest px-4">صورة الوجبة</label>
                  <div className="flex gap-4 items-center">
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
                      className="flex-1 bg-white/5 border border-dashed border-white/20 rounded-xl p-6 text-white hover:bg-white/10 transition-all flex flex-col items-center gap-2"
                    >
                      {uploading ? (
                        <span className="animate-spin material-symbols-outlined">sync</span>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-3xl opacity-40">cloud_upload</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">رفع من الجهاز</span>
                        </>
                      )}
                    </button>
                    <div className="flex-[2] space-y-2">
                      <input
                        value={formData.image_url}
                        onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="أو ضع رابط الصورة هنا..."
                      />
                    </div>
                  </div>
                  {formData.image_url && (
                    <div className="mt-4 w-32 h-32 rounded-xl overflow-hidden border border-white/10">
                      <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest px-4">الوصف</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-6 text-white focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-8 py-5 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/5 transition-all"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-8 py-5 rounded-xl bg-primary text-on-primary text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/10"
                  >
                    {editingItem ? 'حفظ التعديلات' : 'نشر الصنف'}
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
