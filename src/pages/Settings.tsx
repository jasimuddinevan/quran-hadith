import React from 'react';
import { Settings as SettingsIcon, Globe, Bell, MapPin, Moon, Sun } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Settings: React.FC = () => {
  const { t, language, setLanguage, isEnglish } = useLanguage();

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-muted mb-4">
            <SettingsIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('settings.title')}
          </h1>
          <p className="text-muted-foreground">
            {isEnglish ? 'Customize your experience' : 'আপনার অভিজ্ঞতা কাস্টমাইজ করুন'}
          </p>
        </div>

        <div className="max-w-lg mx-auto space-y-6">
          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5 text-primary" />
                {t('settings.language')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={isEnglish ? 'default' : 'outline'}
                  onClick={() => setLanguage('en')}
                  className="w-full"
                >
                  English
                </Button>
                <Button
                  variant={!isEnglish ? 'default' : 'outline'}
                  onClick={() => setLanguage('bn')}
                  className="w-full"
                >
                  বাংলা
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-5 w-5 text-primary" />
                {t('settings.notifications')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="prayer-reminder" className="font-medium">
                    {t('settings.prayerReminders')}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isEnglish 
                      ? 'Get notified before each prayer time' 
                      : 'প্রতিটি নামাজের সময়ের আগে নোটিফিকেশন পান'}
                  </p>
                </div>
                <Switch id="prayer-reminder" />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="daily-verse" className="font-medium">
                    {isEnglish ? 'Daily Verse' : 'দৈনিক আয়াত'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isEnglish 
                      ? 'Receive daily Quran verse notification' 
                      : 'প্রতিদিন কুরআনের আয়াত নোটিফিকেশন পান'}
                  </p>
                </div>
                <Switch id="daily-verse" />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="daily-hadith" className="font-medium">
                    {isEnglish ? 'Daily Hadith' : 'দৈনিক হাদিস'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isEnglish 
                      ? 'Receive daily Hadith notification' 
                      : 'প্রতিদিন হাদিস নোটিফিকেশন পান'}
                  </p>
                </div>
                <Switch id="daily-hadith" />
              </div>
            </CardContent>
          </Card>

          {/* Location Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                {t('settings.location')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-location" className="font-medium">
                    {isEnglish ? 'Auto-detect Location' : 'স্বয়ংক্রিয় অবস্থান'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isEnglish 
                      ? 'Use GPS for accurate prayer times' 
                      : 'সঠিক নামাজের সময়ের জন্য জিপিএস ব্যবহার করুন'}
                  </p>
                </div>
                <Switch id="auto-location" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-foreground mb-2">
                Quran Insight
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {isEnglish 
                  ? 'Version 1.0.0 • Made with love for the Ummah' 
                  : 'সংস্করণ ১.০.০ • উম্মাহর জন্য ভালোবাসায় তৈরি'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isEnglish 
                  ? '© 2024 Quran Insight. All rights reserved.' 
                  : '© ২০২৪ কুরআন ইনসাইট। সর্বস্বত্ব সংরক্ষিত।'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
