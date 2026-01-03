import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, ScrollText, HandHeart, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { icon: Home, label: t('nav.home'), path: '/' },
    { icon: BookOpen, label: t('nav.read'), path: '/read' },
    { icon: ScrollText, label: t('nav.hadith'), path: '/hadith' },
    { icon: HandHeart, label: t('nav.dua'), path: '/dua' },
    { icon: Settings, label: t('nav.settings'), path: '/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-lg border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                active 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className={`h-5 w-5 mb-1 ${active ? 'text-primary' : ''}`} />
              <span className={`text-xs font-medium ${active ? 'text-primary' : ''}`}>
                {item.label}
              </span>
              {active && (
                <div className="absolute bottom-0 w-12 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
