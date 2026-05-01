import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowLeft, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, totalPrice: subtotal } = useCart();
  const tax = subtotal * 0.1;
  const shipping = cart.length > 0 ? 5.00 : 0;
  const total = subtotal + tax + shipping;

  if (cart.length === 0) {
    return (
      <div className="cart-page container empty-state">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="empty-cart-content"
        >
          <div className="empty-icon">🛒</div>
          <h1>Your cart is empty</h1>
          <p>Browse our menu and discover something delicious.</p>
          <Link to="/">
            <Button size="lg">Explore Menu</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1 className="page-title">Shopping Cart</h1>
      
      <div className="cart-layout">
        <div className="cart-items">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div 
                key={`${item.id}-${JSON.stringify(item.customizations)}`} 
                className="cart-item card"
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="item-img">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <div className="flex gap-1 mt-1">
                    {item.customizations?.ingredients?.map((ing, i) => (
                      <span key={i} className="text-[8px] bg-primary/10 text-primary px-1 rounded uppercase">
                        {ing}
                      </span>
                    ))}
                  </div>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                </div>
                <div className="item-actions">
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.customizations)}><Minus size={16} /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.customizations)}><Plus size={16} /></button>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id, item.customizations)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          <Link to="/" className="continue-shopping">
            <ArrowLeft size={18} /> Continue Shopping
          </Link>
        </div>

        <div className="cart-summary card">
          <h2>Order Summary</h2>
          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Link to="/checkout">
            <Button fullWidth size="lg">
              Checkout <ShoppingBag size={20} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
