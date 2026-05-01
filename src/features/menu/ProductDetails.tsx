import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRAWAQ, type MenuItem } from '../../hooks/useRAWAQ';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleCart } = useCart();
  const { showNotification } = useNotification();
  const { getMenuItem, menuItems } = useRAWAQ();
  
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
        setSelectedIngredients(data.ingredients || []);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id, getMenuItem]);

  // Compute related items reactively — avoids calling setState inside an effect
  const pairings = useMemo<MenuItem[]>(() => {
    if (!product || menuItems.length === 0) return [];
    return menuItems
      .filter(item => item.id !== product.id && item.category === product.category)
      .slice(0, 3);
  }, [product, menuItems]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white space-y-8 font-headline">
        <p className="text-2xl font-light opacity-40 uppercase tracking-widest">Product not found</p>
        <button onClick={() => navigate('/')} className="rawa-btn bg-white/5 border border-white/10 px-12 py-4 rounded-full uppercase text-xs font-bold tracking-widest hover:bg-white hover:text-surface transition-all">
          Return to Menu
        </button>
      </div>
    );
  }

  const handleToggleIngredient = (ingredient: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient) 
        ? prev.filter(i => i !== ingredient) 
        : [...prev, ingredient]
    );
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      quantity: quantity,
      customizations: {
        ingredients: selectedIngredients,
        instructions: instructions
      }
    });
    showNotification(`${product.name} added to your collection`, 'success');
    toggleCart();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0 
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen pt-12 pb-20 px-6 md:px-12 max-w-[1920px] mx-auto overflow-hidden"
    >
      {/* Editorial Navigation */}
      <motion.nav variants={itemVariants} className="flex justify-between items-center mb-16 px-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-white/40 hover:text-white transition-all group"
        >
          <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-2 font-light">arrow_back</span>
          <span className="uppercase text-[10px] tracking-[0.3em] font-bold">Back to Collection</span>
        </button>
        <div className="hidden md:flex gap-8 text-[10px] tracking-[0.3em] font-bold uppercase text-white/20">
          <span>01 / Overview</span>
          <span className="text-tertiary">02 / Customize</span>
          <span>03 / Pairings</span>
        </div>
      </motion.nav>

      <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1fr] gap-20 xl:gap-32 items-start">
        {/* Immersive Image Sticky Section */}
        <section className="lg:sticky lg:top-32 flex justify-center">
          <motion.div 
            variants={itemVariants}
            className="relative aspect-square lg:aspect-[4/5] max-h-[60vh] lg:max-h-[75vh] w-full overflow-hidden rounded-2xl bg-[#121413] group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
          >
            <motion.img 
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90"></div>
            
            <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
              <div className="space-y-4">
                <span className="bg-tertiary text-on-tertiary px-6 py-2 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase">
                  {product.tag || 'Royal Selection'}
                </span>
                <div className="flex items-center gap-4 text-white/60">
                  <span className="material-symbols-outlined text-sm font-light">nutrition</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold">{product.calories || '450 kCal'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Content Section */}
        <section className="flex flex-col gap-16">
          <div className="space-y-8">
            <motion.header variants={itemVariants} className="space-y-4">
              <div className="flex items-center gap-2 text-tertiary text-[10px] font-extrabold tracking-[0.4em] uppercase">
                <span className="w-8 h-[1px] bg-tertiary"></span>
                <span>The Experience</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-headline font-extrabold tracking-tighter text-on-surface leading-[0.85] uppercase">
                {product.name}
              </h1>
            </motion.header>
            
            <motion.div variants={itemVariants} className="flex items-center gap-10">
              <span className="text-5xl font-light text-primary tracking-tight">SAR {product.price}</span>
              <div className="h-1 lg:h-8 w-[1px] bg-white/10 hidden md:block"></div>
              <div className="flex gap-4">
                {['Gluten Free', 'Signature'].map(tag => (
                  <span key={tag} className="border border-white/10 px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest text-white/30 font-bold">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.p variants={itemVariants} className="text-white/60 text-xl leading-relaxed font-light max-w-lg">
              {product.description}
            </motion.p>
          </div>

          {/* Customization Flow */}
          <div className="space-y-20">
            {/* Step 1: Ingredients */}
            <motion.div variants={itemVariants} className="space-y-10">
              <div className="flex items-center gap-6">
                <span className="text-tertiary font-headline font-black text-2xl italic">01</span>
                <label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 underline decoration-tertiary underline-offset-8">Adjust Palette</label>
              </div>
              <div className="flex flex-wrap gap-4">
                {Array.isArray(product.ingredients) && product.ingredients.map((ingredient) => (
                  <button
                    key={ingredient}
                    onClick={() => handleToggleIngredient(ingredient)}
                    className={`flex items-center gap-4 px-8 py-5 rounded-xl text-xs font-bold tracking-widest group transition-all duration-300 ${
                      selectedIngredients.includes(ingredient)
                        ? 'bg-primary text-on-primary shadow-xl shadow-primary/10'
                        : 'bg-white/[0.03] text-white/40 hover:text-white border border-white/5'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-sm ${selectedIngredients.includes(ingredient) ? 'fill-1' : ''}`}>
                      {selectedIngredients.includes(ingredient) ? 'check_circle' : 'add_circle'}
                    </span>
                    <span className="uppercase">{ingredient}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Step 2: Special Instructions */}
            <motion.div variants={itemVariants} className="space-y-10">
              <div className="flex items-center gap-6">
                <span className="text-tertiary font-headline font-black text-2xl italic">02</span>
                <label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40 underline decoration-tertiary underline-offset-8">Maître d' Instructions</label>
              </div>
              <textarea 
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full bg-white/[0.01] border border-white/10 rounded-2xl p-8 text-white min-h-[160px] focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-white/10 text-base font-light leading-relaxed outline-none"
                placeholder="Ex: Medium rare, sauce on side, allergies..."
              ></textarea>
            </motion.div>

            {/* Step 3: Quantity & Complete */}
            <motion.div variants={itemVariants} className="space-y-10 pt-8 border-t border-white/5">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center bg-white/[0.03] rounded-2xl p-2 border border-white/5">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-16 h-16 flex items-center justify-center text-white/40 hover:text-primary transition-all"
                  >
                    <span className="material-symbols-outlined font-light">remove</span>
                  </button>
                  <span className="w-12 text-center font-headline font-black text-2xl tracking-tighter">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-16 h-16 flex items-center justify-center text-white/40 hover:text-primary transition-all"
                  >
                    <span className="material-symbols-outlined font-light">add</span>
                  </button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-on-primary font-headline font-black uppercase tracking-[0.3em] py-6 rounded-2xl text-[11px] shadow-2xl transition-all duration-500 hover:brightness-110 active:scale-95 flex items-center justify-center gap-4"
                >
                  Add to Collection <span className="w-1.5 h-1.5 rounded-full bg-on-primary opacity-30"></span> SAR {(product.price * quantity).toFixed(2)}
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Sommelier Pairing Simulation */}
      <motion.section variants={itemVariants} className="mt-60 border-t border-white/5 pt-32">
        <div className="flex flex-col gap-6 mb-20 text-center">
          <span className="text-tertiary text-[10px] font-extrabold tracking-[0.5em] uppercase">The Art of Pairing</span>
          <h2 className="text-6xl md:text-7xl font-headline font-extrabold tracking-tighter uppercase leading-none">Complete the Experience</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {pairings.map((item) => (
            <motion.div 
              key={item.id}
              whileHover={{ y: -10 }}
              className="group bg-white/[0.01] rounded-3xl overflow-hidden transition-all duration-700 hover:bg-white/[0.03] border border-white/5"
            >
              <div className="aspect-[3/2] overflow-hidden bg-[#121413]">
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="w-full h-full object-cover grayscale transition-all duration-[2000ms] group-hover:grayscale-0 group-hover:scale-110"
                />
              </div>
              <div className="p-10 space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold font-headline leading-tight tracking-tight uppercase">{item.name}</h3>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-tertiary font-bold tracking-tight">SAR {item.price}</span>
                  <button 
                    onClick={() => {
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image_url,
                        quantity: 1
                      });
                      showNotification(`${item.name} added to your collection`, 'success');
                    }}
                    className="text-primary text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-4 transition-all pb-1 border-b border-primary/20"
                  >
                    Add Pairing <span className="material-symbols-outlined text-xs">arrow_right_alt</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default ProductDetails;
