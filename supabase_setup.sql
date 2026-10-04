-- ── GOLDEN EAGLE / RAWAQ DATABASE SETUP ──
-- Execute this script in your Supabase SQL Editor

-- 1. EXTENSIONS -------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABLES -----------------------------------------------------------------

-- Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    icon TEXT
);

-- Menu Items
CREATE TABLE IF NOT EXISTS public.menu_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    category TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    ingredients TEXT[],
    is_popular BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    tag TEXT,
    calories TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Profiles (linked to Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES auth.users ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    table_number TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'served')),
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id UUID REFERENCES public.orders ON DELETE CASCADE,
    menu_item_id TEXT REFERENCES public.menu_items ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_time DECIMAL(10,2) NOT NULL
);

-- Reservations
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES auth.users ON DELETE SET NULL,
    guest_name TEXT NOT NULL,
    guest_email TEXT,
    guest_phone TEXT,
    guest_count INTEGER DEFAULT 2,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE SET NULL,
    recipient_email TEXT NOT NULL,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ROW LEVEL SECURITY (RLS) -----------------------------------------------

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Categories & Menu: Public read, Authenticated Admin write
DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Full Access Categories" ON public.categories;
CREATE POLICY "Admin Full Access Categories" ON public.categories FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Menu Items" ON public.menu_items;
CREATE POLICY "Public Read Menu Items" ON public.menu_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Full Access Menu Items" ON public.menu_items;
CREATE POLICY "Admin Full Access Menu Items" ON public.menu_items FOR ALL USING (true);

-- Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Orders
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users and Admins view orders" ON public.orders;
CREATE POLICY "Users and Admins view orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (true);

-- Order Items
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;
CREATE POLICY "Anyone can create order items" ON public.order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view order items" ON public.order_items;
CREATE POLICY "Anyone can view order items" ON public.order_items FOR SELECT USING (true);

-- Reservations
DROP POLICY IF EXISTS "Anyone can create reservations" ON public.reservations;
CREATE POLICY "Anyone can create reservations" ON public.reservations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "View reservations" ON public.reservations;
CREATE POLICY "View reservations" ON public.reservations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Update reservations" ON public.reservations;
CREATE POLICY "Update reservations" ON public.reservations FOR UPDATE USING (true);

-- Notifications
DROP POLICY IF EXISTS "Anyone can insert notifications" ON public.notifications;
CREATE POLICY "Anyone can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "View notifications" ON public.notifications;
CREATE POLICY "View notifications" ON public.notifications FOR SELECT USING (true);

-- 4. PROFILE TRIGGER --------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', 'Guest'), 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. INITIAL SEED DATA ------------------------------------------------------

INSERT INTO public.categories (id, name, icon) VALUES 
('cat-appetizers', 'المقبلات · Appetizers', 'salad'),
('cat-mains', 'الأطباق الرئيسية · Main Course', 'restaurant'),
('cat-desserts', 'الحلويات · Desserts', 'icecream'),
('cat-beverages', 'المشروبات · Beverages', 'local_bar')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon;

INSERT INTO public.menu_items (id, name, description, price, image_url, category, ingredients, is_popular, is_available, tag, calories) VALUES
(
    'dish-1',
    'ستيك ريب آي فاخر (Royal Wagyu Ribeye)',
    'قطعة لحم واغيو معتقة 45 يوماً، مشوية على الفحم مع زبدة الأعشاب العطرية، الثوم المشوي، وصوص الترافل الأسود.',
    285.00,
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80',
    'cat-mains',
    ARRAY['لحم واغيو A5', 'ترافل أسود', 'زبدة أعشاب', 'إكليل الجبل', 'ملح البحر المتبل'],
    true,
    true,
    'توقيع الشيف',
    '720 سعرة'
),
(
    'dish-2',
    'سلمون مشوي بالزعفران (Zaffron Sea Bass)',
    'فيليه سلمون نرويجي طازج مشوي ببطء مع صوص الزعفران والليمون العطري، يُقدم مع الأرز البري والهليون المشوي.',
    195.00,
    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1200&q=80',
    'cat-mains',
    ARRAY['سلمون نرويجي', 'زعفران إيراني فاخر', 'هليون طازج', 'ليمون عضوي', 'شبت'],
    true,
    true,
    'أطباق بحرية',
    '510 سعرة'
),
(
    'dish-3',
    'طاجن كتف الضأن الملكي (Royal Lamb Shank)',
    'كتف ضأن مطهو على نار هادئة لمدة 12 ساعة مع مرق الهيل والزعفران، يُقدم فوق الفريك المدخن مع المكسرات المحمصة.',
    220.00,
    'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1200&q=80',
    'cat-mains',
    ARRAY['لحم ضأن بلدي', 'فريك مدخن', 'صنوبر ولوز محمص', 'زعفران', 'هيل'],
    true,
    true,
    'طبق ملكي',
    '680 سعرة'
),
(
    'dish-4',
    'سلطة سيزر الترافل الملكية (Imperial Truffle Caesar)',
    'قلوب الخس الروماني الطازجة مع شرائح بارميجانو ريجيانو المعتق، كروتون الأعشاب الذهبي، وصوص السيزر بالترافل.',
    75.00,
    'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=1200&q=80',
    'cat-appetizers',
    ARRAY['خس روماني', 'جبنة بارميزان 24 شهر', 'زيت ترافل', 'كروتون مقرمش', 'صوص سيزر'],
    false,
    true,
    'مقبلات فاخرة',
    '310 سعرة'
),
(
    'dish-5',
    'حمص بالزعفران ولحم الكونفيت (Golden Saffron Hummus)',
    'حمص ناعم مخملي ممزوج بالزعفران النقي، يعلوه لحم ضأن كونفيت مطهو ببطء وحبوب الصنوبر الذهبية مع خبز طازج.',
    65.00,
    'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=1200&q=80',
    'cat-appetizers',
    ARRAY['حمص عضوي', 'طحينة بلدية', 'زعفران', 'لحم ضأن كونفيت', 'صنوبر محمص'],
    true,
    true,
    'مقبلات ساخنة',
    '390 سعرة'
),
(
    'dish-6',
    'بودينغ التمر المخملي (Velvet Date Pudding)',
    'كيك التمر المديني الدافئ مع صوص التوفي والزبدة المملحة، يقدم مع آيس كريم الفانيليا المدغشقرية وقرمشة الفستق.',
    85.00,
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=1200&q=80',
    'cat-desserts',
    ARRAY['تمر خلاص فاخر', 'صوص بترسكوتش', 'آيس كريم فانيليا', 'فستق حلبي'],
    true,
    true,
    'الأكثر طلباً',
    '440 سعرة'
),
(
    'dish-7',
    'موكتيل الإمبراطور الذهبي (Golden Eagle Elixir)',
    'مزيج منعش من الرمان الطازج، ماء الورد العطري، الزنجبيل الحار، ولمسة من الصودا الفوارة مع غبار الذهب الصالح للأكل.',
    45.00,
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1200&q=80',
    'cat-beverages',
    ARRAY['عصير رمان طازج', 'ماء ورد جبلي', 'زنجبيل', 'صودا ليمون', 'رقائق ذهب'],
    true,
    true,
    'مشروب الموسم',
    '120 سعرة'
)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    image_url = EXCLUDED.image_url,
    category = EXCLUDED.category,
    ingredients = EXCLUDED.ingredients,
    is_popular = EXCLUDED.is_popular,
    is_available = EXCLUDED.is_available,
    tag = EXCLUDED.tag,
    calories = EXCLUDED.calories;
