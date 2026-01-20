import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, BookOpen, Mail, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t, isEnglish } = useLanguage();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: '/quran', label: isEnglish ? 'Quran' : 'কুরআন' },
    { path: '/hadith', label: isEnglish ? 'Hadith' : 'হাদিস' },
    { path: '/dua', label: isEnglish ? 'Duas' : 'দোয়া' },
    { path: '/prayer', label: isEnglish ? 'Prayer Times' : 'নামাজের সময়' },
  ];

  const resources = [
    { path: '/names-of-allah', label: isEnglish ? '99 Names of Allah' : 'আল্লাহর ৯৯ নাম' },
    { path: '/bookmarks', label: isEnglish ? 'Bookmarks' : 'বুকমার্ক' },
    { path: '/settings', label: isEnglish ? 'Settings' : 'সেটিংস' },
  ];

  return (
    <footer className="border-t border-border">
      {/* Main Footer */}
      <div className="bg-card">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-foreground">
                    {t('hero.title')}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t('hero.subtitle')}
                  </span>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isEnglish 
                  ? 'Your comprehensive Islamic learning companion for Quran, Hadith, and daily guidance.'
                  : 'কুরআন, হাদিস এবং দৈনিক গাইডেন্সের জন্য আপনার সম্পূর্ণ ইসলামিক শিক্ষা সঙ্গী।'}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">
                {isEnglish ? 'Quick Links' : 'দ্রুত লিংক'}
              </h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">
                {isEnglish ? 'Resources' : 'রিসোর্স'}
              </h4>
              <ul className="space-y-2">
                {resources.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Get the App */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">
                {isEnglish ? 'Get the App' : 'অ্যাপ ডাউনলোড'}
              </h4>
              <div className="flex flex-col gap-2">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90 transition-opacity w-fit"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  App Store
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90 transition-opacity w-fit"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 20.5v-17c0-.83.52-1.58 1.31-1.87l11.94 10.37-11.94 10.37c-.79-.29-1.31-1.04-1.31-1.87zm14.44-6.5l-2.68-2.33 2.68-2.33 3.02 2.33c.56.49.56 1.18 0 1.66l-3.02 2.67zm-3.56-3.1L5.5 3.47l8.38 7.26v.54zm0 1.2v.54l-8.38 7.26 8.38-7.8z"/>
                  </svg>
                  Google Play
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-muted/50">
        <div className="container py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
            <p>
              © {currentYear} {isEnglish ? 'IlmPath. All rights reserved.' : 'ইলমপাথ। সর্বস্বত্ব সংরক্ষিত।'}
            </p>
            <div className="flex items-center gap-1">
              <span>{t('footer.madeWith')}</span>
              <Heart className="h-3.5 w-3.5 text-destructive fill-destructive" />
              <span>{isEnglish ? 'by' : 'তৈরি করেছেন'}</span>
              <a 
                href="https://bio.link/jasimuddin" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline transition-colors inline-flex items-center gap-1"
              >
                Jasim Uddin
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
