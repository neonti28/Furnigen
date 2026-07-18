import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/components/HomePage';
import DashboardPage from '@/components/DashboardPage';
import StudioPage from '@/components/StudioPage';
import AboutPage from '@/components/AboutPage';
import type { Page } from '@/types';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('home');

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage setActivePage={setActivePage} />;
      case 'dashboard':
        return <DashboardPage />;
      case 'studio':
        return <StudioPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {renderPage()}
      </main>
      <Footer setActivePage={setActivePage} />
    </div>
  );
};

export default App;
