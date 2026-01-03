import React from 'react';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideFooter = false }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      {!hideFooter && <Footer />}
      <BottomNav />
    </div>
  );
};

export default Layout;
