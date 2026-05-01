import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  description?: string;
  size?: string;
  customizations?: {
    ingredients?: string[];
    instructions?: string;
  };
}

type CartState = {
  items: CartItem[];
  isCartOpen: boolean;
};

type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: { id: string; customizations?: CartItem['customizations'] } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number; customizations?: CartItem['customizations'] } }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'TOGGLE_CART' };

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, customizations?: CartItem['customizations']) => void;
  updateQuantity: (id: string, quantity: number, customizations?: CartItem['customizations']) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const areCustomizationsEqual = (c1: CartItem['customizations'], c2: CartItem['customizations']) => {
  return JSON.stringify(c1) === JSON.stringify(c2);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingIndex = state.items.findIndex(
        item => item.id === action.payload.id && areCustomizationsEqual(item.customizations, action.payload.customizations)
      );

      let newItems;
      if (existingIndex > -1) {
        newItems = [...state.items];
        newItems[existingIndex].quantity += action.payload.quantity;
      } else {
        newItems = [...state.items, action.payload];
      }
      return { ...state, items: newItems, isCartOpen: true };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(
          item => !(item.id === action.payload.id && areCustomizationsEqual(item.customizations, action.payload.customizations))
        ),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id && areCustomizationsEqual(item.customizations, action.payload.customizations)
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'OPEN_CART':
      return { ...state, isCartOpen: true };
    case 'CLOSE_CART':
      return { ...state, isCartOpen: false };
    case 'TOGGLE_CART':
      return { ...state, isCartOpen: !state.isCartOpen };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isCartOpen: false,
  }, (initial) => {
    const saved = localStorage.getItem('cart');
    return { ...initial, items: saved ? JSON.parse(saved) : [] };
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (item: CartItem) => dispatch({ type: 'ADD_TO_CART', payload: item });
  const removeFromCart = (id: string, customizations?: CartItem['customizations']) => dispatch({ type: 'REMOVE_FROM_CART', payload: { id, customizations } });
  const updateQuantity = (id: string, quantity: number, customizations?: CartItem['customizations']) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity, customizations } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const openCart = () => dispatch({ type: 'OPEN_CART' });
  const closeCart = () => dispatch({ type: 'CLOSE_CART' });
  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });

  const totalItems = state.items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
  const totalPrice = state.items.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart: state.items, 
      isCartOpen: state.isCartOpen,
      totalItems,
      totalPrice,
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      openCart,
      closeCart,
      toggleCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
