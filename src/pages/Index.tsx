import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import QuickAccessCards from '@/components/home/QuickAccessCards';
import TodayContent from '@/components/home/TodayContent';

const Index: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <QuickAccessCards />
      <TodayContent />
    </Layout>
  );
};

export default Index;
