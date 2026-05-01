import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
// Customer Pages
import ScrollToTop from './components/common/ScrollToTop';
import Home from './features/menu/Home';
import ProductDetails from './features/menu/ProductDetails';
import Checkout from './features/orders/Checkout';
import Reservations from './pages/Reservations';
import PrivateDining from './pages/PrivateDining';
import Gallery from './pages/Gallery';

// Auth Pages
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import ProtectedRoute from './features/auth/ProtectedRoute';


// Layouts
import CustomerLayout from './components/layouts/CustomerLayout';
import AdminLayout from './components/layouts/AdminLayout';
import { AnimatePresence } from 'framer-motion';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenu from './pages/admin/AdminMenu';
import AdminOrders from './pages/admin/AdminOrders';
import AdminReservations from './pages/admin/AdminReservations';
import AdminCategories from './pages/admin/AdminCategories';
import AdminSettings from './pages/admin/AdminSettings';

import './styles/index.css';

import { SessionProvider } from './context/SessionContext';
import StayDurationModal from './components/session/StayDurationModal';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Customer Routes */}
        <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
        <Route path="/menu" element={<CustomerLayout><Home /></CustomerLayout>} />
        <Route path="/product/:id" element={<CustomerLayout><ProductDetails /></CustomerLayout>} />
        <Route path="/checkout" element={<CustomerLayout><Checkout /></CustomerLayout>} />
        <Route path="/reservations" element={<CustomerLayout><Reservations /></CustomerLayout>} />

        <Route path="/private-dining" element={<CustomerLayout><PrivateDining /></CustomerLayout>} />
        <Route path="/gallery" element={<CustomerLayout><Gallery /></CustomerLayout>} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<CustomerLayout><Login /></CustomerLayout>} />
        <Route path="/signup" element={<CustomerLayout><Signup /></CustomerLayout>} />

        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout><AdminDashboard /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/menu" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout><AdminMenu /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/categories" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout><AdminCategories /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout><AdminOrders /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/reservations" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout><AdminReservations /></AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/settings" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout><AdminSettings /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout><AdminDashboard /></AdminLayout>
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <CartProvider>
          <Router>
            <SessionProvider>
              <ScrollToTop />
              <StayDurationModal />
              <AnimatedRoutes />
            </SessionProvider>
          </Router>
        </CartProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;

