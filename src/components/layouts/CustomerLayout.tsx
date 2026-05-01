import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import FloatingCart from '../FloatingCart';
import CartDrawer from '../CartDrawer';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

const CustomerLayout = ({ children }: CustomerLayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-primary/30 selection:text-primary">
      <Header />
      <main className="pt-24 min-h-[calc(100vh-400px)]">
        {children}
      </main>
      <Footer />
      <FloatingCart />
      <CartDrawer />
    </div>
  );
};

export default CustomerLayout;
