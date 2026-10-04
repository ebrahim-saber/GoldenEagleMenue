import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Language = 'en' | 'ar';

export interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

export const translations: Translations = {
  // Navigation & Brand
  'brand.name': { en: 'Golden Eagle', ar: 'النسر الذهبي' },
  'brand.subtitle': { en: 'Signature Dining · Rawaq Resort', ar: 'منتجع رواق · ضيافة ملكية فاخرة' },
  'nav.menu': { en: 'Menu', ar: 'قائمة الطعام' },
  'nav.reservations': { en: 'Reservations', ar: 'الحجوزات' },
  'nav.private_dining': { en: 'Private Suites', ar: 'الأجنحة الخاصة' },
  'nav.gallery': { en: 'Gallery', ar: 'المعرض' },
  'nav.our_story': { en: 'Our Story', ar: 'قصتنا' },
  'nav.sign_in': { en: 'Sign In', ar: 'تسجيل الدخول' },
  'nav.sign_out': { en: 'Sign Out', ar: 'تسجيل الخروج' },
  'nav.admin': { en: 'Admin Portal', ar: 'لوحة الإدارة' },
  'nav.table': { en: 'Table', ar: 'طاولة' },

  // Hero Section
  'hero.tag': { en: 'Signature Dining Experience', ar: 'تجربة ضيافة ملكية استثنائية' },
  'hero.title_part1': { en: 'The Art of', ar: 'فنون الطهي و' },
  'hero.title_part2': { en: 'Culinary Luxury', ar: 'الفخامة الملكية' },
  'hero.desc': {
    en: 'An exquisite selection of signature dishes where heritage elegance meets modern gastronomy precision.',
    ar: 'تشكيلة حصرية من الأطباق الفاخرة التي تمزج بين عراقة التراث الملكي وأحدث فنون الطهي المعاصر.'
  },
  'hero.scroll': { en: 'Scroll to explore', ar: 'مرر للأسفل للاستكشاف' },

  // Home / Menu
  'menu.chefs_picks': { en: "Chef's Signature Picks", ar: 'أطباق الشيف المختارة' },
  'menu.popular': { en: 'Popular', ar: 'الأكثر طلباً' },
  'menu.categories': { en: 'Categories', ar: 'التصنيفات' },
  'menu.all_dishes': { en: 'All Dishes', ar: 'جميع الأطباق' },
  'menu.dishes': { en: 'dishes', ar: 'أطباق' },
  'menu.dish': { en: 'dish', ar: 'طبق' },
  'menu.vat_note': { en: 'Prices include VAT. Inform staff of any allergies.', ar: 'الأسعار تشمل ضريبة القيمة المضافة. يرجى إبلاغنا بأي حساسية طعام.' },
  'menu.search_placeholder': { en: 'Search dishes, ingredients...', ar: 'ابحث عن طبق أو مكوّن...' },
  'menu.clear_search': { en: 'Clear search', ar: 'مسح البحث' },
  'menu.no_dishes': { en: 'No dishes found matching your search', ar: 'لم يتم العثور على أطباق تطابق بحثك' },
  'menu.view_all': { en: 'View all dishes', ar: 'عرض جميع الأطباق' },
  'menu.unavailable': { en: 'Unavailable', ar: 'غير متوفر حالياً' },
  'menu.details': { en: 'Details', ar: 'التفاصيل' },
  'menu.add_to_order': { en: 'Add to Order', ar: 'أضف للطلب' },
  'menu.added_notification': { en: 'added to your order', ar: 'تمت إضافته إلى طلبك' },
  'currency': { en: 'SAR', ar: 'ريال' },

  // Product Details
  'details.back': { en: 'Back to Menu', ar: 'العودة لقائمة الطعام' },
  'details.step1': { en: '01 · Overview', ar: '01 · تفاصيل الصنف' },
  'details.step2': { en: '02 · Customize', ar: '02 · التخصيص' },
  'details.step3': { en: '03 · Confirm', ar: '03 · التأكيد' },
  'details.experience': { en: 'The Royal Creation', ar: 'الإبداع الملكي' },
  'details.customize_ingredients': { en: 'Customize Ingredients (Click to toggle)', ar: 'تخصيص المكونات (اضغط للإضافة أو الإزالة)' },
  'details.instructions_label': { en: "Maître D' & Chef Instructions", ar: 'تعليمات خاصة للشيف والمضيف' },
  'details.instructions_placeholder': { en: 'Ex: Medium rare, sauce on side, allergies...', ar: 'مثال: بدون بهارات حارة، صوص جانبي، حساسية...' },
  'details.add_to_order_action': { en: 'Add to Order', ar: 'إضافة إلى الطلب' },
  'details.pairings_title': { en: 'Recommended Pairings', ar: 'أطباق مقترحة تناسب اختيارك' },
  'details.pairings_subtitle': { en: 'Complete your luxury dining experience', ar: 'أكمل تجربتك بأطباق متناغمة' },
  'details.add_pairing': { en: 'Add Pairing', ar: 'إضافة المقترح' },
  'details.not_found': { en: 'Dish not found or unavailable', ar: 'الصنف غير متوفر حالياً' },

  // Cart Drawer & Floating Cart
  'cart.title': { en: 'Your Order', ar: 'سلة طلباتك' },
  'cart.tagline': { en: 'Golden Eagle Fine Dining', ar: 'النسر الذهبي · خدمة ملكية' },
  'cart.empty_title': { en: 'Your cart is currently empty.', ar: 'سلتك فارغة حالياً.' },
  'cart.empty_desc': { en: 'Explore our signature menu to add delicious dishes.', ar: 'تفضل باختيار أطباقك من قائمة الطعام.' },
  'cart.subtotal': { en: 'Subtotal', ar: 'مجموع الأصناف' },
  'cart.service_vat': { en: 'Hospitality & VAT', ar: 'الخدمة والضريبة' },
  'cart.calculated_at_checkout': { en: 'Calculated at checkout', ar: 'تُحسب عند الدفع' },
  'cart.estimated_total': { en: 'Estimated Total', ar: 'الإجمالي التقديري' },
  'cart.proceed_checkout': { en: 'Proceed to Checkout', ar: 'متابعة الطلب وتأكيد الحجز' },
  'cart.floating_selection': { en: 'Your Current Selection', ar: 'سلة طلبك الحالي' },
  'cart.dishes_selected': { en: 'Selected Dishes', ar: 'أطباق مختارة' },

  // Checkout Page
  'checkout.final_review': { en: 'Final Review', ar: 'المراجعة النهائية' },
  'checkout.title_summary': { en: 'Order Summary', ar: 'ملخص الطلب' },
  'checkout.subtitle': { en: 'Review your culinary selection and confirm your dining experience.', ar: 'راجع أطباقك المختارة وأكد طلب الضيافة الملكية.' },
  'checkout.selected_items': { en: 'Selected Dishes', ar: 'الأطباق المختارة' },
  'checkout.add_more': { en: 'Add more dishes', ar: 'إضافة أطباق أخرى' },
  'checkout.service_details': { en: 'Service & Guest Details', ar: 'بيانات الحضور والخدمة' },
  'checkout.guest_name': { en: 'Guest Name', ar: 'اسم الضيف' },
  'checkout.guest_phone': { en: 'Phone Number', ar: 'رقم الهاتف' },
  'checkout.table_number': { en: 'Table / Suite Number', ar: 'رقم / اسم الطاولة' },
  'checkout.notes_label': { en: 'Special Culinary Instructions', ar: 'ملاحظات خاصة للشيف' },
  'checkout.notes_placeholder': { en: 'Dietary preferences, allergies, preparation style...', ar: 'طريقة الطهي، تفضيلات معينة، حساسية...' },
  'checkout.billing_details': { en: 'Billing Details', ar: 'تفاصيل الفاتورة' },
  'checkout.items_total': { en: 'Dishes Total', ar: 'مجموع الأصناف' },
  'checkout.service_fee': { en: 'Hospitality Service Fee (10%)', ar: 'رسوم الخدمة الفندقية (10%)' },
  'checkout.vat': { en: 'VAT (15%)', ar: 'ضريبة القيمة المضافة (15%)' },
  'checkout.final_total': { en: 'Final Total', ar: 'المجموع النهائي' },
  'checkout.all_inclusive': { en: 'Inclusive of all fees and taxes', ar: 'شامل كافة الرسوم والضرائب' },
  'checkout.confirm_button': { en: 'Confirm & Send to Kitchen', ar: 'تأكيد وإرسال الطلب للمطبخ' },
  'checkout.submitting': { en: 'Submitting your order...', ar: 'جاري إرسال الطلب للمطبخ...' },
  'checkout.kitchen_notify': { en: 'Your order will be sent directly to the kitchen display for your table.', ar: 'سيصل الطلب مباشرة إلى شاشة المطبخ وإشعار طاقم الخدمة لطاولتك.' },
  'checkout.empty_error': { en: 'Your cart is empty. Please add items from the menu.', ar: 'سلة طلباتك فارغة. يرجى اختيار أطباق من المنيو.' },
  'checkout.success_notification': { en: 'Order confirmed! It is now being prepared in the kitchen.', ar: 'تم استلام وتأكيد طلبك بنجاح! يتم تحضيره في المطبخ الآن.' },

  // Reservations Page
  'res.tag': { en: 'Private Dining & Reservations', ar: 'الحجوزات الملكية الفاخرة' },
  'res.title': { en: 'Reserve Your Moment', ar: 'احجز طاولتك الملكية' },
  'res.subtitle': { en: 'Secure your distinguished table at Golden Eagle and experience premier culinary mastery.', ar: 'احجز طاولتك في منتجع النسر الذهبي واستمتع بأرقى فنون الضيافة العالمية.' },
  'res.step1': { en: '01 · Date & Time Selection', ar: '01 · تحديد التاريخ والوقت' },
  'res.step1_sub': { en: 'Select your preferred dining date and service hour', ar: 'اختر موعد زيارتك وساعة الخدمة المفضلة' },
  'res.step2': { en: '02 · Guest Information', ar: '02 · بيانات الضيف والحضور' },
  'res.step2_sub': { en: 'Guest contact info and party size', ar: 'معلومات التواصل وعدد أفراد الطاولة' },
  'res.party_size': { en: 'Party Size (Seats)', ar: 'عدد المقاعد المطلوبة' },
  'res.solo': { en: 'Solo', ar: 'فرد' },
  'res.guests_unit': { en: 'Guests', ar: 'أفراد' },
  'res.service_hours': { en: 'Available Service Windows', ar: 'أوقات الخدمة المتاحة' },
  'res.grace_period': { en: 'Reservations are held for 20 minutes past the scheduled time.', ar: 'يتم حفظ الحجز لمدة 20 دقيقة بعد الموعد المحدد.' },
  'res.full_name': { en: 'Full Legal Name', ar: 'الاسم الكامل' },
  'res.email': { en: 'Email Address', ar: 'البريد الإلكتروني' },
  'res.phone': { en: 'Direct Phone', ar: 'رقم الهاتف' },
  'res.special_requests': { en: 'Special Requests / Occasion Details', ar: 'مناسبة خاصة، موقع الطاولة، أو طلبات إضافية' },
  'res.summary_title': { en: 'Reservation Summary', ar: 'ملخص الحجز' },
  'res.service_date': { en: 'Service Date', ar: 'تاريخ الزيارة' },
  'res.entry_time': { en: 'Entry Time', ar: 'توقيت الحجز' },
  'res.seats': { en: 'Party Seats', ar: 'عدد المقاعد' },
  'res.deposit': { en: 'Reservation Fee', ar: 'رسوم الحجز' },
  'res.free_at_venue': { en: 'Complimentary (Settlement at Venue)', ar: 'مجاناً (الدفع في الصالة)' },
  'res.confirm_btn': { en: 'Confirm Reservation', ar: 'تأكيد الحجز الملكي' },
  'res.confirming': { en: 'Securing your table...', ar: 'جاري تأكيد الحجز...' },
  'res.success_title': { en: 'Reservation Confirmed', ar: 'تم تأكيد الحجز بنجاح' },
  'res.success_desc': { en: 'Your table has been reserved. We look forward to welcoming you.', ar: 'طاولتك جاهزة ومحجوزة. نتطلع لتشريفكم وخدمتكم.' },
  'res.back_home': { en: 'Return to Home', ar: 'العودة للرئيسية' },
  'res.explore_menu_btn': { en: 'Explore Menu & Pre-Order', ar: 'استكشف المنيو واطلب مسبقاً' },

  // Private Dining Suites
  'suites.tag': { en: 'Bespoke Sanctuaries', ar: 'أجنحة الضيافة الحصرية' },
  'suites.title': { en: 'Private Suites', ar: 'الأجنحة الخاصة' },
  'suites.desc': {
    en: 'From discrete executive summits to intimate celebrations, our private dining suites offer complete discretion and tailored choreography.',
    ar: 'سواء كان عشاء عمل رفيع المستوى أو مناسبة عائلية خاصة، توفر أجنحتنا الخاصة أقصى درجات الخصوصية وقوائم طعام مصممة خصيصاً.'
  },
  'suites.request_btn': { en: 'Request Suite Booking', ar: 'طلب حجز الجناح' },
  'suites.inquiry_title': { en: 'Bespoke Private Suite Inquiry', ar: 'طلب حجز جناح خاص' },
  'suites.inquiry_sub': { en: 'Imperial Concierge Relations', ar: 'قسم علاقات الضيافة الملكية' },
  'suites.host_name': { en: 'Host Full Name', ar: 'اسم الضيف الكامل' },
  'suites.host_email': { en: 'Email Address', ar: 'البريد الإلكتروني' },
  'suites.host_phone': { en: 'Phone Number', ar: 'رقم الهاتف' },
  'suites.preferred_suite': { en: 'Suite Preference', ar: 'الجناح المطلوب' },
  'suites.custom_notes': { en: 'Custom Manifestations & Requests', ar: 'الطلبات والترتيبات الإضافية' },
  'suites.submit_btn': { en: 'Submit Inquiry', ar: 'إرسال طلب الحجز' },
  'suites.submitting': { en: 'Dispatching request...', ar: 'جاري إرسال الطلب...' },

  // Gallery
  'gallery.tag': { en: 'Visual Immersion', ar: 'معرض الصور' },
  'gallery.title': { en: 'The Gallery', ar: 'معرض الأجواء الملكية' },
  'gallery.all': { en: 'All', ar: 'الكل' },
  'gallery.cuisine': { en: 'Cuisine', ar: 'الأطباق' },
  'gallery.ambiance': { en: 'Ambiance', ar: 'الأجواء' },
  'gallery.interiors': { en: 'Interiors', ar: 'الديكورات' },
  'gallery.cocktails': { en: 'Beverages', ar: 'المشروبات' },
  'gallery.outro_tag': { en: 'The Craft of Ambiance', ar: 'حرفية الأجواء الفاخرة' },
  'gallery.outro_title': { en: 'Where every moment becomes part of history.', ar: 'حيث تصبح كل لحظة جزءاً من الذاكرة والتاريخ.' },

  // Our Story
  'story.tag': { en: 'The Genesis', ar: 'البداية والرسالة' },
  'story.title': { en: 'A Legacy Refined', ar: 'إرث من الفخامة المتجددة' },
  'story.manifesto_tag': { en: 'Historical Context', ar: 'السياق التراثي' },
  'story.manifesto_title': { en: 'Bridging Eras of Excellence', ar: 'الربط بين الأصالة والتميز' },
  'story.manifesto_quote': {
    en: '"Golden Eagle is not merely a dining venue; it is an architectural and sensory homage to heritage, redefined through the boundary of modern gastronomy."',
    ar: '"النسر الذهبي ليس مجرد مطعم؛ بل هو تجسيد حي لتاريخ الضيافة الملكية حيث تلتقي فخامة العمارة بأرقى معايير الطهي العالمي الحديث."'
  },
  'story.manifesto_body': {
    en: 'Founded in the heart of the luxury resort, we curate experiences that transcend the table, transforming each meal into an unforgettable memory.',
    ar: 'تأسس المنتجع في قلب الواحة الملكية ليكون صرحاً يكرّم التراث ويثري التجربة الشخصية لكل زائر بمكونات طبيعية وأصيلة.'
  },
  'story.principles_tag': { en: "The Eagle's Principles", ar: 'ركائز النسر الذهبي' },
  'story.p1_title': { en: 'Authentic Provenance', ar: 'أصالة المكونات' },
  'story.p1_desc': { en: 'Sourced directly from certified organic estates and rare artisan purveyors.', ar: 'توريد مباشر وحصري من مزارع عضوية معتمدة ومصادر موثوقة.' },
  'story.p2_title': { en: 'Culinary Precision', ar: 'دقة الطهي والتحضير' },
  'story.p2_desc': { en: 'Traditional embers married with modern molecular gastronomical technique.', ar: 'نار الحطب التقليدية مع أحدث تقنيات الطهي لابتكار مذاق استثنائي.' },
  'story.p3_title': { en: 'Tailored Hospitality', ar: 'ضيافة شخصية ملكية' },
  'story.p3_desc': { en: 'Every service window orchestrated for complete sensory and behavioral focus.', ar: 'تجربة ضيافة مصممة خصيصاً لكل مناسبة وضيف بأقصى درجات الاهتمام.' },

  // Search Overlay
  'search.title': { en: 'Search Menu Collection', ar: 'البحث في قائمة الطعام الملكية' },
  'search.placeholder': { en: 'What are you craving? (Ribeye, Salmon, Truffle...)', ar: 'ما الذي تشتهيه اليوم؟ (ريب آي، سلمون، ترافل...)' },
  'search.no_matches': { en: 'No matching dishes found in our collection.', ar: 'لم نجد أطباقاً تطابق بحثك حالياً.' },

  // Stay Modal
  'stay.welcome': { en: 'Welcome to Golden Eagle', ar: 'مرحباً بكم في النسر الذهبي' },
  'stay.desc': { en: 'Please provide your stay dates to tailor your hospitality experience', ar: 'حدد تواريخ إقامتك لتخصيص خدمات الضيافة والطلبات' },
  'stay.arrival': { en: 'Arrival Date', ar: 'تاريخ الوصول' },
  'stay.departure': { en: 'Departure Date', ar: 'تاريخ المغادرة' },
  'stay.confirm': { en: 'Confirm & Begin Experience', ar: 'تأكيد وبدء التجربة' },
  'stay.browse_first': { en: 'Browse Menu First as Guest', ar: 'تصفح قائمة الطعام أولاً كزائر' },

  // Footer
  'footer.about': {
    en: 'Where architectural legacy meets modern culinary precision. Golden Eagle is the signature sanctuary of Rawaq Resort.',
    ar: 'حيث تلتقي العمارة التراثية بالدقة الفندقية الحديثة لتجربة طهي واستجمام ملكية لا مثيل لها.'
  },
  'footer.club_title': { en: 'The Eagle Circle', ar: 'نادي النخبة الملكي' },
  'footer.club_desc': { en: 'Priority access to seasonal vaults & culinary tastings.', ar: 'كن أول من يتلقى دعوات تذوق القوائم الموسمية الحصرية.' },
  'footer.club_placeholder': { en: 'name@luxury.com', ar: 'name@luxury.com' },
  'footer.club_join': { en: 'Join', ar: 'انضمام' },
  'footer.links_main': { en: 'Main Navigation', ar: 'الأقسام الرئيسية' },
  'footer.links_resort': { en: 'The Resort', ar: 'عن المنتجع' },
  'footer.links_contact': { en: 'Concierge & Inquiries', ar: 'التواصل والخدمة' },
  'footer.links_staff': { en: 'Management', ar: 'بوابة الإدارة' },
  'footer.admin_portal': { en: 'Admin Portal', ar: 'دخول المشرفين' },
  'footer.rights': { en: 'All Rights Reserved.', ar: 'جميع الحقوق محفوظة.' },

  // Admin Dashboard & Sidebar
  'admin.overview': { en: 'Live Lounge Overview', ar: 'نظرة عامة على الصالة' },
  'admin.overview_sub': { en: 'Real-time kitchen orders, table turnover, and reservations', ar: 'متابعة فورية للطلبات، إشغال المطبخ، وحجوزات اليوم' },
  'admin.live_orders': { en: 'Active Orders', ar: 'الطلبات النشطة' },
  'admin.today_reservations': { en: 'Reservations', ar: 'الحجوزات' },
  'admin.orders_management': { en: 'Order Management', ar: 'إدارة الطلبات المباشرة' },
  'admin.orders_sub': { en: 'Track and update dine-in orders in real-time', ar: 'تتبع وإدارة جميع طلبات صالة المطعم في الوقت الفعلي' },
  'admin.reservations_management': { en: 'Reservations Management', ar: 'إدارة حجوزات الطاولات' },
  'admin.menu_management': { en: 'Menu Management', ar: 'إدارة قائمة الطعام' },
  'admin.menu_sub': { en: 'Add dishes, update prices, and control availability', ar: 'إضافة وتعديل الأطباق، ضبط الأسعار، وتحديد التوفر' },
  'admin.categories_management': { en: 'Categories Management', ar: 'إدارة التصنيفات' },
  'admin.settings_title': { en: 'System Settings', ar: 'إعدادات النظام' },
  'admin.settings_sub': { en: 'Configure resort info, taxes, and service availability', ar: 'تخصيص معلومات المنتجع وإعدادات المنيو والضرائب' },
  'admin.status_all': { en: 'All', ar: 'الكل' },
  'admin.status_pending': { en: 'Pending', ar: 'قيد الانتظار' },
  'admin.status_preparing': { en: 'In Kitchen', ar: 'جاري التحضير' },
  'admin.status_ready': { en: 'Ready to Serve', ar: 'جاهز للتقديم' },
  'admin.status_served': { en: 'Completed', ar: 'تم التقديم' },
  'admin.action_start_preparing': { en: 'Start Kitchen Prep', ar: 'بدء التحضير' },
  'admin.action_mark_ready': { en: 'Ready to Serve', ar: 'جاهز للتقديم' },
  'admin.action_mark_served': { en: 'Mark Completed', ar: 'تم التقديم والإغلاق' },
  'admin.bill_details': { en: 'Invoice Details', ar: 'تفاصيل الفاتورة' },
  'admin.print_bill': { en: 'Print Receipt', ar: 'طباعة الإيصال' },
  'admin.add_dish_btn': { en: 'Add New Dish', ar: 'إضافة طبق جديد' },
  'admin.add_category_btn': { en: 'Add Category', ar: 'إضافة تصنيف جديد' },
  'admin.customer_preview': { en: 'View Customer Menu', ar: 'معاينة واجهة الزبائن' },
};

interface LanguageContextType {
  language: Language;
  direction: 'ltr' | 'rtl';
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('rawaq_lang') as Language;
    return saved === 'ar' || saved === 'en' ? saved : 'en';
  });

  const direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('rawaq_lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    if (language === 'ar') {
      document.documentElement.classList.add('font-arabic');
    } else {
      document.documentElement.classList.remove('font-arabic');
    }
  }, [language, direction]);

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'en' ? 'ar' : 'en'));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || entry.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
