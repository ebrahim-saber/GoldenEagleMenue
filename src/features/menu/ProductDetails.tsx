import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useRAWAQ,
  getDishName,
  getDishDescription,
  getDishIngredients,
  getDishTag,
  getDishCalories,
  type MenuItem
} from '../../hooks/useRAWAQ';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleCart } = useCart();
  const { showNotification } = useNotification();
  const { getMenuItem, menuItems } = useRAWAQ();
  const { language, direction, t } = useLanguage();
  
  const [product, setProduct] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
 
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      const data = await getMenuItem(id);
      if (data) {
        setProduct(data);
        setSelectedIngredients(getDishIngredients(data, language));
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id, getMenuItem, language]);

  // Compute related items reactively
  const pairings = useMemo<MenuItem[]>(() => {
    if (!product || menuItems.length === 0) return [];
    return menuItems
      .filter(item => item.id !== product.id)
      .slice(0, 3);
  }, [product, menuItems]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white space-y-6 font-headline px-4 text-center">
        <p className="text-xl font-bold opacity-60 uppercase tracking-widest">{t('details.not_found')}</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-primary text-on-primary px-8 py-3 rounded-xl uppercase text-xs font-bold tracking-wider hover:brightness-110 transition-all"
        >
          {t('details.back')}
        </button>
      </div>
    );
  }

  const localizedIngredients = getDishIngredients(product, language);

  const handleToggleIngredient = (ingredient: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient) 
        ? prev.filter(i => i !== ingredient) 
        : [...prev, ingredient]
    );
  };

  const handleAddToCart = () => {
    if (!product) return;
    const name = getDishName(product, language);
    addToCart({
      id: product.id,
      name,
      price: product.price,
      image: product.image_url,
      quantity,
      customizations: {
        ingredients: selectedIngredients,
        instructions
      }
    });
    showNotification(`"${name}" ${t('menu.added_notification')}`, 'success');
    toggleCart();
  };

  return (
    <div className="min-h-screen pt-8 pb-16 px-4 sm:px-8 md:px-12 max-w-[1600px] mx-auto font-headline" dir={direction}>
      {/* Top Breadcrumb & Navigation */}
      <nav className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-all text-xs font-bold uppercase tracking-wider group"
        >
          <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1">
            {direction === 'rtl' ? 'arrow_forward' : 'arrow_back'}
          </span>
          <span>{t('details.back')}</span>
        </button>
        <div className="hidden sm:flex gap-6 text-[11px] tracking-wider font-bold uppercase text-white/30">
          <span className="text-tertiary">{t('details.step1')}</span>
          <span>{t('details.step2')}</span>
          <span>{t('details.step3')}</span>
        </div>
      </nav>

      {/* Main Grid: Image Left, Controls Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Sticky Image Section */}
        <section className="lg:col-span-6 lg:sticky lg:top-24">
          <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-2xl bg-surface-container-low border border-white/10 shadow-2xl">
            <img 
              src={product.image_url} 
              alt={getDishName(product, language)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
            
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div className="space-y-2">
                <span className="inline-block bg-tertiary text-on-tertiary px-3.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase shadow-md">
                  {getDishTag(product, language)}
                </span>
                {product.calories && (
                  <div className="flex items-center gap-2 text-white/80 text-xs font-bold">
                    <span className="material-symbols-outlined text-sm text-primary">local_fire_department</span>
                    <span>{getDishCalories(product, language)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content & Customization Section */}
        <section className="lg:col-span-6 space-y-8">
          {/* Header Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-tertiary text-xs font-black tracking-[0.2em] uppercase">
              <span className="w-6 h-[2px] bg-tertiary" />
              <span>{t('details.experience')}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-on-surface uppercase leading-tight">
              {getDishName(product, language)}
            </h1>

            <div className="flex items-baseline gap-4 pt-1">
              <span className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
                {product.price} <span className="text-base font-normal text-white/50">{t('currency')}</span>
              </span>
              <div className="h-5 w-[1px] bg-white/10" />
              <div className="flex gap-2">
                <span className="border border-white/10 px-3 py-1 rounded-full text-[10px] uppercase font-bold text-white/50">
                  {language === 'ar' ? 'طهي طازج' : 'Freshly Prepared'}
                </span>
                <span className="border border-white/10 px-3 py-1 rounded-full text-[10px] uppercase font-bold text-white/50">
                  {language === 'ar' ? 'فاخر' : 'Signature'}
                </span>
              </div>
            </div>

            <p className="text-white/60 text-sm sm:text-base leading-relaxed font-light pt-2">
              {getDishDescription(product, language)}
            </p>
          </div>

          {/* Customization Step 1: Ingredients */}
          {localizedIngredients.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/50">
                <span className="text-tertiary font-black">01</span>
                <span>{t('details.customize_ingredients')}</span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {localizedIngredients.map((ingredient) => {
                  const isSelected = selectedIngredients.includes(ingredient);
                  return (
                    <button
                      key={ingredient}
                      onClick={() => handleToggleIngredient(ingredient)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-primary text-on-primary shadow-md shadow-primary/20'
                          : 'bg-white/5 text-white/40 hover:text-white border border-white/5'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isSelected ? 'check_circle' : 'add_circle'}
                      </span>
                      <span>{ingredient}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customization Step 2: Special Instructions */}
          <div className="space-y-2 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/50">
              <span className="text-tertiary font-black">02</span>
              <span>{t('details.instructions_label')}</span>
            </div>
            <textarea 
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-xs leading-relaxed focus:border-primary outline-none transition-colors placeholder:text-white/20 resize-none h-24"
              placeholder={t('details.instructions_placeholder')}
            />
          </div>

          {/* Step 3: Quantity & Add to Cart Action */}
          <div className="pt-4 border-t border-white/5 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch">
              <div className="flex items-center justify-between sm:justify-start bg-white/5 rounded-xl border border-white/5 p-1">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                  aria-label="Decrease quantity"
                >
                  <span className="material-symbols-outlined text-base">remove</span>
                </button>
                <span className="w-10 text-center font-black text-lg text-white">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                  aria-label="Increase quantity"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-on-primary font-black uppercase tracking-wider py-4 px-6 rounded-xl text-xs shadow-xl shadow-primary/20 transition-all hover:brightness-110 active:scale-95 flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined text-base">shopping_bag</span>
                <span>{t('details.add_to_order_action')}</span>
                <span className="opacity-40">·</span>
                <span>{(product.price * quantity).toFixed(0)} {t('currency')}</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Recommended Pairings Section */}
      {pairings.length > 0 && (
        <section className="mt-16 md:mt-24 border-t border-white/5 pt-12 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-tertiary text-xs font-black tracking-[0.3em] uppercase">{t('details.pairings_subtitle')}</span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              {t('details.pairings_title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pairings.map((item) => {
              const pairName = getDishName(item, language);
              return (
                <div 
                  key={item.id}
                  className="group bg-surface-container-low rounded-2xl overflow-hidden border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-surface relative">
                    <img 
                      src={item.image_url} 
                      alt={pairName} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-surface/80 backdrop-blur-md text-primary font-black text-xs rounded-lg">
                      {item.price} {t('currency')}
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <h3 className="text-base font-bold text-white uppercase tracking-tight leading-snug">
                      {pairName}
                    </h3>
                    <button 
                      onClick={() => {
                        addToCart({
                          id: item.id,
                          name: pairName,
                          price: item.price,
                          image: item.image_url,
                          quantity: 1
                        });
                        showNotification(`"${pairName}" ${t('menu.added_notification')}`, 'success');
                      }}
                      className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-primary hover:text-on-primary text-white/80 text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      <span>{t('details.add_pairing')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
