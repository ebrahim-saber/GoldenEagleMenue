import { ShoppingCart, Search, Menu as MenuIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { totalItems } = useCart();

  return (
    <nav className="navbar glass">
      <div className="container navbar-container">
        <Link to="/" className="logo-font" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--tertiary)', textDecoration: 'none' }}>
          GOLDEN EAGLE
        </Link>
        
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
        
        <div className="nav-actions">
          <button className="icon-btn">
            <Search size={20} />
          </button>
          <Link to="/cart" className="icon-btn cart-btn">
            <ShoppingCart size={20} />
            <span className="cart-count">{totalItems}</span>
          </Link>
          <button className="icon-btn menu-mobile">
            <MenuIcon size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
