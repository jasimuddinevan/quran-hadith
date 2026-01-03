import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { useLanguage } from '@/contexts/LanguageContext';

const OfflineIndicator: React.FC = () => {
  const { isOnline } = useOfflineStatus();
  const { isEnglish } = useLanguage();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground py-2 px-4 flex items-center justify-center gap-2 text-sm">
      <WifiOff className="h-4 w-4" />
      <span>
        {isEnglish 
          ? "You're offline. Cached content is available." 
          : "আপনি অফলাইনে আছেন। ক্যাশ করা বিষয়বস্তু উপলব্ধ।"}
      </span>
    </div>
  );
};

export default OfflineIndicator;
