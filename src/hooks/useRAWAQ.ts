import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Language } from '../context/LanguageContext';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  name_en?: string;
  name_ar?: string;
  icon?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  name_en?: string;
  name_ar?: string;
  description: string;
  description_en?: string;
  description_ar?: string;
  price: number;
  image_url: string;
  category: string;
  ingredients: string[];
  ingredients_en?: string[];
  ingredients_ar?: string[];
  is_popular: boolean;
  is_available: boolean;
  tag?: string;
  tag_en?: string;
  tag_ar?: string;
  calories?: string;
  calories_en?: string;
  calories_ar?: string;
  created_at: string;
}

export interface OrderItem {
  id?: number | string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  price_at_time: number;
  menu_items?: { name: string; name_en?: string; name_ar?: string };
}

export interface Order {
  id: string;
  customer_id?: string;
  customer_name: string;
  customer_phone?: string;
  table_number: string;
  total_amount: number;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  note?: string;
  created_at: string;
  order_items?: OrderItem[];
}

export interface Reservation {
  id: string;
  customer_id?: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  guest_count: number;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  created_at: string;
}

// ─── Bilingual Baseline Data ──────────────────────────────────────────────────

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-mains', name: 'Main Course', name_en: 'Main Course', name_ar: 'الأطباق الرئيسية', icon: 'restaurant' },
  { id: 'cat-appetizers', name: 'Appetizers', name_en: 'Appetizers', name_ar: 'المقبلات', icon: 'lunch_dining' },
  { id: 'cat-desserts', name: 'Desserts', name_en: 'Desserts', name_ar: 'الحلويات', icon: 'icecream' },
  { id: 'cat-beverages', name: 'Beverages', name_en: 'Beverages', name_ar: 'المشروبات', icon: 'local_bar' }
];

