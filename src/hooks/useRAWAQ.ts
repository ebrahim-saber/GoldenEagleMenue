import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  ingredients: string[];
  is_popular: boolean;
  is_available: boolean;
  tag?: string;
  calories?: string;
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  price_at_time: number;
  menu_items?: { name: string };
}

export interface Order {
  id: string;
  customer_id?: string;
  customer_name: string;
  customer_phone: string;
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

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useRAWAQ = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetchers ──────────────────────────────────────────────────────────────

  // ── Mock Data ──────────────────────────────────────────────────────────────
  const MOCK_CATEGORIES: Category[] = [
    { id: 'cat1', name: 'المقبلات', icon: 'lunch_dining' },
    { id: 'cat2', name: 'الأطباق الرئيسية', icon: 'restaurant' },
    { id: 'cat3', name: 'الحلويات', icon: 'icecream' },
    { id: 'cat4', name: 'المشروبات', icon: 'local_bar' }
  ];

  const MOCK_MENU: MenuItem[] = [
    {
      id: '1',
      name: 'ستيك ريب آي فاخر',
      description: 'قطعة لحم ريب آي مشوية بعناية مع زبدة الأعشاب والخضروات الموسمية.',
      price: 185,
      image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
      category: 'cat2',
      ingredients: ['لحم بقري', 'زبدة', 'إكليل الجبل', 'ثوم'],
      is_popular: true,
      is_available: true,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'سلمون مشوي بالليمون',
      description: 'شريحة سلمون طازجة مشوية مع صوص الليمون والشبت، تقدم مع الأرز البري.',
      price: 145,
      image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
      category: 'cat2',
      ingredients: ['سلمون', 'ليمون', 'شبت', 'أرز بري'],
      is_popular: true,
      is_available: true,
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'سلطة سيزر ملكية',
      description: 'خس روماني طازج مع صوص سيزر الكريمي، جبنة بارميزان، وقطع الخبز المحمص.',
      price: 65,
      image_url: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&q=80',
      category: 'cat1',
      ingredients: ['خس', 'بارميزان', 'صوص سيزر'],
      is_popular: false,
      is_available: true,
      created_at: new Date().toISOString()
    }
  ];

  // ── Fetchers ──────────────────────────────────────────────────────────────

  const fetchMenu = useCallback(async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase error (menu_items):', error.message);
      setMenuItems(MOCK_MENU);
    } else {
      setMenuItems(data || MOCK_MENU);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.warn('Supabase error (categories):', error.message);
      setCategories(MOCK_CATEGORIES);
    } else {
      setCategories(data || MOCK_CATEGORIES);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_items (name)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase error (orders):', error.message);
      setOrders([]);
    } else {
      setOrders(data || []);
    }
  }, []);

  const fetchReservations = useCallback(async () => {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) {
      console.warn('Supabase error (reservations):', error.message);
      setReservations([]);
    } else {
      setReservations(data || []);
    }
  }, []);

  // ── Mutations ─────────────────────────────────────────────────────────────

  const createOrder = async (order: Omit<Order, 'id' | 'created_at' | 'status' | 'order_items'>, items: { menu_item_id: string, quantity: number, price_at_time: number }[]) => {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = items.map(item => ({
      ...item,
      order_id: orderData.id
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;
    return orderData;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) throw error;
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const createReservation = async (reservation: Omit<Reservation, 'id' | 'created_at' | 'status'>) => {
    const { data, error } = await supabase
      .from('reservations')
      .insert([reservation])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateReservationStatus = async (id: string, status: Reservation['status']) => {
    const { error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const addCategory = async (category: { name: string; icon?: string }) => {
    const { error } = await supabase
      .from('categories')
      .insert([category]);
    if (error) throw error;
    await fetchCategories();
  };

  const updateCategory = async (id: string, updates: Partial<{ name: string; icon?: string }>) => {
    const { error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
    await fetchCategories();
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    if (error) throw error;
    await fetchCategories();
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('menu-items')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('menu-items')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const addMenuItem = async (item: Omit<MenuItem, 'id' | 'created_at'>) => {
    const { error } = await supabase
      .from('menu_items')
      .insert([item]);

    if (error) throw error;
    await fetchMenu();
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    const { error } = await supabase
      .from('menu_items')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    await fetchMenu();
  };

  const deleteMenuItem = async (id: string) => {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchMenu();
  };

  // ── Initialization ────────────────────────────────────────────────────────

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        await Promise.allSettled([
          fetchMenu(),
          fetchCategories(),
          fetchOrders(),
          fetchReservations()
        ]);
      } catch (err) {
        console.error('Initialization error:', err);
        // Fallback to mock data if not already set
        setMenuItems(prev => prev.length ? prev : MOCK_MENU);
        setCategories(prev => prev.length ? prev : MOCK_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };
    init();

    // Real-time subscriptions
    let ordersSub: any;
    let menuSub: any;
    let categoriesSub: any;
    let reservationsSub: any;

    try {
      ordersSub = supabase.channel('orders-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
        .subscribe();

      menuSub = supabase.channel('menu-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, fetchMenu)
        .subscribe();

      categoriesSub = supabase.channel('categories-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, fetchCategories)
        .subscribe();

      reservationsSub = supabase.channel('reservations-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, fetchReservations)
        .subscribe();
    } catch (err) {
      console.warn('Real-time subscriptions failed:', err);
    }

    return () => {
      if (ordersSub) ordersSub.unsubscribe();
      if (menuSub) menuSub.unsubscribe();
      if (categoriesSub) categoriesSub.unsubscribe();
      if (reservationsSub) reservationsSub.unsubscribe();
    };
  }, [fetchMenu, fetchCategories, fetchOrders, fetchReservations]);

  const getMenuItem = useCallback(async (id: string): Promise<MenuItem | null> => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.warn('Supabase error (getMenuItem):', error.message);
        return MOCK_MENU.find(m => m.id === id) || null;
      }
      return data as MenuItem;
    } catch (err) {
      return MOCK_MENU.find(m => m.id === id) || null;
    }
  }, []);

  return {
    menuItems,
    categories,
    orders,
    reservations,
    loading,
    error,
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