export const DEFAULT_MENU: MenuItem[] = [
  {
    id: 'dish-1',
    name: 'Royal Wagyu Ribeye',
    name_en: 'Royal Wagyu Ribeye',
    name_ar: 'ستيك ريب آي فاخر',
    description: '45-day dry-aged Australian Wagyu A5, flame-grilled with herb infused butter, roasted garlic, and black truffle reduction.',
    description_en: '45-day dry-aged Australian Wagyu A5, flame-grilled with herb infused butter, roasted garlic, and black truffle reduction.',
    description_ar: 'قطعة لحم واغيو معتقة 45 يوماً، مشوية على الفحم مع زبدة الأعشاب العطرية، الثوم المشوي، وصوص الترافل الأسود.',
    price: 285,
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80',
    category: 'cat-mains',
    ingredients: ['A5 Wagyu Beef', 'Black Truffle', 'Herb Butter', 'Rosemary', 'Smoked Sea Salt'],
    ingredients_en: ['A5 Wagyu Beef', 'Black Truffle', 'Herb Butter', 'Rosemary', 'Smoked Sea Salt'],
    ingredients_ar: ['لحم واغيو A5', 'ترافل أسود', 'زبدة أعشاب', 'إكليل الجبل', 'ملح مدخن'],
    is_popular: true,
    is_available: true,
    tag: "Chef's Signature",
    tag_en: "Chef's Signature",
    tag_ar: 'توقيع الشيف',
    calories: '720 kcal',
    calories_en: '720 kcal',
    calories_ar: '720 سعرة',
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'dish-2',
    name: 'Zaffron Sea Bass',
    name_en: 'Zaffron Sea Bass',
    name_ar: 'سلمون مشوي بالزعفران',
    description: 'Slow-poached fresh Norwegian salmon and wild sea bass with aromatic saffron and lemon citrus emulsion, served over wild rice.',
    description_en: 'Slow-poached fresh Norwegian salmon and wild sea bass with aromatic saffron and lemon citrus emulsion, served over wild rice.',
    description_ar: 'فيليه سلمون نرويجي طازج مشوي ببطء مع صوص الزعفران والليمون العطري، يُقدم مع الأرز البري والهليون المشوي.',
    price: 195,
    image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1200&q=80',
    category: 'cat-mains',
    ingredients: ['Norwegian Salmon', 'Persian Saffron', 'Fresh Asparagus', 'Organic Meyer Lemon', 'Dill'],
    ingredients_en: ['Norwegian Salmon', 'Persian Saffron', 'Fresh Asparagus', 'Organic Meyer Lemon', 'Dill'],
    ingredients_ar: ['سلمون نرويجي', 'زعفران إيراني فاخر', 'هليون طازج', 'ليمون عضوي', 'شبت'],
    is_popular: true,
    is_available: true,
    tag: 'Fresh Catch',
    tag_en: 'Fresh Catch',
    tag_ar: 'أطباق بحرية',
    calories: '510 kcal',
    calories_en: '510 kcal',
    calories_ar: '510 سعرة',
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'dish-3',
    name: 'Royal Lamb Shank',
    name_en: 'Royal Lamb Shank',
    name_ar: 'طاجن كتف الضأن الملكي',
    description: '12-hour braised local lamb shank immersed in cardamom and saffron reduction, served atop fragrant smoked green freekeh.',
    description_en: '12-hour braised local lamb shank immersed in cardamom and saffron reduction, served atop fragrant smoked green freekeh.',
    description_ar: 'كتف ضأن مطهو على نار هادئة لمدة 12 ساعة مع مرق الهيل والزعفران، يُقدم فوق الفريك المدخن مع المكسرات المحمصة.',
    price: 220,
    image_url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1200&q=80',
    category: 'cat-mains',
    ingredients: ['Prime Lamb', 'Smoked Freekeh', 'Toasted Pine Nuts', 'Persian Saffron', 'Cardamom'],
    ingredients_en: ['Prime Lamb', 'Smoked Freekeh', 'Toasted Pine Nuts', 'Persian Saffron', 'Cardamom'],
    ingredients_ar: ['لحم ضأن بلدي', 'فريك مدخن', 'صنوبر ولوز محمص', 'زعفران', 'هيل'],
    is_popular: true,
    is_available: true,
    tag: 'Royal Heritage',
    tag_en: 'Royal Heritage',
    tag_ar: 'طبق ملكي',
    calories: '680 kcal',
    calories_en: '680 kcal',
    calories_ar: '680 سعرة',
    created_at: new Date(Date.now() - 10800000).toISOString()
  },
  {
    id: 'dish-4',
    name: 'Imperial Truffle Caesar',
    name_en: 'Imperial Truffle Caesar',
    name_ar: 'سلطة سيزر الترافل الملكية',
    description: 'Crisp romaine hearts crowned with 24-month aged Parmigiano-Reggiano ribbons, artisanal herb croutons, and black truffle dressing.',
    description_en: 'Crisp romaine hearts crowned with 24-month aged Parmigiano-Reggiano ribbons, artisanal herb croutons, and black truffle dressing.',
    description_ar: 'قلوب الخس الروماني الطازجة مع شرائح بارميجانو ريجيانو المعتق، كروتون الأعشاب الذهبي، وصوص السيزر بالترافل.',
    price: 75,
    image_url: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=1200&q=80',
    category: 'cat-appetizers',
    ingredients: ['Romaine Hearts', 'Parmigiano-Reggiano', 'Truffle Oil', 'Artisan Croutons', 'Caesar Aioli'],
    ingredients_en: ['Romaine Hearts', 'Parmigiano-Reggiano', 'Truffle Oil', 'Artisan Croutons', 'Caesar Aioli'],
    ingredients_ar: ['خس روماني', 'جبنة بارميزان 24 شهر', 'زيت ترافل', 'كروتون مقرمش', 'صوص سيزر'],
    is_popular: false,
    is_available: true,
    tag: 'Signature Salad',
    tag_en: 'Signature Salad',
    tag_ar: 'مقبلات فاخرة',
    calories: '310 kcal',
    calories_en: '310 kcal',
    calories_ar: '310 سعرة',
    created_at: new Date(Date.now() - 14400000).toISOString()
  },
  {
    id: 'dish-5',
    name: 'Golden Saffron Hummus',
    name_en: 'Golden Saffron Hummus',
    name_ar: 'حمص بالزعفران ولحم الكونفيت',
    description: 'Velvety organic chickpea purée infused with saffron threads, topped with tender slow-cooked lamb confit and toasted pine nuts.',
    description_en: 'Velvety organic chickpea purée infused with saffron threads, topped with tender slow-cooked lamb confit and toasted pine nuts.',
    description_ar: 'حمص ناعم مخملي ممزوج بالزعفران النقي، يعلوه لحم ضأن كونفيت مطهو ببطء وحبوب الصنوبر الذهبية مع خبز طازج.',
    price: 65,
    image_url: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=1200&q=80',
    category: 'cat-appetizers',
    ingredients: ['Organic Chickpeas', 'Artisan Tahini', 'Persian Saffron', 'Lamb Confit', 'Toasted Pine Nuts'],
    ingredients_en: ['Organic Chickpeas', 'Artisan Tahini', 'Persian Saffron', 'Lamb Confit', 'Toasted Pine Nuts'],
    ingredients_ar: ['حمص عضوي', 'طحينة بلدية', 'زعفران', 'لحم ضأن كونفيت', 'صنوبر محمص'],
    is_popular: true,
    is_available: true,
    tag: 'Warm Mezze',
    tag_en: 'Warm Mezze',
    tag_ar: 'مقبلات ساخنة',
    calories: '390 kcal',
    calories_en: '390 kcal',
    calories_ar: '390 سعرة',
    created_at: new Date(Date.now() - 18000000).toISOString()
  },
  {
    id: 'dish-6',
    name: 'Velvet Date Pudding',
    name_en: 'Velvet Date Pudding',
    name_ar: 'بودينغ التمر المخملي',
    description: 'Warm Madinah Medjool date sponge steeped in salted butterscotch glaze, accompanied by Madagascan clotted vanilla bean gelato.',
    description_en: 'Warm Madinah Medjool date sponge steeped in salted butterscotch glaze, accompanied by Madagascan clotted vanilla bean gelato.',
    description_ar: 'كيك التمر المديني الدافئ مع صوص التوفي والزبدة المملحة، يقدم مع آيس كريم الفانيليا المدغشقرية وقرمشة الفستق.',
    price: 85,
    image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=1200&q=80',
    category: 'cat-desserts',
    ingredients: ['Medjool Dates', 'Salted Butterscotch', 'Vanilla Bean Gelato', 'Crushed Pistachio'],
    ingredients_en: ['Medjool Dates', 'Salted Butterscotch', 'Vanilla Bean Gelato', 'Crushed Pistachio'],
    ingredients_ar: ['تمر خلاص فاخر', 'صوص بترسكوتش', 'آيس كريم فانيليا', 'فستق حلبي'],
    is_popular: true,
    is_available: true,
    tag: 'Bestseller Dessert',
    tag_en: 'Bestseller Dessert',
    tag_ar: 'الأكثر طلباً',
    calories: '440 kcal',
    calories_en: '440 kcal',
    calories_ar: '440 سعرة',
    created_at: new Date(Date.now() - 21600000).toISOString()
  },
  {
    id: 'dish-7',
    name: 'Golden Eagle Elixir',
    name_en: 'Golden Eagle Elixir',
    name_ar: 'موكتيل الإمبراطور الذهبي',
    description: 'Cold-pressed wild pomegranate, mountain damask rose water, spicy ginger extract, artisanal sparkling soda, and 24K edible gold dust.',
    description_en: 'Cold-pressed wild pomegranate, mountain damask rose water, spicy ginger extract, artisanal sparkling soda, and 24K edible gold dust.',
    description_ar: 'مزيج منعش من الرمان الطازج، ماء الورد العطري، الزنجبيل الحار، ولمسة من الصودا الفوارة مع غبار الذهب الصالح للأكل.',
    price: 45,
    image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1200&q=80',
    category: 'cat-beverages',
    ingredients: ['Wild Pomegranate', 'Damask Rose Water', 'Spicy Ginger', 'Sparkling Citrus', '24K Edible Gold'],
    ingredients_en: ['Wild Pomegranate', 'Damask Rose Water', 'Spicy Ginger', 'Sparkling Citrus', '24K Edible Gold'],
    ingredients_ar: ['عصير رمان طازج', 'ماء ورد جبلي', 'زنجبيل', 'صودا ليمون', 'رقائق ذهب'],
    is_popular: true,
    is_available: true,
    tag: 'Signature Mocktail',
    tag_en: 'Signature Mocktail',
    tag_ar: 'مشروب الموسم',
    calories: '120 kcal',
    calories_en: '120 kcal',
    calories_ar: '120 سعرة',
    created_at: new Date(Date.now() - 25200000).toISOString()
  }
];

// Helper functions for localized content
export const getDishName = (dish: MenuItem, lang: Language): string => {
  if (lang === 'ar' && dish.name_ar) return dish.name_ar;
  if (lang === 'en' && dish.name_en) return dish.name_en;
  return dish.name;
};

export const getDishDescription = (dish: MenuItem, lang: Language): string => {
  if (lang === 'ar' && dish.description_ar) return dish.description_ar;
  if (lang === 'en' && dish.description_en) return dish.description_en;
  return dish.description;
};

export const getDishIngredients = (dish: MenuItem, lang: Language): string[] => {
  if (lang === 'ar' && dish.ingredients_ar && dish.ingredients_ar.length > 0) return dish.ingredients_ar;
  if (lang === 'en' && dish.ingredients_en && dish.ingredients_en.length > 0) return dish.ingredients_en;
  return dish.ingredients || [];
};

export const getDishTag = (dish: MenuItem, lang: Language): string => {
  if (lang === 'ar' && dish.tag_ar) return dish.tag_ar;
  if (lang === 'en' && dish.tag_en) return dish.tag_en;
  return dish.tag || (lang === 'ar' ? 'مميز' : 'Signature');
};

export const getDishCalories = (dish: MenuItem, lang: Language): string => {
  if (lang === 'ar' && dish.calories_ar) return dish.calories_ar;
  if (lang === 'en' && dish.calories_en) return dish.calories_en;
  return dish.calories || (lang === 'ar' ? 'فاخر' : 'Signature');
};

export const getCategoryTitle = (cat: Category, lang: Language): string => {
  if (lang === 'ar' && cat.name_ar) return cat.name_ar;
  if (lang === 'en' && cat.name_en) return cat.name_en;
  return cat.name;
};

// ─── Hook Implementation ──────────────────────────────────────────────────────

export const useRAWAQ = () => {
  // Stale-While-Revalidate: Instant initial memory & cache render
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const cached = localStorage.getItem('rawaq_menu_cache');
      return cached ? JSON.parse(cached) : DEFAULT_MENU;
    } catch {
      return DEFAULT_MENU;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const cached = localStorage.getItem('rawaq_categories_cache');
      return cached ? JSON.parse(cached) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const cached = localStorage.getItem('rawaq_orders_cache');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const cached = localStorage.getItem('rawaq_reservations_cache');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);

  // Sync to local cache
  useEffect(() => {
    try {
      localStorage.setItem('rawaq_menu_cache', JSON.stringify(menuItems));
    } catch (_) {}
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem('rawaq_categories_cache', JSON.stringify(categories));
    } catch (_) {}
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('rawaq_orders_cache', JSON.stringify(orders));
    } catch (_) {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('rawaq_reservations_cache', JSON.stringify(reservations));
    } catch (_) {}
  }, [reservations]);

  // Fast fetch with timeout safeguard
  const fetchMenu = useCallback(async () => {
    try {
      const fetchPromise = supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false });

      const timeoutPromise = new Promise<{ data: null; error: string }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: 'timeout' }), 2500)
      );

      const result: any = await Promise.race([fetchPromise, timeoutPromise]);
      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        setMenuItems(result.data);
      }
    } catch (err) {
      console.warn('Quick cache used for menu:', err);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const fetchPromise = supabase
        .from('categories')
        .select('*')
        .order('name');

      const timeoutPromise = new Promise<{ data: null; error: string }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: 'timeout' }), 2500)
      );

      const result: any = await Promise.race([fetchPromise, timeoutPromise]);
      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        setCategories(result.data);
      }
    } catch (err) {
      console.warn('Quick cache used for categories:', err);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_items (name, price)
          )
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data);
      }
    } catch (err) {
      console.warn('Orders fetched from cache:', err);
    }
  }, []);

  const fetchReservations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (!error && data) {
        setReservations(data);
      }
    } catch (err) {
      console.warn('Reservations fetched from cache:', err);
    }
  }, []);

  // Optimistic Mutations for maximum UI speed
  const createOrder = async (
    order: {
      customer_id?: string;
      customer_name: string;
      customer_phone?: string;
      table_number: string;
      total_amount: number;
      note?: string;
    },
    items: { menu_item_id: string; quantity: number; price_at_time: number }[]
  ): Promise<Order> => {
    const tempOrderId = 'ord-' + Date.now().toString(36);
    const newOrder: Order = {
      id: tempOrderId,
      customer_id: order.customer_id,
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      table_number: order.table_number,
      total_amount: order.total_amount,
      status: 'pending',
      note: order.note,
      created_at: new Date().toISOString(),
      order_items: items.map((item, idx) => {
        const dish = menuItems.find(m => m.id === item.menu_item_id);
        return {
          id: idx + 1,
          order_id: tempOrderId,
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          price_at_time: item.price_at_time,
          menu_items: dish ? { name: dish.name } : undefined
        };
      })
    };

    // 1. Optimistic instant state update
    setOrders(prev => [newOrder, ...prev]);

    // 2. Background database sync
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_id: order.customer_id || null,
          customer_name: order.customer_name,
          customer_phone: order.customer_phone || null,
          table_number: order.table_number,
          total_amount: order.total_amount,
          note: order.note || null
        }])
        .select()
        .single();

      if (!orderError && orderData) {
        const orderItemsPayload = items.map(item => ({
          order_id: orderData.id,
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          price_at_time: item.price_at_time
        }));
        await supabase.from('order_items').insert(orderItemsPayload);

        // Update with permanent server ID
        setOrders(prev => prev.map(o => o.id === tempOrderId ? { ...o, id: orderData.id, created_at: orderData.created_at } : o));
        newOrder.id = orderData.id;
      }
    } catch (err) {
      console.warn('Order persisted to client cache:', err);
    }

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    // 1. Optimistic instant UI update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));

    // 2. Background sync
    try {
      await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
    } catch (err) {
      console.warn('Update status synced locally:', err);
    }
  };

  const createReservation = async (
    reservation: Omit<Reservation, 'id' | 'created_at' | 'status'>
  ): Promise<Reservation> => {
    const tempId = 'res-' + Date.now().toString(36);
    const newReservation: Reservation = {
      ...reservation,
      id: tempId,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    // 1. Instant local update
    setReservations(prev => [...prev, newReservation]);

    // 2. Background sync
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert([{
          customer_id: reservation.customer_id || null,
          guest_name: reservation.guest_name,
          guest_email: reservation.guest_email,
          guest_phone: reservation.guest_phone,
          guest_count: reservation.guest_count,
          date: reservation.date,
          time: reservation.time,
          notes: reservation.notes || null
        }])
        .select()
        .single();

      if (!error && data) {
        setReservations(prev => prev.map(r => r.id === tempId ? { ...r, id: data.id, created_at: data.created_at } : r));
        newReservation.id = data.id;
      }
    } catch (err) {
      console.warn('Reservation saved locally:', err);
    }

    return newReservation;
  };

  const updateReservationStatus = async (id: string, status: Reservation['status']) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    try {
      await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id);
    } catch (err) {
      console.warn('Reservation status updated locally:', err);
    }
  };

  const addCategory = async (category: { id?: string; name: string; icon?: string }) => {
    const catId = category.id || ('cat-' + Date.now().toString(36));
    const newCat: Category = { id: catId, name: category.name, icon: category.icon };
    setCategories(prev => [...prev, newCat]);

    try {
      await supabase.from('categories').insert([{ id: catId, name: category.name, icon: category.icon }]);
      await fetchCategories();
    } catch (err) {
      console.warn('Category added locally:', err);
    }
  };

  const updateCategory = async (id: string, updates: Partial<{ name: string; icon?: string }>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    try {
      await supabase.from('categories').update(updates).eq('id', id);
      await fetchCategories();
    } catch (err) {
      console.warn('Category updated locally:', err);
    }
  };

  const deleteCategory = async (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    try {
      await supabase.from('categories').delete().eq('id', id);
      await fetchCategories();
    } catch (err) {
      console.warn('Category deleted locally:', err);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('menu-items')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('menu-items')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  };

  const addMenuItem = async (item: Omit<MenuItem, 'id' | 'created_at'> & { id?: string }) => {
    const dishId = item.id || ('dish-' + Date.now().toString(36));
    const newItem: MenuItem = {
      ...item,
      id: dishId,
      created_at: new Date().toISOString()
    };
    setMenuItems(prev => [newItem, ...prev]);

    try {
      await supabase.from('menu_items').insert([{
        id: dishId,
        name: item.name,
        description: item.description,
        price: item.price,
        image_url: item.image_url,
        category: item.category,
        ingredients: item.ingredients,
        is_popular: item.is_popular,
        is_available: item.is_available,
        tag: item.tag,
        calories: item.calories
      }]);
      await fetchMenu();
    } catch (err) {
      console.warn('Menu item added locally:', err);
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    try {
      await supabase.from('menu_items').update(updates).eq('id', id);
      await fetchMenu();
    } catch (err) {
      console.warn('Menu item updated locally:', err);
    }
  };

  const deleteMenuItem = async (id: string) => {
    setMenuItems(prev => prev.filter(m => m.id !== id));
    try {
      await supabase.from('menu_items').delete().eq('id', id);
      await fetchMenu();
    } catch (err) {
      console.warn('Menu item deleted locally:', err);
    }
  };

  // Revalidate background fetchers on load
  useEffect(() => {
    let active = true;
    const revalidate = async () => {
      try {
        await Promise.allSettled([
          fetchMenu(),
          fetchCategories(),
          fetchOrders(),
          fetchReservations()
        ]);
      } catch (_) {}
      if (active) setLoading(false);
    };
    revalidate();

    return () => {
      active = false;
    };
  }, [fetchMenu, fetchCategories, fetchOrders, fetchReservations]);

  const getMenuItem = useCallback(async (id: string): Promise<MenuItem | null> => {
    const existing = menuItems.find(m => m.id === id);
    if (existing) return existing;

    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) return data as MenuItem;
    } catch (_) {}

    return DEFAULT_MENU.find(m => m.id === id) || null;
  }, [menuItems]);

  return {
    menuItems,
    categories,
    orders,
    reservations,
    loading,
    createOrder,
    updateOrderStatus,
    createReservation,
    updateReservationStatus,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addCategory,
    updateCategory,
    deleteCategory,
    uploadImage,
    getMenuItem,
    refreshMenu: fetchMenu,
    refreshOrders: fetchOrders,
    refreshReservations: fetchReservations
  };
};
